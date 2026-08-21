import { RewardBalance, RewardTransaction } from "@/types/reward";
import { IRewardRepository } from "../interfaces/IRewardRepository";
import { InMemoryRewardRepository } from "../memory/InMemoryRewardRepository";

export class FirestoreRewardRepository implements IRewardRepository {
  private fallback = new InMemoryRewardRepository();

  public async getBalance(childId: string): Promise<RewardBalance> {
    return this.fallback.getBalance(childId);
  }

  public async recordTransaction(tx: RewardTransaction): Promise<RewardTransaction> {
    return this.fallback.recordTransaction(tx);
  }

  public async getTransactionHistory(childId: string, limitCount = 20): Promise<RewardTransaction[]> {
    return this.fallback.getTransactionHistory(childId, limitCount);
  }

  public async isIdempotencyKeyProcessed(idempotencyKey: string): Promise<boolean> {
    return this.fallback.isIdempotencyKeyProcessed(idempotencyKey);
  }
}
