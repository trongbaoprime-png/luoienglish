/**
 * LƯỜI ENGLISH — Daily Learning Goals Types
 */

export type DailyGoalType =
  | "COMPLETE_DAILY_REVIEW"
  | "LEARN_NEW_VOCABULARY"
  | "SPEAK_PRACTICE"
  | "COMPLETE_STORY_ACTIVITY"
  | "RECOVER_WEAK_ITEM";

export interface DailyGoalItem {
  id: string;
  type: DailyGoalType;
  titleVi: string;
  descriptionVi: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  reward: {
    stars: number;
    xp: number;
    petFood: number;
  };
}

export interface ChildDailyGoals {
  childId: string;
  dateStr: string; // YYYY-MM-DD
  goals: DailyGoalItem[];
  allCompleted: boolean;
  bonusClaimed: boolean;
  bonusReward: {
    stars: number;
    xp: number;
    petFood: number;
  };
  updatedAt: string;
}
