import { Activity } from "@/types/curriculum";
import { RawActivityResponse, ActivityEvaluationResult } from "@/types/learning";
import { IActivityEvaluator } from "./IActivityEvaluator";

export class SpeakingEvaluator implements IActivityEvaluator {
  public evaluate(
    activity: Activity,
    rawResponse: RawActivityResponse
  ): ActivityEvaluationResult {
    const transcript = (rawResponse.spokenTranscript || "").trim().toLowerCase();
    const target = (activity.targetExpectedText || "").replace(/[.?]/g, "").trim().toLowerCase();
    const duration = rawResponse.audioRecordingDurationMs || 0;

    // Reject spoofed zero-duration or empty attempts
    if (duration < 500 && !transcript) {
      return {
        correct: false,
        score: 0,
        skill: "speaking",
        knowledgeIds: activity.knowledgeItemIds,
        feedbackVi: "Chưa thu được giọng nói, bé hãy nói to rõ ràng hơn nhé.",
      };
    }

    // Provider-neutral evaluation heuristic
    const isMatching = transcript.length > 0 && (transcript.includes(target) || target.includes(transcript));
    const calculatedScore = isMatching ? 90 : duration >= 1000 ? 80 : 60;
    const correct = calculatedScore >= 70;

    return {
      correct,
      score: calculatedScore,
      skill: "speaking",
      knowledgeIds: activity.knowledgeItemIds,
      pronunciationScore: calculatedScore,
      feedbackVi: correct
        ? "Phát âm rất tốt và giọng nói rất tự tin!"
        : "Bé hãy lắng nghe lại mẫu âm và phát âm rõ ràng hơn nhé.",
    };
  }
}
