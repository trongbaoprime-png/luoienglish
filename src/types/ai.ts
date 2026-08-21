/**
 * Server-Side AI Gateway and Tutor Types
 */

export type AIGatewayProvider = "gemini" | "claude" | "openai" | "mock";

export interface AITutorScaffoldHint {
  level: 1 | 2 | 3 | 4;
  type: "hint_1" | "hint_2" | "example" | "explanation";
  textEn: string;
  textVi: string;
  audioKey?: string;
}

export interface AITutorRequest {
  childId: string;
  lessonId: string;
  knowledgeItemId?: string;
  studentInputText: string;
  contextPrompt: string;
  requestedScaffoldLevel?: number; // 1 to 4
}

export interface AITutorResponse {
  messageEn: string;
  messageVi: string;
  scaffoldLevel: 1 | 2 | 3 | 4;
  suggestedAction: "listen_again" | "try_repeat" | "continue" | "encourage";
  audioKey?: string;
  accuracyScore?: number; // 0 to 100 for pronunciation / grammar
}

export interface SpeechEvaluationResult {
  transcript: string;
  targetText: string;
  accuracyScore: number;
  fluencyScore: number;
  phonemeErrors?: {
    phoneme: string;
    expected: string;
    actual: string;
  }[];
  encouragingFeedbackVi: string;
}
