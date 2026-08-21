import { NextRequest, NextResponse } from "next/server";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";
import { RawActivityResponse, LearningEvidence } from "@/types/learning";
import { ActivityEvaluatorFactory } from "@/domain/learning/evaluators/ActivityEvaluatorFactory";
import { MasteryUpdatePolicy } from "@/domain/learning/MasteryUpdatePolicy";
import { KnowledgeMastery } from "@/types/memory";
import { ReviewSession } from "@/types/adaptiveReview";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;
    const { sessionId } = await params;

    const body = await req.json().catch(() => ({}));
    const { activityId, rawResponse, hintsUsed = 0, responseTimeMs = 2000 } = body as {
      activityId: string;
      rawResponse: RawActivityResponse;
      hintsUsed?: number;
      responseTimeMs?: number;
    };

    if (!activityId || !rawResponse) {
      return NextResponse.json(
        { success: false, message: "Thiếu activityId hoặc rawResponse." },
        { status: 400 }
      );
    }

    // 1. Fetch Review Session
    const reviewSessionRepo = RepositoryFactory.getReviewSessionRepository();
    const session = await reviewSessionRepo.getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy phiên ôn tập '${sessionId}'.` },
        { status: 404 }
      );
    }

    if (session.status !== "in_progress") {
      return NextResponse.json(
        { success: false, message: "Phiên ôn tập này đã kết thúc." },
        { status: 400 }
      );
    }

    // 2. Authorize Child Ownership
    const childRepo = RepositoryFactory.getChildRepository();
    const authResult = await authorizeChildAccess(parentUid, session.childId, childRepo);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.statusCode }
      );
    }

    // 3. Match Expected Activity
    const currentItem = session.items[session.currentActivityIndex];
    if (!currentItem || currentItem.activity.id !== activityId) {
      return NextResponse.json(
        {
          success: false,
          message: `Không khớp thứ tự hoạt động: Đang ở bài '${currentItem?.activity.id}', nhận kết quả '${activityId}'.`,
        },
        { status: 400 }
      );
    }

    // 4. Server-Authoritative Evaluation
    const evaluator = ActivityEvaluatorFactory.getEvaluator(currentItem.activity);
    const evalResult = evaluator.evaluate(currentItem.activity, rawResponse, hintsUsed);

    // 5. Create Server-Trusted LearningEvidence
    const now = new Date().toISOString();
    const trustedEvidence: LearningEvidence = {
      childId: session.childId,
      lessonId: session.id,
      activityId: currentItem.activity.id,
      knowledgeIds: [currentItem.knowledgeId],
      skill: currentItem.recommendation.targetSkill,
      attemptNumber: session.evidences.filter((e) => e.activityId === activityId).length + 1,
      correct: evalResult.correct,
      score: evalResult.score,
      responseTimeMs,
      hintsUsed,
      startedAt: session.startedAt,
      completedAt: now,
      pronunciationScore: evalResult.pronunciationScore,
    };

    // 6. Update Knowledge Mastery in MemoryRepository for the TARGET SKILL dimension
    const memoryRepo = RepositoryFactory.getMemoryRepository();
    const existingMastery = (await memoryRepo.getMastery(session.childId, currentItem.knowledgeId)) || {
      id: `m_${session.childId}_${currentItem.knowledgeId}`,
      studentId: session.childId,
      knowledgeId: currentItem.knowledgeId,
      masteryScore: 50,
      recognitionScore: 50,
      recallScore: 50,
      listeningScore: 50,
      speakingScore: 50,
      readingScore: 50,
      writingScore: 50,
      lastSeenAt: now,
      nextReviewAt: now,
      reviewCount: 0,
      consecutiveCorrectStreak: 0,
      isWeakness: false,
    };

    const updateResult = MasteryUpdatePolicy.applyEvidence(existingMastery, trustedEvidence);
    const updatedMastery: KnowledgeMastery = {
      ...existingMastery,
      dimensions: updateResult.dimensions,
      masteryScore: updateResult.updatedScore,
      isWeakness: updateResult.isWeakness,
      lastSeenAt: now,
      nextReviewAt: new Date(Date.now() + updateResult.nextReviewDays * 86400000).toISOString(),
      reviewCount: existingMastery.reviewCount + 1,
      consecutiveCorrectStreak: evalResult.correct
        ? existingMastery.consecutiveCorrectStreak + 1
        : 0,
      lastRecallContext: currentItem.recommendation.reviewMode,
    };
    await memoryRepo.saveMastery(updatedMastery);

    // 7. Update Session State
    let hearts = session.heartsRemaining;
    let stars = session.totalStarsEarned;
    let xp = session.totalXpEarned;
    let petFood = session.totalPetFoodEarned;

    if (evalResult.correct) {
      stars += currentItem.activity.rewardPoints.stars;
      xp += currentItem.activity.rewardPoints.xp;
      petFood += currentItem.activity.rewardPoints.petFood;
    } else {
      hearts = Math.max(0, hearts - 1);
    }

    const updatedCompleted = session.completedItemIds.includes(currentItem.id)
      ? session.completedItemIds
      : [...session.completedItemIds, currentItem.id];

    const nextIndex = evalResult.correct
      ? Math.min(session.items.length - 1, session.currentActivityIndex + 1)
      : session.currentActivityIndex;

    const updatedItems = session.items.map((item) =>
      item.id === currentItem.id ? { ...item, completed: evalResult.correct } : item
    );

    const updatedSession: ReviewSession = {
      ...session,
      items: updatedItems,
      currentActivityIndex: nextIndex,
      completedItemIds: updatedCompleted,
      evidences: [...session.evidences, trustedEvidence],
      totalStarsEarned: stars,
      totalXpEarned: xp,
      totalPetFoodEarned: petFood,
      heartsRemaining: hearts,
      updatedAt: now,
      version: session.version + 1,
    };

    await reviewSessionRepo.saveSession(updatedSession);

    return NextResponse.json({
      success: true,
      message: "Đánh giá câu trả lời ôn tập thành công.",
      data: {
        evaluation: evalResult,
        session: updatedSession,
      },
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi đánh giá ôn tập.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
