import { ChildDailyGoals } from "@/types/dailyGoal";
import { DailyGoalPolicy } from "@/domain/rewards/DailyGoalPolicy";
import {
  ApplyDailyGoalProjectionParams,
  ApplyDailyGoalProjectionResult,
  IDailyGoalRepository,
} from "../interfaces/IDailyGoalRepository";

export class InMemoryDailyGoalRepository implements IDailyGoalRepository {
  private dailyGoals: Map<string, ChildDailyGoals> = new Map();
  private processedProjections: Set<string> = new Set();
  private childLocks: Map<string, Promise<unknown>> = new Map();

  // Failure hook for testing
  public failureHook?: (stage: "BEFORE_PROJECTION_COMMIT") => void;

  private makeKey(childId: string, dateStr: string): string {
    return `${childId}_${dateStr}`;
  }

  private makeMarkerKey(childId: string, projectionKey: string): string {
    return `${childId}_${projectionKey}`;
  }

  public async getDailyGoals(childId: string, dateStr: string): Promise<ChildDailyGoals | null> {
    const key = this.makeKey(childId, dateStr);
    return this.dailyGoals.get(key) || null;
  }

  public async saveDailyGoals(goals: ChildDailyGoals): Promise<ChildDailyGoals> {
    const key = this.makeKey(goals.childId, goals.dateStr);
    this.dailyGoals.set(key, { ...goals });
    return { ...goals };
  }

  public async isProjectionProcessed(childId: string, projectionKey: string): Promise<boolean> {
    return this.processedProjections.has(this.makeMarkerKey(childId, projectionKey));
  }

  public async recordProcessedProjection(childId: string, projectionKey: string): Promise<void> {
    this.processedProjections.add(this.makeMarkerKey(childId, projectionKey));
  }

  /**
   * Atomically reads projection marker and daily goal aggregate, checks idempotency,
   * updates goal counts, determines completions, and writes updated goal + marker in ONE atomic transaction.
   */
  public async applyProjection(
    params: ApplyDailyGoalProjectionParams
  ): Promise<ApplyDailyGoalProjectionResult> {
    const { childId, dateStr, goalType, projectionKey, delta } = params;
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
      const markerKey = this.makeMarkerKey(childId, projectionKey);

      // 1. Read aggregate
      const goalKey = this.makeKey(childId, dateStr);
      let goals = this.dailyGoals.get(goalKey);
      if (!goals) {
        goals = DailyGoalPolicy.generateDefaultGoals(childId, dateStr);
      } else {
        goals = {
          ...goals,
          goals: goals.goals.map((g) => ({ ...g })),
          bonusReward: { ...goals.bonusReward },
        };
      }

      // 2. Atomically check projection marker
      if (this.processedProjections.has(markerKey)) {
        return {
          applied: false,
          goalCompleted: false,
          allCompleted: goals.allCompleted,
          goals,
        };
      }

      if (this.failureHook) {
        this.failureHook("BEFORE_PROJECTION_COMMIT");
      }

      // 3. Mutate target goal
      let goalCompleted = false;
      for (const goal of goals.goals) {
        if (goal.type === goalType && !goal.isCompleted) {
          goal.currentCount = Math.min(goal.targetCount, goal.currentCount + delta);
          if (goal.currentCount >= goal.targetCount) {
            goal.isCompleted = true;
            goalCompleted = true;
          }
        }
      }

      const allCompleted = goals.goals.every((g) => g.isCompleted);
      if (allCompleted && !goals.allCompleted) {
        goals.allCompleted = true;
      }

      goals.updatedAt = new Date().toISOString();

      // 4. Atomically commit goal aggregate mutation + marker write
      this.dailyGoals.set(goalKey, goals);
      this.processedProjections.add(markerKey);

      return {
        applied: true,
        goalCompleted,
        allCompleted: goals.allCompleted,
        goals,
      };
    } finally {
      releaseLock!();
    }
  }
}
