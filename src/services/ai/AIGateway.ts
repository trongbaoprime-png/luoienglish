import { AITutorRequest, AITutorResponse, SpeechEvaluationResult } from "@/types/ai";

/**
 * ============================================================================
 * ARCHITECTURAL NOTICE: FOUNDATION SAFETY SCAFFOLDING ONLY
 * ============================================================================
 * The current AI Gateway safety checks, prompt wrappers, and mock provider
 * represent an architectural foundation and baseline scaffolding.
 *
 * It is NOT YET production-complete. Prior to live child-facing deployment,
 * the following production gates MUST be implemented:
 * 1. Dedicated child content moderation classifier (real-time sentiment/toxicity screening).
 * 2. Automated PII detection and redaction (names, phone numbers, school locations).
 * 3. Parent monitoring dashboard with educator escalation queue.
 * 4. Hard rate-limiting and session-duration circuit breakers.
 * ============================================================================
 */

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
    // Foundation baseline guardrails
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
