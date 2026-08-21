import { Activity } from "@/types/curriculum";
import { RawActivityResponse, ActivityEvaluationResult } from "@/types/learning";
import { IActivityEvaluator } from "./IActivityEvaluator";

export class WritingEvaluator implements IActivityEvaluator {
  public evaluate(
    activity: Activity,
    rawResponse: RawActivityResponse,
    hintsUsed: number = 0
  ): ActivityEvaluationResult {
    const input = (rawResponse.typedText || "").trim().toLowerCase();
    const target = (activity.targetExpectedText || "").trim().toLowerCase();

    const correct = input === target && input.length > 0;
    const score = correct ? Math.max(50, 100 - hintsUsed * 20) : 0;

    return {
      correct,
      score,
      skill: "writing",
      knowledgeIds: activity.knowledgeItemIds,
      feedbackVi: correct
        ? "Chính tả rất chuẩn xác từng ký tự!"
        : "Chính tả chưa đúng rồi, bé hãy kiểm tra lại nhé.",
    };
  }
}
