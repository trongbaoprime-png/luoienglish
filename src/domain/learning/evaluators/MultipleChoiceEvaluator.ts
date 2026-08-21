import { Activity } from "@/types/curriculum";
import { RawActivityResponse, ActivityEvaluationResult } from "@/types/learning";
import { IActivityEvaluator } from "./IActivityEvaluator";

export class MultipleChoiceEvaluator implements IActivityEvaluator {
  public evaluate(
    activity: Activity,
    rawResponse: RawActivityResponse,
    hintsUsed: number = 0
  ): ActivityEvaluationResult {
    const selectedOptionId = rawResponse.selectedOptionId;
    const selected = activity.options?.find((o) => o.id === selectedOptionId);
    const correct = Boolean(selected?.isCorrect);

    const score = correct ? Math.max(50, 100 - hintsUsed * 20) : 0;
    const skill = activity.type === "mini_conversation" ? "communication" : "reading";

    return {
      correct,
      score,
      skill,
      knowledgeIds: activity.knowledgeItemIds,
      feedbackVi: correct
        ? "Chính xác tuyệt vời! Bé đã chọn đáp án đúng."
        : "Chưa chính xác rồi, hãy kiểm tra lại nhé.",
    };
  }
}
