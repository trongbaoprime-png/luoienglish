/**
 * LƯỜI ENGLISH — Data-Driven Achievement Types
 */

export type AchievementCategory =
  | "MEMORY"
  | "SPEAKING"
  | "LISTENING"
  | "READING"
  | "WRITING"
  | "CONSISTENCY"
  | "EXPLORATION"
  | "MASTERY";

export interface AchievementDefinition {
  id: string;
  category: AchievementCategory;
  titleVi: string;
  descriptionVi: string;
  iconKey: string;
  targetCount: number;
  reward: {
    stars: number;
    xp: number;
    petFood: number;
  };
}

export interface ChildAchievementProgress {
  childId: string;
  achievementId: string;
  currentCount: number;
  targetCount: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rewardClaimed: boolean;
}
