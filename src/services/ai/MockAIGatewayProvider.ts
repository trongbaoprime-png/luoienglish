import { AITutorRequest, AITutorResponse, SpeechEvaluationResult } from "@/types/ai";
import { IAIGatewayProvider } from "./AIGateway";

export class MockAIGatewayProvider implements IAIGatewayProvider {
  public name = "MockAIGatewayProvider";

  public async generateTutorResponse(request: AITutorRequest): Promise<AITutorResponse> {
    const level = (request.requestedScaffoldLevel || 1) as 1 | 2 | 3 | 4;

    switch (level) {
      case 1:
        return {
          messageEn: "Think about how we say hello to a new friend!",
          messageVi: "Hãy nhớ lại cách chúng mình chào hỏi một người bạn mới nhé!",
          scaffoldLevel: 1,
          suggestedAction: "try_repeat",
          accuracyScore: 80,
        };
      case 2:
        return {
          messageEn: "The first word starts with 'H' and sounds like /həˈloʊ/.",
          messageVi: "Từ đầu tiên bắt đầu bằng chữ 'H' và phát âm là /həˈloʊ/ đấy.",
          scaffoldLevel: 2,
          suggestedAction: "listen_again",
          accuracyScore: 85,
        };
      case 3:
        return {
          messageEn: "For example: 'Hello! My name is Chú Lười.'",
          messageVi: "Ví dụ nhé: 'Hello! My name is Chú Lười.' Giờ đến lượt bạn!",
          scaffoldLevel: 3,
          suggestedAction: "try_repeat",
          accuracyScore: 90,
        };
      case 4:
      default:
        return {
          messageEn: "The full sentence is: 'Hello! What's your name?'",
          messageVi: "Đáp án chính xác là: 'Hello! What's your name?'. Bạn làm rất tốt!",
          scaffoldLevel: 4,
          suggestedAction: "continue",
          accuracyScore: 95,
        };
    }
  }

  public async evaluateSpeech(
    _audioBase64: string,
    targetText: string
  ): Promise<SpeechEvaluationResult> {
    return {
      transcript: targetText,
      targetText,
      accuracyScore: 95,
      fluencyScore: 90,
      encouragingFeedbackVi: "Phát âm rất rõ ràng và chuẩn ngữ điệu!",
    };
  }
}
