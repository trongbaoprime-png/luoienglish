import { Activity } from "@/types/curriculum";
import { RawActivityResponse, ActivityEvaluationResult } from "@/types/learning";

export interface IActivityEvaluator {
  evaluate(activity: Activity, rawResponse?: RawActivityResponse, hintsUsed?: number): ActivityEvaluationResult;
}
