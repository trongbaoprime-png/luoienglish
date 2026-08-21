import { ReviewRecommendation } from "@/types/adaptiveReview";

export interface PlannerConfig {
  maxItemsPerSession?: number;
  overdueRatio?: number; // default 0.4
  weaknessRatio?: number; // default 0.3
  prerequisiteRatio?: number; // default 0.2
  recentSuccessRatio?: number; // default 0.1
}

export class ReviewSessionPlanner {
  public static planInterleavedSession(
    candidates: ReviewRecommendation[],
    config: PlannerConfig = {}
  ): ReviewRecommendation[] {
    const maxItems = config.maxItemsPerSession || 6;
    if (candidates.length <= maxItems) {
      return [...candidates].sort((a, b) => b.priority - a.priority);
    }

    const overduePool = candidates.filter((c) => c.reason === "OVERDUE" || c.reason === "FORGETTING_RISK");
    const weaknessPool = candidates.filter((c) => c.reason === "WEAK_SKILL" || c.reason === "RECENT_FAILURE");
    const prereqPool = candidates.filter((c) => c.reason === "PREREQUISITE_GAP" || c.reason === "REINFORCEMENT");
    const otherPool = candidates.filter(
      (c) => !overduePool.includes(c) && !weaknessPool.includes(c) && !prereqPool.includes(c)
    );

    const targetOverdue = Math.max(1, Math.round(maxItems * (config.overdueRatio ?? 0.4)));
    const targetWeakness = Math.max(1, Math.round(maxItems * (config.weaknessRatio ?? 0.3)));
    const targetPrereq = Math.max(1, Math.round(maxItems * (config.prerequisiteRatio ?? 0.2)));

    const selected: ReviewRecommendation[] = [];
    const selectedIds = new Set<string>();

    const pickFrom = (pool: ReviewRecommendation[], count: number) => {
      pool.sort((a, b) => b.priority - a.priority);
      for (const item of pool) {
        if (selected.length >= maxItems) break;
        if (!selectedIds.has(item.knowledgeId)) {
          selected.push(item);
          selectedIds.add(item.knowledgeId);
          if (selected.filter((s) => pool.includes(s)).length >= count) break;
        }
      }
    };

    pickFrom(overduePool, targetOverdue);
    pickFrom(weaknessPool, targetWeakness);
    pickFrom(prereqPool, targetPrereq);
    pickFrom(otherPool, maxItems - selected.length);

    // If still not full, backfill from remaining candidates by priority
    if (selected.length < maxItems) {
      const remaining = candidates.filter((c) => !selectedIds.has(c.knowledgeId));
      remaining.sort((a, b) => b.priority - a.priority);
      for (const item of remaining) {
        if (selected.length >= maxItems) break;
        selected.push(item);
        selectedIds.add(item.knowledgeId);
      }
    }

    // Interleave so items from the same category or skill don't clump together
    return this.interleaveItems(selected);
  }

  private static interleaveItems(items: ReviewRecommendation[]): ReviewRecommendation[] {
    const result: ReviewRecommendation[] = [];
    const remaining = [...items];

    while (remaining.length > 0) {
      if (result.length === 0) {
        result.push(remaining.shift()!);
      } else {
        const lastSkill = result[result.length - 1]!.targetSkill;
        const diffIdx = remaining.findIndex((r) => r.targetSkill !== lastSkill);
        if (diffIdx !== -1) {
          result.push(remaining.splice(diffIdx, 1)[0]!);
        } else {
          result.push(remaining.shift()!);
        }
      }
    }

    return result;
  }
}
