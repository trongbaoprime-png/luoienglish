import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { RewardEvaluationContext } from "@/domain/rewards/RewardPolicy";
import { RewardEngine } from "@/engines/reward/RewardEngine";
import { RewardPresentation, RewardPresentationMapper } from "@/domain/rewards/RewardPresentation";
import { RewardBalance, RewardTransaction } from "@/types/reward";
import { MotivationEvent } from "@/types/motivation";
import { MotivationProjectionProcessor } from "./MotivationProjectionProcessor";

export interface AwardLearningEventParams {
  childId: string;
  idempotencyKey: string;
  context: RewardEvaluationContext;
  sourceEntityId?: string;
  learningEvidenceId?: string;
  isUnitCompleted?: boolean;
  isDailyReviewCompleted?: boolean;
}

export interface AwardLearningEventResult {
  transaction: RewardTransaction;
  balance: RewardBalance;
  motivationEvent: MotivationEvent;
  presentation: RewardPresentation;
  isNew: boolean;
}

export class RewardService {
  /**
   * Evaluates a trusted server learning event, atomically commits append-only reward ledger
   * and motivation outbox, idempotently executes projections, and returns presentation metadata.
   */
  public static async awardEvent(
    params: AwardLearningEventParams
  ): Promise<AwardLearningEventResult> {
    const {
      childId,
      idempotencyKey,
      context,
      sourceEntityId,
      learningEvidenceId,
      isUnitCompleted,
      isDailyReviewCompleted,
    } = params;

    const rewardRepo = RepositoryFactory.getRewardRepository();

    // 1. Process Event & Calculate Reward Deltas
    const tx = RewardEngine.processEvent(
      childId,
      idempotencyKey,
      context,
      sourceEntityId,
      learningEvidenceId
    );

    // 2. Commit Append-Only Ledger Transaction + Outbox Atomically
    const { transaction, balance, motivationEvent, levelTransition, isNew } =
      await rewardRepo.recordTransaction(tx, {
        skill: context.skill,
        payload: {
          accuracyScore: context.accuracyScore,
          daysSinceLastReview: context.daysSinceLastReview,
          isWeaknessRemediated: context.isWeaknessRemediated,
          isUnitCompleted,
          isDailyReviewCompleted,
          starsDelta: tx.starsDelta,
          xpDelta: tx.xpDelta,
          petFoodDelta: tx.petFoodDelta,
        },
      });

    // 3. Idempotently Process Projections via Outbox Event
    const { event: updatedEvent } =
      await MotivationProjectionProcessor.processEventProjections(motivationEvent);

    // 4. Build Semantic RewardPresentation with Authoritative Level Transition
    let levelUp: { oldLevel: number; newLevel: number } | undefined;
    if (levelTransition.isLevelUp) {
      levelUp = {
        oldLevel: levelTransition.previousLevel,
        newLevel: levelTransition.newLevel,
      };
    }

    const presentation = RewardPresentationMapper.mapToPresentation({
      starsEarned: transaction.starsDelta,
      xpEarned: transaction.xpDelta,
      petFoodEarned: transaction.petFoodDelta,
      isCorrect: true,
      levelUp,
      weaknessRecovered: context.isWeaknessRemediated,
      isUnitCompleted,
      isDailyReviewCompleted,
    });

    return {
      transaction,
      balance,
      motivationEvent: updatedEvent,
      presentation,
      isNew,
    };
  }

  public static async getChildBalance(childId: string): Promise<RewardBalance> {
    const rewardRepo = RepositoryFactory.getRewardRepository();
    return await rewardRepo.getBalance(childId);
  }
}
