import { ReviewSession } from "@/types/adaptiveReview";

export interface IReviewSessionRepository {
  createSession(session: ReviewSession): Promise<ReviewSession>;
  getSession(sessionId: string): Promise<ReviewSession | null>;
  saveSession(session: ReviewSession): Promise<ReviewSession>;
  getActiveSession(childId: string): Promise<ReviewSession | null>;
}
