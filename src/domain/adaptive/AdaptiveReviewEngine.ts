import { KnowledgeMastery } from "@/types/memory";
import { KnowledgeItem } from "@/types/curriculum";
import { ReviewRecommendation, DailyReviewQueue } from "@/types/adaptiveReview";
import { AdaptivePriorityPolicy } from "./AdaptivePriorityPolicy";
import { ContextSelectionPolicy } from "./ContextSelectionPolicy";
import { AdaptiveDifficultyPolicy } from "./AdaptiveDifficultyPolicy";
import { ReviewSessionPlanner } from "./ReviewSessionPlanner";

export class AdaptiveReviewEngine {
  public static generateRecommendations(
    childId: string,
    masteries: KnowledgeMastery[],
    knowledgeItems: Map<string, KnowledgeItem>,
    now: Date = new Date()
  ): ReviewRecommendation[] {
    const recommendations: ReviewRecommendation[] = [];

    for (const mastery of masteries) {
      const item = knowledgeItems.get(mastery.knowledgeId);
      if (!item) continue;

      // 1. Calculate Priority and Weakest Skill
      const prioResult = AdaptivePriorityPolicy.calculatePriority(mastery, item, false, now);

      // 2. Select Contextual Recall Variant matching target skill
      const variant = ContextSelectionPolicy.selectVariant(item, prioResult.targetSkill, mastery);

      // 3. Calibrate Difficulty
      const difficulty = AdaptiveDifficultyPolicy.determineDifficulty(mastery);

      // 4. Prerequisite IDs
      const prereqIds = item.relations
        .filter((r) => r.relationType === "prerequisite")
        .map((r) => r.targetId);

      recommendations.push({
        childId,
        knowledgeId: item.id,
        priority: prioResult.priority,
        reason: prioResult.reason,
        targetSkill: prioResult.targetSkill,
        difficulty,
        reviewMode: variant?.contextType || "flashcard",
        dueAt: mastery.nextReviewAt,
        contextVariantId: variant?.id,
        prerequisiteKnowledgeIds: prereqIds,
        explanationVi: prioResult.explanationVi,
      });
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  public static generateDailyQueue(
    childId: string,
    masteries: KnowledgeMastery[],
    knowledgeItems: Map<string, KnowledgeItem>,
    maxItems = 6
  ): DailyReviewQueue {
    const allCandidates = this.generateRecommendations(childId, masteries, knowledgeItems);
    const plannedItems = ReviewSessionPlanner.planInterleavedSession(allCandidates, {
      maxItemsPerSession: maxItems,
    });

    const estimatedMinutes = Math.max(3, Math.round(plannedItems.length * 1.5));

    let summaryVi = "Hôm nay Chú Lười có vài thử thách nhẹ nhàng để củng cố trí nhớ!";
    if (plannedItems.some((i) => i.reason === "WEAK_SKILL")) {
      summaryVi = "Tập trung rèn luyện các kỹ năng đang cần trau dồi để bé tự tin hơn.";
    } else if (plannedItems.some((i) => i.reason === "OVERDUE")) {
      summaryVi = "Ôn lại các từ vựng đã đến hạn để nhớ thật sâu nhé.";
    }

    return {
      childId,
      generatedAt: new Date().toISOString(),
      items: plannedItems,
      estimatedMinutes,
      reasonSummary: summaryVi,
    };
  }
}
