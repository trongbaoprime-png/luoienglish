import { KnowledgeMastery } from "@/types/memory";
import { ExposureRecord } from "@/types/adaptiveReview";

/**
 * ExposurePolicy — Anti-Overtraining & Spaced Interval Guard
 * Prevents redundant review loops for items the student has already mastered.
 */
export class ExposurePolicy {
  public static evaluate(
    mastery: KnowledgeMastery,
    exposureRecord?: ExposureRecord,
    now: Date = new Date()
  ): {
    shouldSuppress: boolean;
    overexposurePenalty: number; // 0 to 40 points penalty
    reason?: string;
  } {
    const masteryScore = mastery.masteryScore || 50;
    const lastSeenTime = new Date(mastery.lastSeenAt || 0).getTime();
    const hoursSinceLastSeen = (now.getTime() - lastSeenTime) / (1000 * 60 * 60);

    // High Stable Mastery with recent exposure (< 24 hours)
    if (masteryScore >= 85 && (mastery.consecutiveCorrectStreak || 0) >= 3 && hoursSinceLastSeen < 24) {
      return {
        shouldSuppress: true,
        overexposurePenalty: 40,
        reason: "Kiến thức đã đạt độ vững chắc cao và vừa được ôn luyện gần đây.",
      };
    }

    // Moderate mastery but reviewed multiple times today
    if (exposureRecord && exposureRecord.recentExposureCount >= 3 && hoursSinceLastSeen < 12) {
      return {
        shouldSuppress: true,
        overexposurePenalty: 30,
        reason: "Đã ôn tập 3 lần trong ngày, cần thời gian củng cố trí nhớ dài hạn.",
      };
    }

    if (hoursSinceLastSeen < 6 && !mastery.isWeakness) {
      return {
        shouldSuppress: false,
        overexposurePenalty: 20,
        reason: "Vừa mới ôn tập trong vòng 6 giờ qua.",
      };
    }

    return {
      shouldSuppress: false,
      overexposurePenalty: 0,
    };
  }
}
