import { Activity } from "@/types/curriculum";
import { RawActivityResponse, ActivityEvaluationResult } from "@/types/learning";
import { IActivityEvaluator } from "./IActivityEvaluator";

export class MatchPairsEvaluator implements IActivityEvaluator {
  public evaluate(
    activity: Activity,
    rawResponse: RawActivityResponse,
    hintsUsed: number = 0
  ): ActivityEvaluationResult {
    const pairs = rawResponse.matchedPairIds || [];
    const expectedIds = new Set(activity.knowledgeItemIds);

    // Verify all submitted pairs have matching leftId === rightId
    const allValid = pairs.length > 0 && pairs.every((p) => p.leftId === p.rightId && expectedIds.has(p.leftId));
    const allExpectedMatched = activity.knowledgeItemIds.every((kId) =>
      pairs.some((p) => p.leftId === kId)
    );

    const correct = allValid && (activity.knowledgeItemIds.length === 0 || allExpectedMatched);
    const score = correct ? Math.max(50, 100 - hintsUsed * 20) : 0;

    return {
      correct,
      score,
      skill: "vocabulary",
      knowledgeIds: activity.knowledgeItemIds,
      feedbackVi: correct
        ? "Bé đã ghép đúng toàn bộ các cặp từ vựng!"
        : "Có cặp từ chưa chính xác, bé hãy thử ghép lại nhé.",
    };
  }
}
