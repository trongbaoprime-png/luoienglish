import { RewardBalance, RewardTransaction } from "@/types/reward";

export interface IRewardRepository {
  getBalance(childId: string): Promise<RewardBalance>;
  recordTransaction(tx: RewardTransaction): Promise<RewardTransaction>;
  getTransactionHistory(childId: string, limitCount?: number): Promise<RewardTransaction[]>;
  isIdempotencyKeyProcessed(idempotencyKey: string): Promise<boolean>;
}
