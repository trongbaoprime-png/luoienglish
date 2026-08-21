/**
 * Server-Trusted Reward Ledger Types
 */

export type RewardType = "stars" | "xp" | "coins" | "pet_food";

export type RewardTriggerEvent =
  | "lesson_completed"
  | "activity_correct"
  | "review_recalled"
  | "review_completed"
  | "speaking_target_met"
  | "streak_maintained"
  | "pet_nurtured";

export interface RewardTransaction {
  id: string;
  childId: string;
  idempotencyKey: string;
  triggerEvent: RewardTriggerEvent;
  sourceEntityId?: string; // e.g. lessonId or knowledgeId
  starsDelta: number;
  xpDelta: number;
  coinsDelta: number;
  petFoodDelta: number;
  description: string;
  createdAt: string;
}

export interface RewardBalance {
  childId: string;
  totalStars: number;
  totalXp: number;
  totalCoins: number;
  totalPetFood: number;
  level: number;
  updatedAt: string;
}
