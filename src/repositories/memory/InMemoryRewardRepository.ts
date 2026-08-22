import { RewardBalance, RewardTransaction } from "@/types/reward";
import { IRewardRepository, RecordTransactionResult } from "../interfaces/IRewardRepository";
import { RewardEngine } from "@/engines/reward/RewardEngine";

export class InMemoryRewardRepository implements IRewardRepository {
  private transactions: Map<string, RewardTransaction> = new Map();
  private balances: Map<string, RewardBalance> = new Map([
    [
      "child_sample_1",
      {
        childId: "child_sample_1",
        totalStars: 12,
        totalXp: 180,
        totalCoins: 85,
        totalPetFood: 5,
        level: 2,
        currentStreakDays: 2,
        longestStreakDays: 5,
        lastStudyDate: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  public async getBalance(childId: string): Promise<RewardBalance> {
    const existing = this.balances.get(childId);
    if (existing) return { ...existing };

    const initial: RewardBalance = {
      childId,
      totalStars: 0,
      totalXp: 0,
      totalCoins: 0,
      totalPetFood: 0,
      level: 1,
      currentStreakDays: 0,
      longestStreakDays: 0,
      updatedAt: new Date().toISOString(),
    };
    this.balances.set(childId, initial);
    return { ...initial };
  }

  /**
   * Synchronous atomic check-and-record operation ensuring zero duplicate credits on identical idempotencyKey
   */
  public async recordTransaction(tx: RewardTransaction): Promise<RecordTransactionResult> {
    // 1. Atomic Idempotency Check
    if (this.transactions.has(tx.idempotencyKey)) {
      const existingTx = this.transactions.get(tx.idempotencyKey)!;
      const currentBalance = await this.getBalance(tx.childId);
      return {
        transaction: existingTx,
        balance: currentBalance,
        isNew: false,
      };
    }

    // 2. Commit transaction record
    this.transactions.set(tx.idempotencyKey, tx);

    // 3. Atomically update balance
    const currentBalance = await this.getBalance(tx.childId);
    const updatedBalance = RewardEngine.applyTransaction(currentBalance, tx);
    this.balances.set(tx.childId, updatedBalance);

    return {
      transaction: tx,
      balance: updatedBalance,
      isNew: true,
    };
  }

  public async getTransactionHistory(childId: string, limitCount = 20): Promise<RewardTransaction[]> {
    const list = Array.from(this.transactions.values())
      .filter((t) => t.childId === childId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list.slice(0, limitCount);
  }

  public async isIdempotencyKeyProcessed(idempotencyKey: string): Promise<boolean> {
    return this.transactions.has(idempotencyKey);
  }
}
