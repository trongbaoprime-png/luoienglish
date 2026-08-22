import {
  RewardBalance,
  RewardTransaction,
} from "@/types/reward";
import { RewardEvaluationContext, RewardPolicy } from "@/domain/rewards/RewardPolicy";
import { LevelPolicy } from "@/domain/rewards/LevelPolicy";

export class RewardEngine {
  /**
   * Process a reward event and construct a new ledger transaction
   */
  public static processEvent(
    childId: string,
    idempotencyKey: string,
    context: RewardEvaluationContext,
    sourceEntityId?: string,
    learningEvidenceId?: string
  ): RewardTransaction {
    const computed = RewardPolicy.evaluate(context);

    return {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      childId,
      idempotencyKey,
      triggerEvent: context.event,
      sourceEntityId,
      learningEvidenceId,
      starsDelta: computed.stars,
      xpDelta: computed.xp,
      coinsDelta: computed.coins,
      petFoodDelta: computed.petFood,
      policyVersion: computed.policyVersion,
      reason: computed.description,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Derive user level and updated balances from ledger transactions
   */
  public static applyTransaction(
    currentBalance: RewardBalance,
    tx: RewardTransaction
  ): RewardBalance {
    const totalXp = Math.max(0, currentBalance.totalXp + tx.xpDelta);
    const totalStars = Math.max(0, currentBalance.totalStars + tx.starsDelta);
    const totalCoins = Math.max(0, currentBalance.totalCoins + tx.coinsDelta);
    const totalPetFood = Math.max(0, currentBalance.totalPetFood + tx.petFoodDelta);

    // Calculate level via LevelPolicy
    const { level } = LevelPolicy.calculateLevel(totalXp);

    // Supportive Streak Update
    const today = new Date().toISOString().split("T")[0]!;
    let currentStreakDays = currentBalance.currentStreakDays || 0;
    let longestStreakDays = currentBalance.longestStreakDays || 0;

    if (currentBalance.lastStudyDate !== today) {
      if (currentBalance.lastStudyDate) {
        const lastDate = new Date(currentBalance.lastStudyDate);
        const todayDate = new Date(today);
        const diffDays = Math.round(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          // Consecutive day study
          currentStreakDays += 1;
        } else if (diffDays > 1) {
          // Non-punitive reset to 1
          currentStreakDays = 1;
        }
      } else {
        currentStreakDays = 1;
      }
      longestStreakDays = Math.max(longestStreakDays, currentStreakDays);
    }

    return {
      childId: currentBalance.childId,
      totalStars,
      totalXp,
      totalCoins,
      totalPetFood,
      level,
      currentStreakDays,
      longestStreakDays,
      lastStudyDate: today,
      updatedAt: new Date().toISOString(),
    };
  }
}
