import { KnowledgeMastery, ReviewQueueItem } from "@/types/memory";
import { IMemoryScheduler, SimpleSpacedRepetitionScheduler } from "./SimpleSpacedRepetitionScheduler";

export class MemoryEngine {
  private scheduler: IMemoryScheduler;

  constructor(scheduler?: IMemoryScheduler) {
    this.scheduler = scheduler ?? new SimpleSpacedRepetitionScheduler();
  }

  /**
   * Process a learning/recall attempt for an individual KnowledgeItem
   */
  public processRecallAttempt(
    currentMastery: KnowledgeMastery,
    isCorrect: boolean,
    latencySeconds = 2.0
  ): KnowledgeMastery {
    const result = this.scheduler.calculateNextReview({
      masteryScore: currentMastery.masteryScore,
      isCorrect,
      reviewCount: currentMastery.reviewCount + 1,
      latencySeconds,
    });

    const now = new Date();
    const nextReviewDate = new Date(now.getTime() + result.nextReviewDays * 24 * 60 * 60 * 1000);

    return {
      ...currentMastery,
      masteryScore: result.updatedMasteryScore,
      lastSeenAt: now.toISOString(),
      nextReviewAt: nextReviewDate.toISOString(),
      reviewCount: currentMastery.reviewCount + 1,
      consecutiveCorrectStreak: isCorrect ? currentMastery.consecutiveCorrectStreak + 1 : 0,
      isWeakness: result.isWeakness,
      // Update individual dimension
      recallScore: isCorrect
        ? Math.min(100, currentMastery.recallScore + 10)
        : Math.max(0, currentMastery.recallScore - 15),
    };
  }

  /**
   * Prioritize and build the review queue for a student
   */
  public generateReviewQueue(items: KnowledgeMastery[], limit = 10): ReviewQueueItem[] {
    const nowTime = Date.now();

    const queue: ReviewQueueItem[] = items.map((item) => {
      const dueDate = new Date(item.nextReviewAt).getTime();
      const isOverdue = nowTime >= dueDate;
      
      let priorityWeight = 0;
      let urgencyReason: ReviewQueueItem["urgencyReason"] = "due_for_review";

      if (item.isWeakness) {
        priorityWeight += 50;
        urgencyReason = "weakness_detected";
      }

      if (isOverdue) {
        const hoursOverdue = (nowTime - dueDate) / (1000 * 60 * 60);
        priorityWeight += Math.min(40, hoursOverdue * 2);
      }

      if (item.reviewCount <= 2) {
        priorityWeight += 20;
        urgencyReason = "new_item_consolidation";
      }

      // Inverse of mastery score (lower mastery = higher priority)
      priorityWeight += (100 - item.masteryScore) * 0.3;

      return {
        knowledgeId: item.knowledgeId,
        mastery: item,
        priorityWeight,
        urgencyReason,
      };
    });

    return queue.sort((a, b) => b.priorityWeight - a.priorityWeight).slice(0, limit);
  }
}
