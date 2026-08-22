import { MotivationEvent } from "@/types/motivation";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { DailyGoalService } from "./DailyGoalService";
import { AchievementService } from "./AchievementService";

export class MotivationProjectionProcessor {
  /**
   * Idempotently processes all projections derived from a MotivationEvent.
   * Guarantees that any given projection key executes exactly once even on retry/recovery.
   */
  public static async processEventProjections(
    event: MotivationEvent
  ): Promise<{ processedKeys: string[]; event: MotivationEvent }> {
    const rewardRepo = RepositoryFactory.getRewardRepository();
    const processedKeys: string[] = [...event.processedProjections];

    const childId = event.childId;
    const payload = event.payload;

    // 1. Daily Goals Projections
    if (event.eventType === "daily_review_completed" || payload.isDailyReviewCompleted) {
      const projKey = `proj_goal_${event.id}_review`;
      const alreadyDone = await DailyGoalService.isProjectionProcessed(childId, projKey);
      if (!alreadyDone) {
        await DailyGoalService.advanceGoalProgress(childId, "COMPLETE_DAILY_REVIEW", 1, projKey);
        processedKeys.push(projKey);
      }
    }

    if (event.skill === "vocabulary") {
      const projKey = `proj_goal_${event.id}_vocab`;
      const alreadyDone = await DailyGoalService.isProjectionProcessed(childId, projKey);
      if (!alreadyDone) {
        await DailyGoalService.advanceGoalProgress(childId, "LEARN_NEW_VOCABULARY", 1, projKey);
        processedKeys.push(projKey);
      }
    }

    if (event.skill === "speaking") {
      const projKey = `proj_goal_${event.id}_speak`;
      const alreadyDone = await DailyGoalService.isProjectionProcessed(childId, projKey);
      if (!alreadyDone) {
        await DailyGoalService.advanceGoalProgress(childId, "SPEAK_PRACTICE", 1, projKey);
        processedKeys.push(projKey);
      }
    }

    // 2. Achievement Projections
    if (event.skill === "speaking") {
      const projKey = `proj_ach_${event.id}_speaking_10`;
      const alreadyDone = await AchievementService.isProjectionProcessed(childId, projKey);
      if (!alreadyDone) {
        await AchievementService.recordProgress(childId, "ach_speaking_10", 1, projKey);
        processedKeys.push(projKey);
      }
    }

    if (payload.isWeaknessRemediated) {
      const projKey = `proj_ach_${event.id}_weakness_3`;
      const alreadyDone = await AchievementService.isProjectionProcessed(childId, projKey);
      if (!alreadyDone) {
        await AchievementService.recordProgress(childId, "ach_weakness_fixer_3", 1, projKey);
        processedKeys.push(projKey);
      }
    }

    if (payload.daysSinceLastReview && payload.daysSinceLastReview >= 7) {
      const projKey = `proj_ach_${event.id}_memory_7d`;
      const alreadyDone = await AchievementService.isProjectionProcessed(childId, projKey);
      if (!alreadyDone) {
        await AchievementService.recordProgress(childId, "ach_memory_7days", 1, projKey);
        processedKeys.push(projKey);
      }
    }

    if (payload.isUnitCompleted) {
      const projKey = `proj_ach_${event.id}_unit1`;
      const alreadyDone = await AchievementService.isProjectionProcessed(childId, projKey);
      if (!alreadyDone) {
        await AchievementService.recordProgress(childId, "ach_unit_1_complete", 1, projKey);
        processedKeys.push(projKey);
      }
    }

    // 3. Mark MotivationEvent as PROCESSED
    event.processingState = "PROCESSED";
    event.processedProjections = Array.from(new Set(processedKeys));
    event.updatedAt = new Date().toISOString();

    await rewardRepo.saveMotivationEvent(event);

    return { processedKeys: event.processedProjections, event };
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
