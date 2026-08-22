import { RewardTriggerEvent } from "./reward";

export type MotivationProjectionState = "PENDING" | "PROCESSED" | "FAILED";

export interface LevelTransition {
  previousLevel: number;
  newLevel: number;
  isLevelUp: boolean;
}

export interface MotivationEventPayload {
  accuracyScore?: number;
  daysSinceLastReview?: number;
  isWeaknessRemediated?: boolean;
  isUnitCompleted?: boolean;
  isDailyReviewCompleted?: boolean;
  starsDelta?: number;
  xpDelta?: number;
  petFoodDelta?: number;
  levelTransition?: LevelTransition;
}

export interface MotivationEvent {
  id: string; // e.g. motevt_${idempotencyKey}
  childId: string;
  idempotencyKey: string;
  rewardTransactionId: string;
  eventType: RewardTriggerEvent;
  skill?: "vocabulary" | "listening" | "speaking" | "reading" | "writing" | "conversation";
  learningEvidenceId?: string;
  sourceEntityId?: string;
  occurredAt: string;
  payload: MotivationEventPayload & {
    starsDelta: number;
    xpDelta: number;
    petFoodDelta: number;
    levelTransition: LevelTransition;
  };
  policyVersion: string;
  processingState: MotivationProjectionState;
  processedProjections: string[];
  updatedAt: string;
}
