import { NextRequest, NextResponse } from "next/server";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";
import { RawActivityResponse, LearningEvidence } from "@/types/learning";
import { ActivityEvaluatorFactory } from "@/domain/learning/evaluators/ActivityEvaluatorFactory";

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

    // 1. Fetch Authoritative Server Session
    const sessionRepo = RepositoryFactory.getLearningSessionRepository();
    const session = await sessionRepo.getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy phiên học '${sessionId}'.` },
        { status: 404 }
      );
    }

    if (session.status !== "in_progress") {
      return NextResponse.json(
        { success: false, message: "Phiên học này đã kết thúc hoặc bị huỷ." },
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

    // 3. Load Authoritative Lesson & Activity
    const curriculumRepo = RepositoryFactory.getCurriculumRepository();
    const lesson = await curriculumRepo.getLesson(session.lessonId);
    if (!lesson) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy bài học tương ứng." },
        { status: 404 }
      );
    }

    const currentExpectedActivity = lesson.activities[session.currentActivityIndex];
    if (!currentExpectedActivity || currentExpectedActivity.id !== activityId) {
      return NextResponse.json(
        {
          success: false,
          message: `Không khớp thứ tự hoạt động: Đang ở bài '${currentExpectedActivity?.id}', nhận kết quả '${activityId}'.`,
        },
        { status: 400 }
      );
    }

    // 4. Server-Authoritative Evaluation via Domain Evaluator
    const evaluator = ActivityEvaluatorFactory.getEvaluator(currentExpectedActivity);
    const evalResult = evaluator.evaluate(currentExpectedActivity, rawResponse, hintsUsed);

    // 5. Create Server-Trusted LearningEvidence
    const now = new Date().toISOString();
    const trustedEvidence: LearningEvidence = {
      childId: session.childId,
      lessonId: session.lessonId,
      activityId: currentExpectedActivity.id,
      knowledgeIds: evalResult.knowledgeIds,
      skill: evalResult.skill,
      attemptNumber: session.evidences.filter((e) => e.activityId === activityId).length + 1,
      correct: evalResult.correct,
      score: evalResult.score,
      responseTimeMs,
      hintsUsed,
      startedAt: session.startedAt,
      completedAt: now,
      pronunciationScore: evalResult.pronunciationScore,
    };

    // 6. Update Session State
    let hearts = session.heartsRemaining;
    let stars = session.totalStarsEarned;
    let xp = session.totalXpEarned;
    let petFood = session.totalPetFoodEarned;

    if (evalResult.correct) {
      stars += currentExpectedActivity.rewardPoints.stars;
      xp += currentExpectedActivity.rewardPoints.xp;
      petFood += currentExpectedActivity.rewardPoints.petFood;
    } else {
      hearts = Math.max(0, hearts - 1);
    }

    const updatedCompleted = session.completedActivityIds.includes(activityId)
      ? session.completedActivityIds
      : [...session.completedActivityIds, activityId];

    const nextIndex = evalResult.correct
      ? Math.min(lesson.activities.length - 1, session.currentActivityIndex + 1)
      : session.currentActivityIndex;

    const updatedSession = {
      ...session,
      currentActivityIndex: nextIndex,
      completedActivityIds: updatedCompleted,
      evidences: [...session.evidences, trustedEvidence],
      totalStarsEarned: stars,
      totalXpEarned: xp,
      totalPetFoodEarned: petFood,
      heartsRemaining: hearts,
      updatedAt: now,
      version: session.version + 1,
    };

    await sessionRepo.saveSession(updatedSession);

    return NextResponse.json({
      success: true,
      message: "Đánh giá câu trả lời thành công.",
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
    const msg = err instanceof Error ? err.message : "Lỗi đánh giá câu trả lời.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
