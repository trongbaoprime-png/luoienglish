import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { AchievementPolicy } from "@/domain/rewards/AchievementPolicy";
import { AchievementDefinition, ChildAchievementProgress } from "@/types/achievement";
import { RewardEngine } from "@/engines/reward/RewardEngine";
import { ApplyAchievementProjectionResult } from "@/repositories/interfaces/IAchievementRepository";

export class AchievementService {
  public static async isProjectionProcessed(childId: string, projectionKey: string): Promise<boolean> {
    const achievementRepo = RepositoryFactory.getAchievementRepository();
    return await achievementRepo.isProjectionProcessed(childId, projectionKey);
  }

  public static async getChildAchievements(
    childId: string
  ): Promise<{ definition: AchievementDefinition; progress: ChildAchievementProgress }[]> {
    const achievementRepo = RepositoryFactory.getAchievementRepository();
    const allDefs = AchievementPolicy.getAllAchievements();
    const storedProgress = await achievementRepo.getAchievements(childId);

    const progressMap = new Map<string, ChildAchievementProgress>(
      storedProgress.map((p) => [p.achievementId, p])
    );

    return allDefs.map((def) => {
      const existing = progressMap.get(def.id) || {
        childId,
        achievementId: def.id,
        currentCount: 0,
        targetCount: def.targetCount,
        isUnlocked: false,
        rewardClaimed: false,
      };

      return {
        definition: def,
        progress: existing,
      };
    });
  }

  /**
   * Atomically applies an achievement projection inside a single datastore transaction boundary.
   * If the projection marker already exists, returns applied=false (effectively once).
   */
  public static async applyAchievementProjection(params: {
    childId: string;
    achievementId: string;
    projectionKey: string;
    delta?: number;
  }): Promise<ApplyAchievementProjectionResult> {
    const { childId, achievementId, projectionKey, delta = 1 } = params;
    const achievementRepo = RepositoryFactory.getAchievementRepository();
    const rewardRepo = RepositoryFactory.getRewardRepository();

    const result = await achievementRepo.applyProjection({
      childId,
      achievementId,
      projectionKey,
      delta,
    });

    if (result.unlocked && result.definition) {
      const idempotencyKey = `reward_ach_${childId}_${achievementId}`;
      const tx = RewardEngine.processEvent(
        childId,
        idempotencyKey,
        { event: "achievement_unlocked" },
        achievementId
      );
      tx.starsDelta = result.definition.reward.stars;
      tx.xpDelta = result.definition.reward.xp;
      tx.petFoodDelta = result.definition.reward.petFood;
      tx.reason = `Mở khóa danh hiệu: ${result.definition.titleVi}`;

      await rewardRepo.recordTransaction(tx);
    }

    return result;
  }

  /**
   * Helper for manual advancement (wraps applyAchievementProjection with unique key)
   */
  public static async recordProgress(
    childId: string,
    achievementId: string,
    incrementBy = 1,
    projectionKey?: string
  ): Promise<{ unlocked: boolean; definition?: AchievementDefinition }> {
    const key = projectionKey || `manual_ach_${Date.now()}_${Math.random()}`;
    const result = await AchievementService.applyAchievementProjection({
      childId,
      achievementId,
      projectionKey: key,
      delta: incrementBy,
    });

    return {
      unlocked: result.unlocked,
      definition: result.definition,
    };
  }
}
