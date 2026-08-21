import { NextRequest, NextResponse } from "next/server";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";
import { LessonSessionState } from "@/types/learning";
import { MasteryUpdatePolicy } from "@/domain/learning/MasteryUpdatePolicy";
import { RewardTransaction } from "@/types/reward";
import { KnowledgeMastery } from "@/types/memory";

/**
 * POST /api/learning/session — Authoritatively verify and commit completed lesson session
 */
export async function POST(req: NextRequest) {
  try {
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;

    const body = await req.json().catch(() => ({}));
    const { session, lessonId, childId } = body as {
      session: LessonSessionState;
      lessonId: string;
      childId: string;
    };

    if (!session || !lessonId || !childId) {
      return NextResponse.json(
        { success: false, message: "Thiếu dữ liệu phiên học hợp lệ." },
        { status: 400 }
      );
    }

    // 1. Authorize Child Ownership
    const childRepo = RepositoryFactory.getChildRepository();
    const authResult = await authorizeChildAccess(parentUid, childId, childRepo);

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.statusCode }
      );
    }

    // 2. Fetch Authoritative Lesson Data
    const curriculumRepo = RepositoryFactory.getCurriculumRepository();
    const lesson = await curriculumRepo.getLesson(lessonId);

    if (!lesson) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy bài học '${lessonId}'.` },
        { status: 404 }
      );
    }

    // 3. Verify Completion Integrity (Anti-Skip Check)
    const requiredActivityIds = lesson.activities.map((a) => a.id);
    const completedSet = new Set(session.completedActivityIds || []);
    const isAllCompleted = requiredActivityIds.every((id) => completedSet.has(id));

    if (!isAllCompleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Vi phạm tính toàn vẹn: Chưa hoàn thành tất cả hoạt động bắt buộc.",
        },
        { status: 400 }
      );
    }

    // 4. Calculate Authoritative Rewards
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

    // 5. Commit Rewards Idempotently
    const rewardRepo = RepositoryFactory.getRewardRepository();
    const idempotencyKey = `claim_lesson_${childId}_${lessonId}_${session.sessionId}`;

    const rewardTx: RewardTransaction = {
      id: `tx_${Date.now()}`,
      childId,
      triggerEvent: "lesson_completed",
      sourceEntityId: lessonId,
      starsDelta: authoritativeStars,
      xpDelta: authoritativeXp,
      coinsDelta: 0,
      petFoodDelta: authoritativePetFood,
      description: `Hoàn thành bài học: ${lesson.titleVi || lesson.title}`,
      createdAt: new Date().toISOString(),
      idempotencyKey,
    };

    await rewardRepo.recordTransaction(rewardTx);

    // 6. Update Knowledge Mastery Records in Memory Repository
    const memoryRepo = RepositoryFactory.getMemoryRepository();
    for (const evidence of session.evidences || []) {
      for (const kId of evidence.knowledgeIds || []) {
        const existingMastery = (await memoryRepo.getMastery(childId, kId)) || {
          id: `m_${childId}_${kId}`,
          studentId: childId,
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

    // 7. Update Student Progress
    const progressRepo = RepositoryFactory.getProgressRepository();
    await progressRepo.saveProgress({
      id: `progress_${childId}_${lessonId}`,
      childId,
      lessonId,
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

    return NextResponse.json({
      success: true,
      message: "Ghi nhận kết quả bài học và tính điểm thành công.",
      data: {
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
    const msg = err instanceof Error ? err.message : "Lỗi xử lý kết quả bài học.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
