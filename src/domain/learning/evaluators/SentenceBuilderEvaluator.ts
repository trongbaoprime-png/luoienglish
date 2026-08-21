import { Activity } from "@/types/curriculum";
import { RawActivityResponse, ActivityEvaluationResult } from "@/types/learning";
import { IActivityEvaluator } from "./IActivityEvaluator";

export class SentenceBuilderEvaluator implements IActivityEvaluator {
  public evaluate(
    activity: Activity,
    rawResponse: RawActivityResponse,
    hintsUsed: number = 0
  ): ActivityEvaluationResult {
    const userWords = rawResponse.userBuiltWords || [];
    const targetExpected = (activity.targetExpectedText || "").replace(/[.?]/g, "").trim().toLowerCase();
    const userSentence = userWords.join(" ").replace(/[.?]/g, "").trim().toLowerCase();

    const correct = userSentence === targetExpected && userSentence.length > 0;
    const score = correct ? Math.max(50, 100 - hintsUsed * 20) : 0;

    return {
      correct,
      score,
      skill: "grammar",
      knowledgeIds: activity.knowledgeItemIds,
      feedbackVi: correct
        ? "Bé đã ghép câu rất chuẩn xác và đúng ngữ pháp!"
        : "Thứ tự các từ chưa đúng rồi, bé hãy thử lại nhé.",
    };
  }
}
