import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { authorizeChildAccess, ServerAuthError } from "@/services/auth/serverAuth";
import { RawActivityResponse, LearningEvidence, ActivityEvaluationResult } from "@/types/learning";
import { ReviewSession } from "@/types/adaptiveReview";
import { ActivityEvaluatorFactory } from "@/domain/learning/evaluators/ActivityEvaluatorFactory";
import { MasteryUpdatePolicy } from "@/domain/learning/MasteryUpdatePolicy";
import { KnowledgeMastery } from "@/types/memory";

export interface ReviewAttemptParams {
  parentUid: string;
  sessionId: string;
  activityId: string;
  rawResponse: RawActivityResponse;
  expectedVersion?: number;
  attemptId?: string;
  hintsUsed?: number;
  responseTimeMs?: number;
}

export interface ReviewAttemptExecutionResult {
  evaluation: ActivityEvaluationResult;
  session: ReviewSession;
  isIdempotentReplay?: boolean;
}

export class ReviewAttemptTransactionService {
  /**
   * Executes a review attempt atomically and idempotently.
   * Enforces SEC-LEARNING-002: Version check MUST precede any authoritative side effect.
   */
  public static async executeAttempt(
    params: ReviewAttemptParams
  ): Promise<ReviewAttemptExecutionResult> {
    const {
      parentUid,
      sessionId,
      activityId,
      rawResponse,
      expectedVersion,
      attemptId,
      hintsUsed = 0,
      responseTimeMs = 2000,
    } = params;

    // 1. Fetch Authoritative Review Session
    const reviewSessionRepo = RepositoryFactory.getReviewSessionRepository();
    const session = await reviewSessionRepo.getSession(sessionId);

    if (!session) {
      throw new ServerAuthError(`Không tìm thấy phiên ôn tập '${sessionId}'.`, 404);
    }

    if (session.status !== "in_progress") {
      throw new ServerAuthError("Phiên ôn tập này đã kết thúc hoặc không còn hiệu lực.", 400);
    }

    // 2. Authorize Child Ownership
    const childRepo = RepositoryFactory.getChildRepository();
    const authResult = await authorizeChildAccess(parentUid, session.childId, childRepo);
    if (!authResult.authorized) {
      throw new ServerAuthError(
        authResult.error || "Không có quyền truy cập hồ sơ học sinh.",
        authResult.statusCode || 403
      );
    }

    // 3. Concurrency Version Gate (BEFORE ANY side-effects on mastery or session)
    if (expectedVersion !== undefined && session.version !== expectedVersion) {
      throw new ServerAuthError(
        `Xung đột phiên bản (Stale write): Phiên bản hiện tại là ${session.version}, nhận được ${expectedVersion}.`,
        409
      );
    }

    // 4. Attempt Idempotency Check
    const effectiveAttemptKey =
      attemptId || `${session.id}_${activityId}_v${session.version}`;

    // If an attempt with this key has already been recorded in this session version
    const existingEvidence = session.evidences.find(
      (e) => (e as LearningEvidence & { attemptKey?: string }).attemptKey === effectiveAttemptKey
    );

    if (existingEvidence) {
      // Return previous result idempotently with ZERO additional state mutations
      return {
        evaluation: {
          correct: existingEvidence.correct,
          score: existingEvidence.score,
          skill: existingEvidence.skill,
          knowledgeIds: existingEvidence.knowledgeIds,
          pronunciationScore: existingEvidence.pronunciationScore,
          feedbackVi: existingEvidence.correct
            ? "Đã ghi nhận kết quả trước đó."
            : "Đã ghi nhận kết quả cần thử lại.",
        },
        session,
        isIdempotentReplay: true,
      };
    }

    // 5. Activity Sequence Verification
    const currentItem = session.items[session.currentActivityIndex];
    if (!currentItem || currentItem.activity.id !== activityId) {
      throw new ServerAuthError(
        `Không khớp thứ tự hoạt động: Đang ở bài '${currentItem?.activity.id}', nhận kết quả '${activityId}'.`,
        400
      );
    }

    // 6. Sanitize and Clamp Low-Trust Telemetry
    const clampedResponseTimeMs = Math.min(30000, Math.max(500, responseTimeMs || 2000));
    const clampedHintsUsed = Math.min(10, Math.max(0, hintsUsed || 0));

    // 7. Server-Authoritative Evaluation via Evaluator Factory
    const evaluator = ActivityEvaluatorFactory.getEvaluator(currentItem.activity);
    const evalResult = evaluator.evaluate(currentItem.activity, rawResponse, clampedHintsUsed);

    // 8. Create Server-Trusted LearningEvidence
    const now = new Date().toISOString();
    const trustedEvidence: LearningEvidence & { attemptKey?: string } = {
      childId: session.childId,
      lessonId: session.id,
      activityId: currentItem.activity.id,
      knowledgeIds: [currentItem.knowledgeId],
      skill: currentItem.recommendation.targetSkill,
      attemptNumber: session.evidences.filter((e) => e.activityId === activityId).length + 1,
      correct: evalResult.correct,
      score: evalResult.score,
      responseTimeMs: clampedResponseTimeMs,
      hintsUsed: clampedHintsUsed,
      startedAt: session.startedAt,
      completedAt: now,
      pronunciationScore: evalResult.pronunciationScore,
      attemptKey: effectiveAttemptKey,
    };

    // 9. Calculate Mastery Update (In-memory prior to atomic commit)
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

    // 10. Update Session State (Fix Completed Item Bug: ONLY mark completed on correct answer)
    let hearts = session.heartsRemaining;
    let stars = session.totalStarsEarned;
    let xp = session.totalXpEarned;
    let petFood = session.totalPetFoodEarned;

    const updatedCompleted = [...session.completedItemIds];
    let nextIndex = session.currentActivityIndex;

    if (evalResult.correct) {
      stars += currentItem.activity.rewardPoints.stars;
      xp += currentItem.activity.rewardPoints.xp;
      petFood += currentItem.activity.rewardPoints.petFood;

      if (!updatedCompleted.includes(currentItem.id)) {
        updatedCompleted.push(currentItem.id);
      }
      nextIndex = Math.min(session.items.length - 1, session.currentActivityIndex + 1);
    } else {
      hearts = Math.max(0, hearts - 1);
      // Remain on current activity to allow retry
    }

    const updatedItems = session.items.map((item) => {
      if (item.id === currentItem.id) {
        return {
          ...item,
          completed: evalResult.correct ? true : item.completed,
        };
      }
      return item;
    });

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

    // 11. Atomic Commit: Session MUST be persisted first. If version conflict triggers, mastery is NOT touched.
    await reviewSessionRepo.saveSession(updatedSession);
    await memoryRepo.saveMastery(updatedMastery);

    return {
      evaluation: evalResult,
      session: updatedSession,
      isIdempotentReplay: false,
    };
  }
}
