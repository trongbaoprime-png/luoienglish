import { ILearningSessionRepository } from "../interfaces/ILearningSessionRepository";
import { LearningSession } from "@/types/learning";

export class InMemoryLearningSessionRepository implements ILearningSessionRepository {
  private sessions: Map<string, LearningSession> = new Map();

  public async createSession(session: LearningSession): Promise<LearningSession> {
    this.sessions.set(session.id, { ...session });
    return { ...session };
  }

  public async getSession(sessionId: string): Promise<LearningSession | null> {
    const s = this.sessions.get(sessionId);
    return s ? { ...s } : null;
  }

  public async saveSession(session: LearningSession): Promise<LearningSession> {
    const existing = this.sessions.get(session.id);
    // Stale version optimistic concurrency check
    if (existing && session.version <= existing.version) {
      throw new Error(`Xung đột phiên học (Stale write): Phiên bản hiện tại là ${existing.version}, nhận được ${session.version}.`);
    }
    this.sessions.set(session.id, { ...session });
    return { ...session };
  }

  public async getActiveSession(childId: string, lessonId: string): Promise<LearningSession | null> {
    for (const session of this.sessions.values()) {
      if (session.childId === childId && session.lessonId === lessonId && session.status === "in_progress") {
        return { ...session };
      }
    }
    return null;
  }

  public clear(): void {
    this.sessions.clear();
  }
}
