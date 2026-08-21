import { KnowledgeMastery } from "@/types/memory";

export interface StudentCognitiveProfile {
  childId: string;
  strongDomains: string[];
  weakDomains: string[];
  averageResponseLatencySeconds: number;
  recommendedDailyFocus: string;
}

export class AdaptiveEngine {
  /**
   * Analyze student mastery records and compute personalized learning recommendations
   */
  public static analyzeProfile(
    childId: string,
    masteries: KnowledgeMastery[]
  ): StudentCognitiveProfile {
    const weakItems = masteries.filter((m) => m.isWeakness || m.masteryScore < 50);
    const strongItems = masteries.filter((m) => m.masteryScore >= 80);

    return {
      childId,
      strongDomains: strongItems.map((s) => s.knowledgeId),
      weakDomains: weakItems.map((w) => w.knowledgeId),
      averageResponseLatencySeconds: 2.5,
      recommendedDailyFocus:
        weakItems.length > 0
          ? `Tập trung ôn tập ${weakItems.length} từ vựng/mẫu câu cần củng cố`
          : "Khám phá bài học mới trên Bản Đồ Phiêu Lưu!",
    };
  }
}
