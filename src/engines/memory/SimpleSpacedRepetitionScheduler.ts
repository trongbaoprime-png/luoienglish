import { MemoryScheduleInput, MemoryScheduleResult } from "@/types/memory";

export interface IMemoryScheduler {
  calculateNextReview(input: MemoryScheduleInput): MemoryScheduleResult;
}

/**
 * Replaceable Simple Spaced Repetition Scheduler
 * Calibrated specifically for young learners consolidating memory retention.
 */
export class SimpleSpacedRepetitionScheduler implements IMemoryScheduler {
  public calculateNextReview(input: MemoryScheduleInput): MemoryScheduleResult {
    const { masteryScore, isCorrect, reviewCount } = input;

    // If incorrect, decay mastery and schedule immediate 1-day review
    if (!isCorrect) {
      const penalty = Math.max(10, Math.round(masteryScore * 0.2));
      const newScore = Math.max(0, masteryScore - penalty);
      return {
        nextReviewDays: 1,
        updatedMasteryScore: newScore,
        isWeakness: true,
      };
    }

    // If correct, calculate score gain scaled by review repetition
    const gainBonus = Math.max(5, 15 - Math.min(reviewCount * 2, 10));
    const updatedMasteryScore = Math.min(100, masteryScore + gainBonus);

    // Dynamic Interval Matrix:
    // mastery < 40 -> 1 day
    // < 60 -> 3 days
    // < 75 -> 7 days
    // < 90 -> 14 days
    // >= 90 -> 30 days
    let nextReviewDays = 30;
    if (updatedMasteryScore < 40) {
      nextReviewDays = 1;
    } else if (updatedMasteryScore < 60) {
      nextReviewDays = 3;
    } else if (updatedMasteryScore < 75) {
      nextReviewDays = 7;
    } else if (updatedMasteryScore < 90) {
      nextReviewDays = 14;
    }

    return {
      nextReviewDays,
      updatedMasteryScore,
      isWeakness: updatedMasteryScore < 50,
    };
  }
}
