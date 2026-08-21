import { LearningSession } from "@/types/learning";

export interface ILearningSessionRepository {
  createSession(session: LearningSession): Promise<LearningSession>;
  getSession(sessionId: string): Promise<LearningSession | null>;
  saveSession(session: LearningSession): Promise<LearningSession>;
  getActiveSession(childId: string, lessonId: string): Promise<LearningSession | null>;
}
