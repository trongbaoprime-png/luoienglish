import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { AchievementPolicy } from "@/domain/rewards/AchievementPolicy";
import { AchievementDefinition, ChildAchievementProgress } from "@/types/achievement";
import { RewardEngine } from "@/engines/reward/RewardEngine";

export class AchievementService {
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
   * Increments achievement progress and unlocks badge if target reached.
   * Awards achievement rewards idempotently upon first unlock.
   */
  public static async recordProgress(
    childId: string,
    achievementId: string,
    incrementBy = 1
  ): Promise<{ unlocked: boolean; definition?: AchievementDefinition }> {
    const def = AchievementPolicy.getAchievement(achievementId);
    if (!def) return { unlocked: false };

    const achievementRepo = RepositoryFactory.getAchievementRepository();
    let progress = await achievementRepo.getAchievement(childId, achievementId);

    if (!progress) {
      progress = {
        childId,
        achievementId: def.id,
        currentCount: 0,
        targetCount: def.targetCount,
        isUnlocked: false,
        rewardClaimed: false,
      };
    }

    if (progress.isUnlocked) {
      return { unlocked: false, definition: def };
    }

    progress.currentCount += incrementBy;

    if (progress.currentCount >= progress.targetCount && !progress.isUnlocked) {
      progress.isUnlocked = true;
      progress.unlockedAt = new Date().toISOString();
      await achievementRepo.saveAchievement(progress);

      // Award bonus reward for unlocking achievement
      if (!progress.rewardClaimed) {
        const rewardRepo = RepositoryFactory.getRewardRepository();
        const idempotencyKey = `reward_ach_${childId}_${achievementId}`;
        const tx = RewardEngine.processEvent(
          childId,
          idempotencyKey,
          { event: "achievement_unlocked" },
          achievementId
        );
        // Override with definition specific rewards
        tx.starsDelta = def.reward.stars;
        tx.xpDelta = def.reward.xp;
        tx.petFoodDelta = def.reward.petFood;
        tx.reason = `Mở khóa danh hiệu: ${def.titleVi}`;

        await rewardRepo.recordTransaction(tx);
        progress.rewardClaimed = true;
        await achievementRepo.saveAchievement(progress);
      }

      return { unlocked: true, definition: def };
    }

    await achievementRepo.saveAchievement(progress);
    return { unlocked: false, definition: def };
  }
}
