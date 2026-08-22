/**
 * LƯỜI ENGLISH — Server-Trusted Reward Economy Types
 */

export type RewardType = "stars" | "xp" | "coins" | "pet_food";

export type RewardTriggerEvent =
  | "lesson_activity_correct"
  | "activity_correct"
  | "lesson_completed"
  | "review_correct"
  | "review_recalled"
  | "review_completed"
  | "spaced_recall_success"
  | "weakness_recovered"
  | "speaking_completed"
  | "speaking_target_met"
  | "pronunciation_improved"
  | "writing_completed"
  | "listening_completed"
  | "reading_completed"
  | "conversation_transfer"
  | "daily_review_completed"
  | "daily_goal_completed"
  | "streak_continued"
  | "streak_maintained"
  | "unit_completed"
  | "mastery_milestone"
  | "achievement_unlocked"
  | "pet_nurtured";

export interface RewardTransaction {
  id: string;
  childId: string;
  idempotencyKey: string;
  triggerEvent: RewardTriggerEvent;
  sourceType?: "lesson" | "review" | "unit" | "daily_goal" | "achievement" | "pet";
  sourceEntityId?: string; // e.g. lessonId, knowledgeId, goalId
  learningEvidenceId?: string; // attemptKey or evidence ID
  starsDelta: number;
  xpDelta: number;
  coinsDelta: number;
  petFoodDelta: number;
  policyVersion?: string;
  reason?: string;
  description?: string;
  createdAt: string;
}

export interface RewardBalance {
  childId: string;
  totalStars: number;
  totalXp: number;
  totalCoins: number;
  totalPetFood: number;
  level: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastStudyDate?: string; // YYYY-MM-DD
  updatedAt: string;
}
