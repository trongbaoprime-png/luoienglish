import { RawActivityResponse, ActivityEvaluationResult } from "@/types/learning";
import { ReviewSession } from "@/types/adaptiveReview";

export interface ExecuteReviewAttemptTransactionParams {
  sessionId: string;
  activityId: string;
  rawResponse: RawActivityResponse;
  expectedVersion?: number;
  attemptId?: string;
  hintsUsed?: number;
  responseTimeMs?: number;
}

export interface ReviewAttemptTransactionOutput {
  evaluation: ActivityEvaluationResult;
  session: ReviewSession;
  isIdempotentReplay: boolean;
}

export interface IReviewAttemptTransactionRepository {
  /**
   * Executes a review attempt atomically across ReviewSession and KnowledgeMastery.
   * Guarantees true all-or-nothing datastore transaction semantics (SEC-LEARNING-002).
   */
  executeAttemptTransaction(
    params: ExecuteReviewAttemptTransactionParams
  ): Promise<ReviewAttemptTransactionOutput>;
}
