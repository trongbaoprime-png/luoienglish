import { AITutorRequest, AITutorResponse, SpeechEvaluationResult } from "@/types/ai";

export interface IAIGatewayProvider {
  name: string;
  generateTutorResponse(request: AITutorRequest): Promise<AITutorResponse>;
  evaluateSpeech(audioBase64: string, targetText: string): Promise<SpeechEvaluationResult>;
}

export class AIGateway {
  private provider: IAIGatewayProvider;

  constructor(provider: IAIGatewayProvider) {
    this.provider = provider;
  }

  public async getTutorHelp(request: AITutorRequest): Promise<AITutorResponse> {
    // Enforce server-side guardrails
    if (!request.studentInputText && !request.contextPrompt) {
      throw new Error("Invalid request: Context or input is required.");
    }

    return this.provider.generateTutorResponse(request);
  }

  public async evaluatePronunciation(
    audioBase64: string,
    targetText: string
  ): Promise<SpeechEvaluationResult> {
    return this.provider.evaluateSpeech(audioBase64, targetText);
  }
}
