import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { DailyGoalPolicy } from "@/domain/rewards/DailyGoalPolicy";
import { ChildDailyGoals, DailyGoalType } from "@/types/dailyGoal";
import { RewardEngine } from "@/engines/reward/RewardEngine";

export class DailyGoalService {
  public static getTodayDateString(): string {
    // Canonical default timezone for LƯỜI ENGLISH learners: UTC+7 (Asia/Ho_Chi_Minh)
    const date = new Date();
    // Use ISO string date segment (YYYY-MM-DD)
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
   * Advances daily goal progress on specific learning trigger and awards goal reward upon completion.
   * Idempotency is enforced if projectionKey is provided.
   */
  public static async advanceGoalProgress(
    childId: string,
    goalType: DailyGoalType,
    incrementBy = 1,
    projectionKey?: string
  ): Promise<{ goalCompleted: boolean; allCompleted: boolean; updatedGoals: ChildDailyGoals }> {
    const goalRepo = RepositoryFactory.getDailyGoalRepository();

    if (projectionKey) {
      const alreadyProcessed = await goalRepo.isProjectionProcessed(childId, projectionKey);
      if (alreadyProcessed) {
        const existingGoals = await DailyGoalService.getOrInitTodayGoals(childId);
        return {
          goalCompleted: false,
          allCompleted: existingGoals.allCompleted,
          updatedGoals: existingGoals,
        };
      }
      await goalRepo.recordProcessedProjection(childId, projectionKey);
    }

    const todayGoals = await DailyGoalService.getOrInitTodayGoals(childId);
    let goalCompleted = false;

    const rewardRepo = RepositoryFactory.getRewardRepository();

    for (const goal of todayGoals.goals) {
      if (goal.type === goalType && !goal.isCompleted) {
        goal.currentCount = Math.min(goal.targetCount, goal.currentCount + incrementBy);
        if (goal.currentCount >= goal.targetCount) {
          goal.isCompleted = true;
          goalCompleted = true;

          // Award goal specific reward with deterministic idempotencyKey
          const idempotencyKey = `reward_goal_${childId}_${todayGoals.dateStr}_${goal.id}`;
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
    }

    const allCompletedNow = todayGoals.goals.every((g) => g.isCompleted);
    if (allCompletedNow && !todayGoals.bonusClaimed) {
      todayGoals.allCompleted = true;
      todayGoals.bonusClaimed = true;

      // Award bonus all-completed reward
      const idempotencyKey = `reward_goal_all_${childId}_${todayGoals.dateStr}`;
      const bonusTx = RewardEngine.processEvent(
        childId,
        idempotencyKey,
        { event: "daily_goal_completed" },
        "all_goals_bonus"
      );
      bonusTx.starsDelta = todayGoals.bonusReward.stars;
      bonusTx.xpDelta = todayGoals.bonusReward.xp;
      bonusTx.petFoodDelta = todayGoals.bonusReward.petFood;
      bonusTx.reason = "Hoàn thành tất cả mục tiêu học tập hôm nay!";

      await rewardRepo.recordTransaction(bonusTx);
    }

    todayGoals.updatedAt = new Date().toISOString();
    await goalRepo.saveDailyGoals(todayGoals);

    return {
      goalCompleted,
      allCompleted: todayGoals.allCompleted,
      updatedGoals: todayGoals,
    };
  }
}
