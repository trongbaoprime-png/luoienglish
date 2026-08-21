import { RewardBalance, RewardTransaction } from "@/types/reward";
import { IRewardRepository } from "../interfaces/IRewardRepository";

export class InMemoryRewardRepository implements IRewardRepository {
  private transactions: RewardTransaction[] = [];
  private balances: Map<string, RewardBalance> = new Map([
    [
      "child_sample_1",
      {
        childId: "child_sample_1",
        totalStars: 12,
        totalXp: 180,
        totalCoins: 85,
        totalPetFood: 5,
        level: 1,
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  public async getBalance(childId: string): Promise<RewardBalance> {
    const existing = this.balances.get(childId);
    if (existing) return existing;

    const initial: RewardBalance = {
      childId,
      totalStars: 0,
      totalXp: 0,
      totalCoins: 0,
      totalPetFood: 0,
      level: 1,
      updatedAt: new Date().toISOString(),
    };
    this.balances.set(childId, initial);
    return initial;
  }

  public async recordTransaction(tx: RewardTransaction): Promise<RewardTransaction> {
    this.transactions.push(tx);
    const balance = await this.getBalance(tx.childId);
    
    balance.totalStars = Math.max(0, balance.totalStars + tx.starsDelta);
    balance.totalXp = Math.max(0, balance.totalXp + tx.xpDelta);
    balance.totalCoins = Math.max(0, balance.totalCoins + tx.coinsDelta);
    balance.totalPetFood = Math.max(0, balance.totalPetFood + tx.petFoodDelta);
    balance.level = Math.floor(balance.totalXp / 200) + 1;
    balance.updatedAt = new Date().toISOString();

    return tx;
  }

  public async getTransactionHistory(childId: string, limitCount = 20): Promise<RewardTransaction[]> {
    return this.transactions
      .filter((t) => t.childId === childId)
      .slice(-limitCount)
      .reverse();
  }

  public async isIdempotencyKeyProcessed(idempotencyKey: string): Promise<boolean> {
    return this.transactions.some((t) => t.idempotencyKey === idempotencyKey);
  }
}
