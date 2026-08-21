import { KnowledgeMastery, MultidimensionalMastery } from "@/types/memory";
import { SkillType, KnowledgeItem } from "@/types/curriculum";
import { ReviewReason } from "@/types/adaptiveReview";
import { ForgettingRiskEstimator } from "./ForgettingRiskEstimator";
import { ExposurePolicy } from "./ExposurePolicy";

export interface PriorityEvaluation {
  priority: number; // 0 to 100
  targetSkill: SkillType;
  reason: ReviewReason;
  weakestScore: number;
  explanationVi: string;
}

/**
 * Adaptive Priority Policy V1
 * Computes an explainable, multidimensional priority score for any KnowledgeItem.
 */
export class AdaptivePriorityPolicy {
  /**
   * Finds the weakest cognitive skill dimension
   */
  public static findWeakestSkill(mastery: KnowledgeMastery): { skill: SkillType; score: number } {
    const dim: MultidimensionalMastery = mastery.dimensions || {
      recognitionMastery: mastery.recognitionScore || 50,
      listeningMastery: mastery.listeningScore || 50,
      speakingMastery: mastery.speakingScore || 50,
      readingMastery: mastery.readingScore || 50,
      writingMastery: mastery.writingScore || 50,
      pronunciationMastery: 50,
      applicationMastery: 50,
      schoolCurriculumScore: 50,
      communicationCompetencyScore: 50,
      aggregateMasteryScore: mastery.masteryScore || 50,
    };

    const skillMap: Array<{ skill: SkillType; score: number }> = [
      { skill: "speaking", score: dim.speakingMastery },
      { skill: "listening", score: dim.listeningMastery },
      { skill: "writing", score: dim.writingMastery },
      { skill: "reading", score: dim.readingMastery },
      { skill: "phonics", score: dim.pronunciationMastery },
      { skill: "communication", score: dim.applicationMastery },
      { skill: "vocabulary", score: dim.recognitionMastery },
    ];

    skillMap.sort((a, b) => a.score - b.score);
    return skillMap[0]!;
  }

  public static calculatePriority(
    mastery: KnowledgeMastery,
    knowledgeItem?: KnowledgeItem,
    hasPrerequisiteGap = false,
    now: Date = new Date()
  ): PriorityEvaluation {
    const weakest = this.findWeakestSkill(mastery);
    const forgetting = ForgettingRiskEstimator.estimate(mastery, now);
    const exposure = ExposurePolicy.evaluate(mastery, undefined, now);

    const baseScore = 50;
    let reason: ReviewReason = "REINFORCEMENT";
    let explanationVi = "Củng cố kiến thức theo chu kỳ định kỳ.";

    // 1. Overdue weight (up to +30)
    const overdueWeight = Math.min(30, forgetting.overdueDays * 5);

    // 2. Weakness weight (up to +25)
    let weaknessWeight = 0;
    if (weakest.score < 50 || mastery.isWeakness) {
      weaknessWeight = Math.round((60 - weakest.score) * 0.5);
      reason = "WEAK_SKILL";
      explanationVi = `Kỹ năng ${weakest.skill.toUpperCase()} đang cần rèn luyện thêm (điểm: ${weakest.score}/100).`;
    }

    // 3. Forgetting risk weight (up to +25)
    const forgettingRiskWeight = Math.round(forgetting.riskScore * 25);
    if (forgetting.riskScore >= 0.7 && reason !== "WEAK_SKILL") {
      reason = "FORGETTING_RISK";
      explanationVi = "Nguy cơ quên cao do đã lâu chưa ôn lại.";
    }

    // 4. Overdue check
    if (forgetting.overdueDays >= 1 && reason !== "WEAK_SKILL") {
      reason = "OVERDUE";
      explanationVi = `Đã quá hạn ôn tập ${forgetting.overdueDays} ngày.`;
    }

    // 5. Prerequisite gap priority (+20)
    let prerequisiteWeight = 0;
    if (hasPrerequisiteGap) {
      prerequisiteWeight = 20;
      reason = "PREREQUISITE_GAP";
      explanationVi = "Kiến thức nền tảng cần củng cố trước khi học bài mới.";
    }

    // 6. Recent failure check
    let recentFailureWeight = 0;
    if ((mastery.consecutiveCorrectStreak || 0) === 0 && mastery.reviewCount > 0) {
      recentFailureWeight = 15;
      if (reason === "REINFORCEMENT") {
        reason = "RECENT_FAILURE";
        explanationVi = "Lần thử gần nhất chưa đúng, cần luyện lại ngay.";
      }
    }

    // Calculate total priority
    const rawPriority =
      baseScore +
      overdueWeight +
      weaknessWeight +
      forgettingRiskWeight +
      prerequisiteWeight +
      recentFailureWeight -
      exposure.overexposurePenalty;

    const priority = Math.min(100, Math.max(0, rawPriority));

    return {
      priority,
      targetSkill: weakest.skill,
      reason,
      weakestScore: weakest.score,
      explanationVi,
    };
  }
}
