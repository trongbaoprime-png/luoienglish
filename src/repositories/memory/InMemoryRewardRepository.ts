import { RewardBalance, RewardTransaction } from "@/types/reward";
import { MotivationEvent, LevelTransition } from "@/types/motivation";
import {
  IRewardRepository,
  MotivationEventContext,
  RecordTransactionResult,
} from "../interfaces/IRewardRepository";
import { RewardEngine } from "@/engines/reward/RewardEngine";

export class InMemoryRewardRepository implements IRewardRepository {
  private transactions: Map<string, RewardTransaction> = new Map();
  private motivationEvents: Map<string, MotivationEvent> = new Map();
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

  // Per-child transaction mutex queue to simulate atomic datastore transaction boundaries
  private childLocks: Map<string, Promise<unknown>> = new Map();

  // Failure injection hook for testing resilience
  public failureHook?: (stage: "BEFORE_COMMIT" | "AFTER_COMMIT_BEFORE_PROJECTION") => void;

  public setBalanceForTest(balance: RewardBalance): void {
    this.balances.set(balance.childId, { ...balance });
  }

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
   * Atomically commits RewardTransaction + RewardBalance + MotivationEvent (Outbox)
   */
  public async recordTransaction(
    tx: RewardTransaction,
    motivationEventContext?: MotivationEventContext
  ): Promise<RecordTransactionResult> {
    const prevLock = this.childLocks.get(tx.childId) || Promise.resolve();
    let releaseLock: () => void;
    const currentLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    this.childLocks.set(
      tx.childId,
      prevLock.then(() => currentLock)
    );

    await prevLock;

    try {
      // 1. Atomic Idempotency Check
      if (this.transactions.has(tx.idempotencyKey)) {
        const existingTx = this.transactions.get(tx.idempotencyKey)!;
        const currentBalance = await this.getBalance(tx.childId);
        const existingEvent = this.motivationEvents.get(tx.idempotencyKey) || {
          id: `motevt_${tx.idempotencyKey}`,
          childId: tx.childId,
          idempotencyKey: tx.idempotencyKey,
          rewardTransactionId: existingTx.id,
          eventType: existingTx.triggerEvent,
          occurredAt: existingTx.createdAt,
          payload: {
            starsDelta: existingTx.starsDelta,
            xpDelta: existingTx.xpDelta,
            petFoodDelta: existingTx.petFoodDelta,
            levelTransition: {
              previousLevel: currentBalance.level,
              newLevel: currentBalance.level,
              isLevelUp: false,
            },
          },
          policyVersion: existingTx.policyVersion || "2.0.0",
          processingState: "PROCESSED" as const,
          processedProjections: [],
          updatedAt: existingTx.createdAt,
        };

        return {
          transaction: existingTx,
          balance: currentBalance,
          motivationEvent: existingEvent,
          levelTransition: existingEvent.payload.levelTransition,
          isNew: false,
        };
      }

      if (this.failureHook) {
        this.failureHook("BEFORE_COMMIT");
      }

      // 2. Read balance and compute transition
      const currentBalance = await this.getBalance(tx.childId);
      const previousLevel = currentBalance.level;
      const updatedBalance = RewardEngine.applyTransaction(currentBalance, tx);
      const newLevel = updatedBalance.level;
      const isLevelUp = newLevel > previousLevel;

      const levelTransition: LevelTransition = {
        previousLevel,
        newLevel,
        isLevelUp,
      };

      // 3. Construct MotivationEvent (Outbox Record)
      const motivationEvent: MotivationEvent = {
        id: `motevt_${tx.idempotencyKey}`,
        childId: tx.childId,
        idempotencyKey: tx.idempotencyKey,
        rewardTransactionId: tx.id,
        eventType: tx.triggerEvent,
        skill: motivationEventContext?.skill,
        learningEvidenceId: tx.learningEvidenceId,
        sourceEntityId: tx.sourceEntityId,
        occurredAt: tx.createdAt,
        payload: {
          ...motivationEventContext?.payload,
          starsDelta: tx.starsDelta,
          xpDelta: tx.xpDelta,
          petFoodDelta: tx.petFoodDelta,
          levelTransition,
        },
        policyVersion: tx.policyVersion || "2.0.0",
        processingState: "PENDING",
        processedProjections: [],
        updatedAt: new Date().toISOString(),
      };

      // 4. Atomic Commit
      this.transactions.set(tx.idempotencyKey, tx);
      this.balances.set(tx.childId, updatedBalance);
      this.motivationEvents.set(tx.idempotencyKey, motivationEvent);

      return {
        transaction: tx,
        balance: updatedBalance,
        motivationEvent,
        levelTransition,
        isNew: true,
      };
    } finally {
      releaseLock!();
    }
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

  public async getMotivationEvent(idempotencyKey: string): Promise<MotivationEvent | null> {
    return this.motivationEvents.get(idempotencyKey) || null;
  }

  public async getUnprocessedMotivationEvents(childId?: string): Promise<MotivationEvent[]> {
    const all = Array.from(this.motivationEvents.values());
    return all.filter((e) => {
      const matchChild = childId ? e.childId === childId : true;
      return matchChild && e.processingState !== "PROCESSED";
    });
  }

  public async saveMotivationEvent(event: MotivationEvent): Promise<MotivationEvent> {
    this.motivationEvents.set(event.idempotencyKey, { ...event });
    return { ...event };
  }
}
