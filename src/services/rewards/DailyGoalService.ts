import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { DailyGoalPolicy } from "@/domain/rewards/DailyGoalPolicy";
import { ChildDailyGoals, DailyGoalType } from "@/types/dailyGoal";
import { RewardEngine } from "@/engines/reward/RewardEngine";
import { ApplyDailyGoalProjectionResult } from "@/repositories/interfaces/IDailyGoalRepository";

export class DailyGoalService {
  public static getTodayDateString(): string {
    // Canonical default timezone for LƯỜI ENGLISH learners: UTC+7 (Asia/Ho_Chi_Minh)
    const date = new Date();
    return date.toISOString().split("T")[0]!;
  }

  public static async isProjectionProcessed(childId: string, projectionKey: string): Promise<boolean> {
    const goalRepo = RepositoryFactory.getDailyGoalRepository();
    return await goalRepo.isProjectionProcessed(childId, projectionKey);
  }

  public static async getOrInitTodayGoals(childId: string): Promise<ChildDailyGoals> {
    const today = DailyGoalService.getTodayDateString();
    const goalRepo = RepositoryFactory.getDailyGoalRepository();
    let dailyGoals = await goalRepo.getDailyGoals(childId, today);

    if (!dailyGoals) {
      dailyGoals = DailyGoalPolicy.generateDefaultGoals(childId, today);
      await goalRepo.saveDailyGoals(dailyGoals);
    }

    return dailyGoals;
  }

  /**
   * Atomically applies a goal projection inside a single datastore transaction boundary.
   * If the projection marker already exists, returns applied=false (effectively once).
   */
  public static async applyGoalProjection(params: {
    childId: string;
    goalType: DailyGoalType;
    projectionKey: string;
    delta?: number;
  }): Promise<ApplyDailyGoalProjectionResult> {
    const { childId, goalType, projectionKey, delta = 1 } = params;
    const dateStr = DailyGoalService.getTodayDateString();
    const goalRepo = RepositoryFactory.getDailyGoalRepository();
    const rewardRepo = RepositoryFactory.getRewardRepository();

    const result = await goalRepo.applyProjection({
      childId,
      dateStr,
      goalType,
      projectionKey,
      delta,
    });

    if (result.applied) {
      // If a goal completed in this atomic projection, award its reward idempotently
      for (const goal of result.goals.goals) {
        if (goal.type === goalType && goal.isCompleted) {
          const idempotencyKey = `reward_goal_${childId}_${result.goals.dateStr}_${goal.id}`;
          const tx = RewardEngine.processEvent(
            childId,
            idempotencyKey,
            { event: "daily_goal_completed" },
            goal.id
          );
          tx.starsDelta = goal.reward.stars;
          tx.xpDelta = goal.reward.xp;
          tx.petFoodDelta = goal.reward.petFood;
          tx.reason = `Hoàn thành mục tiêu ngày: ${goal.titleVi}`;

          await rewardRepo.recordTransaction(tx);
        }
      }

      if (result.allCompleted && !result.goals.bonusClaimed) {
        const idempotencyKey = `reward_goal_all_${childId}_${result.goals.dateStr}`;
        const bonusTx = RewardEngine.processEvent(
          childId,
          idempotencyKey,
          { event: "daily_goal_completed" },
          "all_goals_bonus"
        );
        bonusTx.starsDelta = result.goals.bonusReward.stars;
        bonusTx.xpDelta = result.goals.bonusReward.xp;
        bonusTx.petFoodDelta = result.goals.bonusReward.petFood;
        bonusTx.reason = "Hoàn thành tất cả mục tiêu học tập hôm nay!";

        await rewardRepo.recordTransaction(bonusTx);
        result.goals.bonusClaimed = true;
        await goalRepo.saveDailyGoals(result.goals);
      }
    }

    return result;
  }

  /**
   * Helper for manual advancement (wraps applyGoalProjection with unique key)
   */
  public static async advanceGoalProgress(
    childId: string,
    goalType: DailyGoalType,
    incrementBy = 1,
    projectionKey?: string
  ): Promise<{ goalCompleted: boolean; allCompleted: boolean; updatedGoals: ChildDailyGoals }> {
    const key = projectionKey || `manual_adv_${Date.now()}_${Math.random()}`;
    const res = await DailyGoalService.applyGoalProjection({
      childId,
      goalType,
      projectionKey: key,
      delta: incrementBy,
    });

    return {
      goalCompleted: res.goalCompleted,
      allCompleted: res.allCompleted,
      updatedGoals: res.goals,
    };
  }
}
