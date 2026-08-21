import {
  KnowledgeMastery,
  MultidimensionalMastery,
  ReviewQueueItem,
} from "@/types/memory";
import { RecallContextType } from "@/types/curriculum";
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
    latencySeconds = 2.0,
    skillType: "listening" | "speaking" | "reading" | "writing" | "pronunciation" | "recognition" | "application" = "recognition",
    recallContext: RecallContextType = "flashcard"
  ): KnowledgeMastery {
    const result = this.scheduler.calculateNextReview({
      masteryScore: currentMastery.masteryScore,
      isCorrect,
      reviewCount: currentMastery.reviewCount + 1,
      latencySeconds,
      skillType,
      recallContext,
    });

    const now = new Date();
    const nextReviewDate = new Date(now.getTime() + result.nextReviewDays * 24 * 60 * 60 * 1000);

    const prevDim: MultidimensionalMastery = currentMastery.dimensions || {
      recognitionMastery: currentMastery.recognitionScore || 50,
      listeningMastery: currentMastery.listeningScore || 50,
      speakingMastery: currentMastery.speakingScore || 50,
      readingMastery: currentMastery.readingScore || 50,
      writingMastery: currentMastery.writingScore || 50,
      pronunciationMastery: 50,
      applicationMastery: 50,
      schoolCurriculumScore: 50,
      communicationCompetencyScore: 50,
      aggregateMasteryScore: currentMastery.masteryScore || 50,
    };

    const delta = isCorrect ? 10 : -15;

    const updatedDimensions: MultidimensionalMastery = {
      ...prevDim,
      recognitionMastery: skillType === "recognition"
        ? Math.min(100, Math.max(0, prevDim.recognitionMastery + delta))
        : prevDim.recognitionMastery,
      listeningMastery: skillType === "listening"
        ? Math.min(100, Math.max(0, prevDim.listeningMastery + delta))
        : prevDim.listeningMastery,
      speakingMastery: skillType === "speaking"
        ? Math.min(100, Math.max(0, prevDim.speakingMastery + delta))
        : prevDim.speakingMastery,
      readingMastery: skillType === "reading"
        ? Math.min(100, Math.max(0, prevDim.readingMastery + delta))
        : prevDim.readingMastery,
      writingMastery: skillType === "writing"
        ? Math.min(100, Math.max(0, prevDim.writingMastery + delta))
        : prevDim.writingMastery,
      pronunciationMastery: skillType === "pronunciation"
        ? Math.min(100, Math.max(0, prevDim.pronunciationMastery + delta))
        : prevDim.pronunciationMastery,
      applicationMastery: skillType === "application"
        ? Math.min(100, Math.max(0, prevDim.applicationMastery + delta))
        : prevDim.applicationMastery,
      aggregateMasteryScore: result.updatedMasteryScore,
    };

    return {
      ...currentMastery,
      dimensions: updatedDimensions,
      masteryScore: result.updatedMasteryScore,
      lastSeenAt: now.toISOString(),
      nextReviewAt: nextReviewDate.toISOString(),
      reviewCount: currentMastery.reviewCount + 1,
      consecutiveCorrectStreak: isCorrect ? currentMastery.consecutiveCorrectStreak + 1 : 0,
      isWeakness: result.isWeakness,
      lastRecallContext: recallContext,
      recallScore: isCorrect
        ? Math.min(100, currentMastery.recallScore + 10)
        : Math.max(0, currentMastery.recallScore - 15),
    };
  }

  /**
   * Prioritize and build the review queue with contextual recommendations
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

      // Select contextual recommendation based on streak and history
      let recommendedContext: RecallContextType = "flashcard";
      if (item.consecutiveCorrectStreak >= 3) {
        recommendedContext = "conversation";
      } else if (item.isWeakness) {
        recommendedContext = "audio_recognition";
      } else if (item.reviewCount >= 2) {
        recommendedContext = "speaking_challenge";
      }

      return {
        knowledgeId: item.knowledgeId,
        mastery: item,
        priorityWeight,
        urgencyReason,
        recommendedContext,
      };
    });

    return queue.sort((a, b) => b.priorityWeight - a.priorityWeight).slice(0, limit);
  }
}
