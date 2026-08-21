import { KnowledgeMastery } from "@/types/memory";
import { KnowledgeItem } from "@/types/curriculum";
import { ProgressionReadiness } from "@/types/adaptiveReview";

export class ProgressionReadinessPolicy {
  public static evaluateReadiness(
    targetKnowledge: KnowledgeItem,
    allMasteryRecords: Map<string, KnowledgeMastery>
  ): {
    readiness: ProgressionReadiness;
    blockingPrerequisiteIds: string[];
    summaryVi: string;
  } {
    // 1. Find all prerequisite edges
    const prereqEdges = targetKnowledge.relations.filter((r) => r.relationType === "prerequisite");
    const blockingPrerequisiteIds: string[] = [];

    for (const edge of prereqEdges) {
      const prereqMastery = allMasteryRecords.get(edge.targetId);

      if (!prereqMastery || (prereqMastery.masteryScore || 0) < 50 || prereqMastery.isWeakness) {
        blockingPrerequisiteIds.push(edge.targetId);
      }
    }

    if (blockingPrerequisiteIds.length > 0) {
      return {
        readiness: "REINFORCE_PREREQUISITE",
        blockingPrerequisiteIds,
        summaryVi: "Bé cần ôn lại kiến thức tiền đề trước khi mở khóa bài học nâng cao.",
      };
    }

    // 2. Check general active weakness count across all student masteries
    const activeWeaknesses = Array.from(allMasteryRecords.values()).filter((m) => m.isWeakness);
    if (activeWeaknesses.length >= 4) {
      return {
        readiness: "REVIEW_REQUIRED",
        blockingPrerequisiteIds: [],
        summaryVi: "Bé có nhiều kỹ năng đang cần củng cố, Chú Lười khuyên nên ôn tập trước khi tiếp tục.",
      };
    }

    if (activeWeaknesses.length > 0) {
      return {
        readiness: "READY_WITH_REVIEW",
        blockingPrerequisiteIds: [],
        summaryVi: "Bé đã sẵn sàng tiếp tục và sẽ có các thử thách củng cố xen kẽ.",
      };
    }

    return {
      readiness: "READY",
      blockingPrerequisiteIds: [],
      summaryVi: "Bé hoàn toàn sẵn sàng tiến bước trên bản đồ phiêu lưu!",
    };
  }
}
