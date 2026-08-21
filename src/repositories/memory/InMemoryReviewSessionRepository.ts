import { ReviewSession } from "@/types/adaptiveReview";
import { IReviewSessionRepository } from "../interfaces/IReviewSessionRepository";

export class InMemoryReviewSessionRepository implements IReviewSessionRepository {
  private sessions: Map<string, ReviewSession> = new Map();

  public async createSession(session: ReviewSession): Promise<ReviewSession> {
    this.sessions.set(session.id, { ...session });
    return { ...session };
  }

  public async getSession(sessionId: string): Promise<ReviewSession | null> {
    const s = this.sessions.get(sessionId);
    return s ? { ...s } : null;
  }

  public async saveSession(session: ReviewSession): Promise<ReviewSession> {
    const existing = this.sessions.get(session.id);
    if (existing && session.version <= existing.version) {
      throw new Error(
        `Xung đột phiên ôn tập (Stale write): Phiên bản hiện tại là ${existing.version}, nhận được ${session.version}.`
      );
    }
    this.sessions.set(session.id, { ...session });
    return { ...session };
  }

  public async getActiveSession(childId: string): Promise<ReviewSession | null> {
    for (const session of this.sessions.values()) {
      if (session.childId === childId && session.status === "in_progress") {
        return { ...session };
      }
    }
    return null;
  }
}
