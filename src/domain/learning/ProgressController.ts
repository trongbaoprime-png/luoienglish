import { Lesson } from "@/types/curriculum";
import { LearningEvidence, LessonSessionState } from "@/types/learning";

export interface ProgressControllerConfig {
  maxHearts?: number;
  allowSkip?: boolean;
}

export class ProgressController {
  private config: ProgressControllerConfig;

  constructor(config: ProgressControllerConfig = {}) {
    this.config = {
      maxHearts: 5,
      allowSkip: false,
      ...config,
    };
  }

  public createSession(childId: string, lessonId: string): LessonSessionState {
    const now = new Date().toISOString();
    return {
      sessionId: `session_${childId}_${lessonId}_${Date.now()}`,
      childId,
      lessonId,
      status: "in_progress",
      currentActivityIndex: 0,
      completedActivityIds: [],
      evidences: [],
      totalStarsEarned: 0,
      totalXpEarned: 0,
      totalPetFoodEarned: 0,
      heartsRemaining: this.config.maxHearts || 5,
      maxHearts: this.config.maxHearts || 5,
      startedAt: now,
      updatedAt: now,
      version: 1,
    };
  }

  public recordAttempt(
    session: LessonSessionState,
    lesson: Lesson,
    evidence: LearningEvidence
  ): LessonSessionState {
    if (session.status === "completed") {
      throw new Error("Không thể ghi nhận kết quả trên phiên học đã hoàn thành.");
    }

    const currentActivity = lesson.activities[session.currentActivityIndex];
    if (!currentActivity || currentActivity.id !== evidence.activityId) {
      throw new Error(`Hoạt động không khớp: Đang ở bài '${currentActivity?.id}', nhận kết quả '${evidence.activityId}'.`);
    }

    const now = new Date().toISOString();
    const updatedEvidences = [...session.evidences, evidence];
    let starsEarned = session.totalStarsEarned;
    let xpEarned = session.totalXpEarned;
    let petFoodEarned = session.totalPetFoodEarned;
    let hearts = session.heartsRemaining;

    if (evidence.correct) {
      starsEarned += currentActivity.rewardPoints.stars;
      xpEarned += currentActivity.rewardPoints.xp;
      petFoodEarned += currentActivity.rewardPoints.petFood;
    } else {
      // Penalty of 1 heart on incorrect attempt
      hearts = Math.max(0, hearts - 1);
    }

    const updatedCompleted = session.completedActivityIds.includes(currentActivity.id)
      ? session.completedActivityIds
      : [...session.completedActivityIds, currentActivity.id];

    return {
      ...session,
      evidences: updatedEvidences,
      completedActivityIds: updatedCompleted,
      totalStarsEarned: starsEarned,
      totalXpEarned: xpEarned,
      totalPetFoodEarned: petFoodEarned,
      heartsRemaining: hearts,
      updatedAt: now,
      version: session.version + 1,
    };
  }

  public nextActivity(session: LessonSessionState, lesson: Lesson): LessonSessionState {
    const nextIndex = session.currentActivityIndex + 1;
    const now = new Date().toISOString();

    if (nextIndex >= lesson.activities.length) {
      // Complete lesson if all activities completed
      if (session.completedActivityIds.length < lesson.activities.length && !this.config.allowSkip) {
        throw new Error("Chưa hoàn thành tất cả hoạt động bắt buộc.");
      }

      return {
        ...session,
        status: "completed",
        currentActivityIndex: lesson.activities.length - 1,
        completedAt: now,
        updatedAt: now,
        version: session.version + 1,
      };
    }

    return {
      ...session,
      currentActivityIndex: nextIndex,
      updatedAt: now,
      version: session.version + 1,
    };
  }

  public canComplete(session: LessonSessionState, lesson: Lesson): boolean {
    if (this.config.allowSkip) return true;
    return lesson.activities.every((act) => session.completedActivityIds.includes(act.id));
  }

  public mergeSession(current: LessonSessionState, incoming: LessonSessionState): LessonSessionState {
    // SEC-AUTH: Cross-Child / Cross-Lesson check must happen first
    if (incoming.childId !== current.childId || incoming.lessonId !== current.lessonId) {
      throw new Error("Vi phạm phiên: Không thể hợp nhất phiên của học sinh hoặc bài học khác.");
    }
    // Stale write protection
    if (incoming.version <= current.version) {
      return current; // Ignore stale write
    }
    return incoming;
  }
}
