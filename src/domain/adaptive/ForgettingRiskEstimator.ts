import { KnowledgeMastery } from "@/types/memory";
import { ForgettingRiskEstimate } from "@/types/adaptiveReview";

/**
 * ForgettingRiskEstimator (V1 Heuristic)
 * Estimates cognitive decay risk from 0.0 (fresh memory) to 1.0 (imminent forgetting).
 *
 * Factors:
 * 1. Overdue duration relative to nextReviewAt
 * 2. Consecutive correct streak (low streak = higher decay vulnerability)
 * 3. General mastery score
 * 4. Active weakness flag
 */
export class ForgettingRiskEstimator {
  public static estimate(mastery: KnowledgeMastery, now: Date = new Date()): ForgettingRiskEstimate {
    const nextReviewTime = new Date(mastery.nextReviewAt).getTime();
    const currentTime = now.getTime();
    const diffDays = (currentTime - nextReviewTime) / (1000 * 60 * 60 * 24);
    const overdueDays = Math.max(0, diffDays);

    // Overdue penalty: Increases risk as time passes past due date
    let overdueRisk = 0;
    if (overdueDays > 0) {
      overdueRisk = Math.min(0.5, overdueDays * 0.1); // up to 0.5
    }

    // Streak penalty: Streak < 2 indicates fragile encoding
    const streak = mastery.consecutiveCorrectStreak || 0;
    const streakPenalty = streak === 0 ? 0.3 : streak === 1 ? 0.15 : streak < 3 ? 0.05 : 0.0;

    // Mastery vulnerability: Lower mastery = faster decay
    const masteryScore = mastery.masteryScore || 50;
    const masteryRisk = Math.max(0, (80 - masteryScore) / 200); // 0.0 to 0.4

    // Weakness bonus
    const weaknessRisk = mastery.isWeakness ? 0.2 : 0.0;

    const rawTotal = overdueRisk + streakPenalty + masteryRisk + weaknessRisk;
    const riskScore = Math.min(1.0, Math.max(0.0, Number(rawTotal.toFixed(2))));

    return {
      knowledgeId: mastery.knowledgeId,
      riskScore,
      overdueDays: Number(overdueDays.toFixed(1)),
      streakPenalty,
      latencyPenalty: 0,
    };
  }
}
