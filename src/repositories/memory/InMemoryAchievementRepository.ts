import { ChildAchievementProgress } from "@/types/achievement";
import { AchievementPolicy } from "@/domain/rewards/AchievementPolicy";
import {
  ApplyAchievementProjectionParams,
  ApplyAchievementProjectionResult,
  IAchievementRepository,
} from "../interfaces/IAchievementRepository";

export class InMemoryAchievementRepository implements IAchievementRepository {
  private achievements: Map<string, ChildAchievementProgress> = new Map();
  private processedProjections: Set<string> = new Set();
  private childLocks: Map<string, Promise<unknown>> = new Map();

  // Failure hook for testing
  public failureHook?: (stage: "BEFORE_PROJECTION_COMMIT") => void;

  private makeKey(childId: string, achievementId: string): string {
    return `${childId}_${achievementId}`;
  }

  private makeMarkerKey(childId: string, projectionKey: string): string {
    return `${childId}_${projectionKey}`;
  }

  public async getAchievements(childId: string): Promise<ChildAchievementProgress[]> {
    return Array.from(this.achievements.values()).filter((a) => a.childId === childId);
  }

  public async getAchievement(
    childId: string,
    achievementId: string
  ): Promise<ChildAchievementProgress | null> {
    const key = this.makeKey(childId, achievementId);
    return this.achievements.get(key) || null;
  }

  public async saveAchievement(
    progress: ChildAchievementProgress
  ): Promise<ChildAchievementProgress> {
    const key = this.makeKey(progress.childId, progress.achievementId);
    this.achievements.set(key, { ...progress });
    return { ...progress };
  }

  public async isProjectionProcessed(childId: string, projectionKey: string): Promise<boolean> {
    return this.processedProjections.has(this.makeMarkerKey(childId, projectionKey));
  }

  public async recordProcessedProjection(childId: string, projectionKey: string): Promise<void> {
    this.processedProjections.add(this.makeMarkerKey(childId, projectionKey));
  }

  /**
   * Atomically reads projection marker and achievement progress aggregate, checks idempotency,
   * updates progress, determines threshold unlocks, and writes updated progress + marker in ONE atomic transaction.
   */
  public async applyProjection(
    params: ApplyAchievementProjectionParams
  ): Promise<ApplyAchievementProjectionResult> {
    const { childId, achievementId, projectionKey, delta } = params;
    const lockKey = childId;
    const prevLock = this.childLocks.get(lockKey) || Promise.resolve();
    let releaseLock: () => void;
    const currentLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    this.childLocks.set(
      lockKey,
      prevLock.then(() => currentLock)
    );

    await prevLock;

    try {
      const def = AchievementPolicy.getAchievement(achievementId);
      const markerKey = this.makeMarkerKey(childId, projectionKey);
      const key = this.makeKey(childId, achievementId);

      let progress = this.achievements.get(key);
      if (!progress) {
        progress = {
          childId,
          achievementId,
          currentCount: 0,
          targetCount: def ? def.targetCount : 1,
          isUnlocked: false,
          rewardClaimed: false,
        };
      } else {
        progress = { ...progress };
      }

      // 1. Check idempotency marker
      if (this.processedProjections.has(markerKey)) {
        return {
          applied: false,
          unlocked: false,
          definition: def,
          progress,
        };
      }

      if (this.failureHook) {
        this.failureHook("BEFORE_PROJECTION_COMMIT");
      }

      // 2. Increment progress if not already unlocked
      let newlyUnlocked = false;
      if (!progress.isUnlocked) {
        progress.currentCount += delta;
        if (progress.currentCount >= progress.targetCount) {
          progress.isUnlocked = true;
          progress.unlockedAt = new Date().toISOString();
          newlyUnlocked = true;
        }
      }

      // 3. Commit mutation and marker atomically
      this.achievements.set(key, progress);
      this.processedProjections.add(markerKey);

      return {
        applied: true,
        unlocked: newlyUnlocked,
        definition: def,
        progress,
      };
    } finally {
      releaseLock!();
    }
  }
}
