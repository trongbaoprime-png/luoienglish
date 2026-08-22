import { RewardBalance, RewardTransaction } from "@/types/reward";

export interface RecordTransactionResult {
  transaction: RewardTransaction;
  balance: RewardBalance;
  isNew: boolean;
}

export interface IRewardRepository {
  getBalance(childId: string): Promise<RewardBalance>;
  recordTransaction(tx: RewardTransaction): Promise<RecordTransactionResult>;
  getTransactionHistory(childId: string, limitCount?: number): Promise<RewardTransaction[]>;
  isIdempotencyKeyProcessed(idempotencyKey: string): Promise<boolean>;
}
