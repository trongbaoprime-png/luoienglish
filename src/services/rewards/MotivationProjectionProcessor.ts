import { MotivationEvent } from "@/types/motivation";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { DailyGoalService } from "./DailyGoalService";
import { AchievementService } from "./AchievementService";

export class MotivationProjectionProcessor {
  /**
   * Atomically processes all projections derived from a MotivationEvent.
   * Enforces effectively-once projection effects under retries and concurrency.
   */
  public static async processEventProjections(
    event: MotivationEvent
  ): Promise<{ processedKeys: string[]; event: MotivationEvent }> {
    const rewardRepo = RepositoryFactory.getRewardRepository();
    const processedKeys: string[] = [...event.processedProjections];

    const childId = event.childId;
    const payload = event.payload;

    try {
      // 1. Daily Goals Projections (Atomic datastore transaction)
      if (event.eventType === "daily_review_completed" || payload.isDailyReviewCompleted) {
        const projKey = `proj_goal_${event.id}_review`;
        const res = await DailyGoalService.applyGoalProjection({
          childId,
          goalType: "COMPLETE_DAILY_REVIEW",
          projectionKey: projKey,
          delta: 1,
        });
        if (res.applied || res.goals) {
          processedKeys.push(projKey);
        }
      }

      if (event.skill === "vocabulary") {
        const projKey = `proj_goal_${event.id}_vocab`;
        const res = await DailyGoalService.applyGoalProjection({
          childId,
          goalType: "LEARN_NEW_VOCABULARY",
          projectionKey: projKey,
          delta: 1,
        });
        if (res.applied || res.goals) {
          processedKeys.push(projKey);
        }
      }

      if (event.skill === "speaking") {
        const projKey = `proj_goal_${event.id}_speak`;
        const res = await DailyGoalService.applyGoalProjection({
          childId,
          goalType: "SPEAK_PRACTICE",
          projectionKey: projKey,
          delta: 1,
        });
        if (res.applied || res.goals) {
          processedKeys.push(projKey);
        }
      }

      // 2. Achievement Projections (Atomic datastore transaction)
      if (event.skill === "speaking") {
        const projKey = `proj_ach_${event.id}_speaking_10`;
        const res = await AchievementService.applyAchievementProjection({
          childId,
          achievementId: "ach_speaking_10",
          projectionKey: projKey,
          delta: 1,
        });
        if (res.applied || res.progress) {
          processedKeys.push(projKey);
        }
      }

      if (payload.isWeaknessRemediated) {
        const projKey = `proj_ach_${event.id}_weakness_3`;
        const res = await AchievementService.applyAchievementProjection({
          childId,
          achievementId: "ach_weakness_fixer_3",
          projectionKey: projKey,
          delta: 1,
        });
        if (res.applied || res.progress) {
          processedKeys.push(projKey);
        }
      }

      if (payload.daysSinceLastReview && payload.daysSinceLastReview >= 7) {
        const projKey = `proj_ach_${event.id}_memory_7d`;
        const res = await AchievementService.applyAchievementProjection({
          childId,
          achievementId: "ach_memory_7days",
          projectionKey: projKey,
          delta: 1,
        });
        if (res.applied || res.progress) {
          processedKeys.push(projKey);
        }
      }

      if (payload.isUnitCompleted) {
        const projKey = `proj_ach_${event.id}_unit1`;
        const res = await AchievementService.applyAchievementProjection({
          childId,
          achievementId: "ach_unit_1_complete",
          projectionKey: projKey,
          delta: 1,
        });
        if (res.applied || res.progress) {
          processedKeys.push(projKey);
        }
      }

      // 3. Pet Companion Emotional Projection
      try {
        const { PetService } = await import("@/services/pet/PetService");
        await PetService.onLearningMotivationEvent(childId, event);
      } catch (err) {
        console.warn("Non-blocking Pet emotional projection skipped:", err);
      }

      // 4. Mark MotivationEvent as PROCESSED only when all projections succeed
      event.processingState = "PROCESSED";
      event.processedProjections = Array.from(new Set(processedKeys));
      event.updatedAt = new Date().toISOString();

      await rewardRepo.saveMotivationEvent(event);

      return { processedKeys: event.processedProjections, event };
    } catch (error) {
      event.processingState = "FAILED";
      event.updatedAt = new Date().toISOString();
      await rewardRepo.saveMotivationEvent(event);
      throw error;
    }
  }

  /**
   * Replays and recovers all pending/unprocessed motivation events for a child (or system-wide)
   */
  public static async recoverPendingEvents(childId?: string): Promise<number> {
    const rewardRepo = RepositoryFactory.getRewardRepository();
    const pendingEvents = await rewardRepo.getUnprocessedMotivationEvents(childId);

    for (const event of pendingEvents) {
      await MotivationProjectionProcessor.processEventProjections(event);
    }

    return pendingEvents.length;
  }
}
