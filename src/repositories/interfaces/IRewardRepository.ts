import { RewardBalance, RewardTransaction } from "@/types/reward";
import { MotivationEvent, LevelTransition, MotivationEventPayload } from "@/types/motivation";

export interface RecordTransactionResult {
  transaction: RewardTransaction;
  balance: RewardBalance;
  motivationEvent: MotivationEvent;
  levelTransition: LevelTransition;
  isNew: boolean;
}

export interface MotivationEventContext {
  skill?: MotivationEvent["skill"];
  payload?: MotivationEventPayload;
}

export interface IRewardRepository {
  getBalance(childId: string): Promise<RewardBalance>;
  recordTransaction(
    tx: RewardTransaction,
    motivationEventContext?: MotivationEventContext
  ): Promise<RecordTransactionResult>;
  getTransactionHistory(childId: string, limitCount?: number): Promise<RewardTransaction[]>;
  isIdempotencyKeyProcessed(idempotencyKey: string): Promise<boolean>;
  getMotivationEvent(idempotencyKey: string): Promise<MotivationEvent | null>;
  getUnprocessedMotivationEvents(childId?: string): Promise<MotivationEvent[]>;
  saveMotivationEvent(event: MotivationEvent): Promise<MotivationEvent>;
}
