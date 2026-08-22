import { ChildAchievementProgress } from "@/types/achievement";

export interface IAchievementRepository {
  getAchievements(childId: string): Promise<ChildAchievementProgress[]>;
  getAchievement(childId: string, achievementId: string): Promise<ChildAchievementProgress | null>;
  saveAchievement(progress: ChildAchievementProgress): Promise<ChildAchievementProgress>;
  isProjectionProcessed(childId: string, projectionKey: string): Promise<boolean>;
  recordProcessedProjection(childId: string, projectionKey: string): Promise<void>;
}
