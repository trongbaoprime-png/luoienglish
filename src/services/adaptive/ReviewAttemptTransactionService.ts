import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { authorizeChildAccess, ServerAuthError } from "@/services/auth/serverAuth";
import { RawActivityResponse, ActivityEvaluationResult } from "@/types/learning";
import { ReviewSession } from "@/types/adaptiveReview";

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
  isIdempotentReplay: boolean;
}

export class ReviewAttemptTransactionService {
  /**
   * Executes a review attempt atomically and idempotently.
   * Enforces SEC-LEARNING-002: True datastore transaction across ReviewSession and KnowledgeMastery.
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
      hintsUsed,
      responseTimeMs,
    } = params;

    // 1. Fetch Authoritative Review Session for Initial Ownership Authorization
    const reviewSessionRepo = RepositoryFactory.getReviewSessionRepository();
    const session = await reviewSessionRepo.getSession(sessionId);

    if (!session) {
      throw new ServerAuthError(`Không tìm thấy phiên ôn tập '${sessionId}'.`, 404);
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

    // 3. Delegate to True Atomic Datastore Transaction Repository
    const transactionRepo = RepositoryFactory.getReviewAttemptTransactionRepository();
    const result = await transactionRepo.executeAttemptTransaction({
      sessionId,
      activityId,
      rawResponse,
      expectedVersion,
      attemptId,
      hintsUsed,
      responseTimeMs,
    });

    return result;
  }
}
