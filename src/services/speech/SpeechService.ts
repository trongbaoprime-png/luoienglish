import { SpeechEvaluationResult } from "@/types/ai";

export class SpeechService {
  /**
   * Browser SpeechSynthesis text-to-speech speaker
   */
  public static speak(text: string, lang = "en-US", rate = 0.9): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate; // slightly slower for young learners
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Mock speech accuracy evaluator for initial client testing
   */
  public static evaluateLocal(spokenText: string, expectedText: string): SpeechEvaluationResult {
    const cleanSpoken = spokenText.trim().toLowerCase();
    const cleanExpected = expectedText.trim().toLowerCase();
    
    const isMatch = cleanSpoken === cleanExpected;
    const accuracyScore = isMatch ? 95 : 60;

    return {
      transcript: spokenText,
      targetText: expectedText,
      accuracyScore,
      fluencyScore: isMatch ? 90 : 55,
      encouragingFeedbackVi: isMatch
        ? "Xuất sắc! Bạn phát âm rất chuẩn!"
        : "Cố lên nhé! Thử nói lại lần nữa nào.",
    };
  }
}
