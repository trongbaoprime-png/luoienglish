import { Activity } from "@/types/curriculum";
import { ActivityEvaluationResult } from "@/types/learning";
import { IActivityEvaluator } from "./IActivityEvaluator";

export class VocabularyCardEvaluator implements IActivityEvaluator {
  public evaluate(activity: Activity): ActivityEvaluationResult {
    return {
      correct: true,
      score: 100,
      skill: "vocabulary",
      knowledgeIds: activity.knowledgeItemIds,
      feedbackVi: "Bé đã ghi nhớ từ vựng mới thành công!",
    };
  }
}
