import { KnowledgeMastery } from "@/types/memory";
import { ReviewDifficulty } from "@/types/adaptiveReview";

export class AdaptiveDifficultyPolicy {
  public static determineDifficulty(
    mastery: KnowledgeMastery,
    recentIncorrectCount: number = 0
  ): ReviewDifficulty {
    const score = mastery.masteryScore || 50;
    const streak = mastery.consecutiveCorrectStreak || 0;

    if (recentIncorrectCount >= 2 || score < 40 || mastery.isWeakness) {
      return "EASIER";
    }

    if (score >= 80 && streak >= 3) {
      return "HARDER";
    }

    return "CURRENT";
  }
}
