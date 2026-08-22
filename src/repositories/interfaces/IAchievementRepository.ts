import { AchievementDefinition, ChildAchievementProgress } from "@/types/achievement";

export interface ApplyAchievementProjectionParams {
  childId: string;
  achievementId: string;
  projectionKey: string;
  delta: number;
}

export interface ApplyAchievementProjectionResult {
  applied: boolean; // true if this transaction mutated the progress; false if marker already existed
  unlocked: boolean; // true if this specific transaction crossed the unlock threshold
  definition?: AchievementDefinition;
  progress: ChildAchievementProgress;
}

export interface IAchievementRepository {
  getAchievements(childId: string): Promise<ChildAchievementProgress[]>;
  getAchievement(childId: string, achievementId: string): Promise<ChildAchievementProgress | null>;
  saveAchievement(progress: ChildAchievementProgress): Promise<ChildAchievementProgress>;
  isProjectionProcessed(childId: string, projectionKey: string): Promise<boolean>;
  recordProcessedProjection(childId: string, projectionKey: string): Promise<void>;
  applyProjection(params: ApplyAchievementProjectionParams): Promise<ApplyAchievementProjectionResult>;
}
