import {
  RewardBalance,
  RewardTransaction,
} from "@/types/reward";
import { RewardEvaluationContext, RewardPolicy } from "./RewardPolicy";

export class RewardEngine {
  /**
   * Process a reward event and construct a new ledger transaction
   */
  public static processEvent(
    childId: string,
    idempotencyKey: string,
    context: RewardEvaluationContext,
    sourceEntityId?: string
  ): RewardTransaction {
    const computed = RewardPolicy.evaluate(context);

    return {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      childId,
      idempotencyKey,
      triggerEvent: context.event,
      sourceEntityId,
      starsDelta: computed.stars,
      xpDelta: computed.xp,
      coinsDelta: computed.coins,
      petFoodDelta: computed.petFood,
      description: computed.description,
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

    // Calculate level: every 200 XP = 1 Level
    const level = Math.floor(totalXp / 200) + 1;

    return {
      childId: currentBalance.childId,
      totalStars,
      totalXp,
      totalCoins,
      totalPetFood,
      level,
      updatedAt: new Date().toISOString(),
    };
  }
}
