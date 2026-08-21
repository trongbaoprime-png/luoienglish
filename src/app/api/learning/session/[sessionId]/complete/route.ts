import { NextRequest, NextResponse } from "next/server";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";
import { MasteryUpdatePolicy } from "@/domain/learning/MasteryUpdatePolicy";
import { RewardTransaction } from "@/types/reward";
import { KnowledgeMastery } from "@/types/memory";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;
    const { sessionId } = await params;

    // 1. Fetch Authoritative Server Session
    const sessionRepo = RepositoryFactory.getLearningSessionRepository();
    const session = await sessionRepo.getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy phiên học '${sessionId}'.` },
        { status: 404 }
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

    // If already completed, return idempotent success
    if (session.status === "completed") {
      return NextResponse.json({
        success: true,
        message: "Phiên học này đã được hoàn thành trước đó.",
        data: {
          session,
          starsEarned: session.totalStarsEarned,
          xpEarned: session.totalXpEarned,
          petFoodEarned: session.totalPetFoodEarned,
        },
      });
    }

    // 3. Load Authoritative Lesson
    const curriculumRepo = RepositoryFactory.getCurriculumRepository();
    const lesson = await curriculumRepo.getLesson(session.lessonId);
    if (!lesson) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy bài học tương ứng." },
        { status: 404 }
      );
    }

    // 4. Verify Completion Integrity (Anti-Skip Check)
    const requiredActivityIds = lesson.activities.map((a) => a.id);
    const completedSet = new Set(session.completedActivityIds || []);
    const isAllCompleted = requiredActivityIds.every((id) => completedSet.has(id));

    if (!isAllCompleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Vi phạm tính toàn vẹn: Chưa hoàn thành tất cả hoạt động bắt buộc trong bài học.",
        },
        { status: 400 }
      );
    }

    // 5. Calculate Authoritative Rewards strictly from Server Evidences
    let authoritativeStars = 0;
    let authoritativeXp = 0;
    let authoritativePetFood = 0;

    for (const act of lesson.activities) {
      const isEvidencedCorrect = session.evidences.some(
        (e) => e.activityId === act.id && e.correct
      );
      if (isEvidencedCorrect) {
        authoritativeStars += act.rewardPoints.stars;
        authoritativeXp += act.rewardPoints.xp;
        authoritativePetFood += act.rewardPoints.petFood;
      }
    }

    // 6. Commit Rewards Idempotently
    const rewardRepo = RepositoryFactory.getRewardRepository();
    const idempotencyKey = `claim_lesson_${session.childId}_${session.lessonId}_${session.id}`;

    const rewardTx: RewardTransaction = {
      id: `tx_${Date.now()}`,
      childId: session.childId,
      triggerEvent: "lesson_completed",
      sourceEntityId: session.lessonId,
      starsDelta: authoritativeStars,
      xpDelta: authoritativeXp,
      coinsDelta: 0,
      petFoodDelta: authoritativePetFood,
      description: `Hoàn thành bài học: ${lesson.titleVi || lesson.title}`,
      createdAt: new Date().toISOString(),
      idempotencyKey,
    };

    await rewardRepo.recordTransaction(rewardTx);

    // 7. Update Knowledge Mastery Records in Memory Repository (Consumes ONLY trusted server evidence)
    const memoryRepo = RepositoryFactory.getMemoryRepository();
    for (const evidence of session.evidences) {
      for (const kId of evidence.knowledgeIds || []) {
        const existingMastery = (await memoryRepo.getMastery(session.childId, kId)) || {
          id: `m_${session.childId}_${kId}`,
          studentId: session.childId,
          knowledgeId: kId,
          masteryScore: 50,
          recognitionScore: 50,
          recallScore: 50,
          listeningScore: 50,
          speakingScore: 50,
          readingScore: 50,
          writingScore: 50,
          lastSeenAt: new Date().toISOString(),
          nextReviewAt: new Date().toISOString(),
          reviewCount: 0,
          consecutiveCorrectStreak: 0,
          isWeakness: false,
        };

        const updateResult = MasteryUpdatePolicy.applyEvidence(existingMastery, evidence);

        const updatedRecord: KnowledgeMastery = {
          ...existingMastery,
          dimensions: updateResult.dimensions,
          masteryScore: updateResult.updatedScore,
          isWeakness: updateResult.isWeakness,
          lastSeenAt: new Date().toISOString(),
          nextReviewAt: new Date(Date.now() + updateResult.nextReviewDays * 86400000).toISOString(),
          reviewCount: existingMastery.reviewCount + 1,
          consecutiveCorrectStreak: evidence.correct ? existingMastery.consecutiveCorrectStreak + 1 : 0,
        };

        await memoryRepo.saveMastery(updatedRecord);
      }
    }

    // 8. Update Student Progress
    const progressRepo = RepositoryFactory.getProgressRepository();
    await progressRepo.saveProgress({
      id: `progress_${session.childId}_${session.lessonId}`,
      childId: session.childId,
      lessonId: session.lessonId,
      unitId: lesson.unitId,
      isCompleted: true,
      completedAt: new Date().toISOString(),
      scorePercent: Math.round(
        (session.evidences.filter((e) => e.correct).length / Math.max(1, session.evidences.length)) * 100
      ),
      starsEarned: authoritativeStars,
      xpEarned: authoritativeXp,
      attemptsCount: 1,
      lastAttemptAt: new Date().toISOString(),
    });

    // 9. Mark Session Completed
    const now = new Date().toISOString();
    const completedSession = {
      ...session,
      status: "completed" as const,
      totalStarsEarned: authoritativeStars,
      totalXpEarned: authoritativeXp,
      totalPetFoodEarned: authoritativePetFood,
      completedAt: now,
      updatedAt: now,
      version: session.version + 1,
    };

    await sessionRepo.saveSession(completedSession);

    return NextResponse.json({
      success: true,
      message: "Hoàn thành bài học và xác thực phần thưởng thành công.",
      data: {
        session: completedSession,
        starsEarned: authoritativeStars,
        xpEarned: authoritativeXp,
        petFoodEarned: authoritativePetFood,
      },
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi hoàn thành bài học.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
