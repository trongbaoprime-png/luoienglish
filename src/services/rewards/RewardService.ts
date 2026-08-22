import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { RewardEvaluationContext } from "@/domain/rewards/RewardPolicy";
import { RewardEngine } from "@/engines/reward/RewardEngine";
import { RewardPresentation, RewardPresentationMapper } from "@/domain/rewards/RewardPresentation";
import { RewardBalance, RewardTransaction } from "@/types/reward";
import { AchievementService } from "./AchievementService";
import { DailyGoalService } from "./DailyGoalService";

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
  presentation: RewardPresentation;
  isNew: boolean;
}

export class RewardService {
  /**
   * Evaluates a trusted server learning event, commits append-only reward ledger transaction,
   * checks for level-ups, updates streaks, checks achievements, and returns presentation metadata.
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
    const currentBalance = await rewardRepo.getBalance(childId);
    const oldLevel = currentBalance.level;

    // 1. Process Event & Calculate Reward Deltas
    const tx = RewardEngine.processEvent(
      childId,
      idempotencyKey,
      context,
      sourceEntityId,
      learningEvidenceId
    );

    // 2. Commit Append-Only Ledger Transaction
    const { transaction, balance, isNew } = await rewardRepo.recordTransaction(tx);

    // 3. Check for Level-Up
    let levelUp: { oldLevel: number; newLevel: number } | undefined;
    if (balance.level > oldLevel) {
      levelUp = { oldLevel, newLevel: balance.level };
    }

    // 4. Trigger Goal Progress & Achievements on New Unique Event
    if (isNew) {
      // Daily Goal triggers
      if (context.event === "daily_review_completed" || isDailyReviewCompleted) {
        await DailyGoalService.advanceGoalProgress(childId, "COMPLETE_DAILY_REVIEW", 1);
      }
      if (context.skill === "vocabulary") {
        await DailyGoalService.advanceGoalProgress(childId, "LEARN_NEW_VOCABULARY", 1);
      }
      if (context.skill === "speaking") {
        await DailyGoalService.advanceGoalProgress(childId, "SPEAK_PRACTICE", 1);
        await AchievementService.recordProgress(childId, "ach_speaking_10", 1);
      }
      if (context.isWeaknessRemediated) {
        await AchievementService.recordProgress(childId, "ach_weakness_fixer_3", 1);
      }
      if (context.daysSinceLastReview && context.daysSinceLastReview >= 7) {
        await AchievementService.recordProgress(childId, "ach_memory_7days", 1);
      }
      if (isUnitCompleted) {
        await AchievementService.recordProgress(childId, "ach_unit_1_complete", 1);
      }
      if (balance.currentStreakDays >= 3) {
        await AchievementService.recordProgress(childId, "ach_streak_3days", 3);
      }
      if (balance.currentStreakDays >= 7) {
        await AchievementService.recordProgress(childId, "ach_streak_7days", 7);
      }
    }

    // 5. Build Semantic RewardPresentation
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
      presentation,
      isNew,
    };
  }

  public static async getChildBalance(childId: string): Promise<RewardBalance> {
    const rewardRepo = RepositoryFactory.getRewardRepository();
    return await rewardRepo.getBalance(childId);
  }
}
