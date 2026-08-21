import { Activity, KnowledgeItem, ContextualRecallVariant, SkillType } from "@/types/curriculum";
import { ReviewDifficulty } from "@/types/adaptiveReview";

export class ReviewActivityBuilder {
  public static buildActivity(
    knowledgeItem: KnowledgeItem,
    variant: ContextualRecallVariant,
    targetSkill: SkillType,
    difficulty: ReviewDifficulty,
    lessonId: string = "review_session"
  ): Activity {
    const activityId = `act_rev_${knowledgeItem.id}_${variant.id}_${Date.now()}`;

    // Map recall context to ActivityType
    let type: Activity["type"] = "vocabulary_card";
    switch (variant.contextType) {
      case "speaking_challenge":
        type = "listen_and_repeat";
        break;
      case "audio_recognition":
        type = "listen_and_choose";
        break;
      case "conversation":
      case "character_intro":
        type = "mini_conversation";
        break;
      case "writing_task":
        type = "writing_input";
        break;
      case "game":
        type = knowledgeItem.type === "chunk" || knowledgeItem.type === "communication_function"
          ? "sentence_builder"
          : "match_pairs";
        break;
      case "story":
      case "flashcard":
      default:
        type = targetSkill === "speaking" ? "listen_and_repeat" : "vocabulary_card";
        break;
    }

    return {
      id: activityId,
      lessonId,
      title: `Thử Thách Ôn Tập: ${knowledgeItem.primaryText}`,
      type,
      prompt: variant.promptText || knowledgeItem.primaryText,
      instructionVi: variant.promptTextVi || "Cùng Chú Lười ôn lại kiến thức này nhé!",
      audioKey: variant.audioKey || knowledgeItem.audioKey,
      imageKey: variant.imageKey || knowledgeItem.imageKey,
      targetExpectedText: variant.expectedResponse || knowledgeItem.primaryText,
      knowledgeItemIds: [knowledgeItem.id],
      rewardPoints: {
        stars: difficulty === "HARDER" ? 8 : difficulty === "CURRENT" ? 5 : 3,
        xp: difficulty === "HARDER" ? 30 : difficulty === "CURRENT" ? 20 : 15,
        petFood: 1,
      },
      hint: variant.scaffoldHint || knowledgeItem.vietnameseMeaning,
      options:
        type === "listen_and_choose" || type === "mini_conversation"
          ? [
              {
                id: `opt_${knowledgeItem.id}_correct`,
                label: variant.expectedResponse || knowledgeItem.primaryText,
                isCorrect: true,
              },
              {
                id: `opt_${knowledgeItem.id}_distractor_1`,
                label: knowledgeItem.vietnameseMeaning.includes("Tên") ? "Goodbye" : "Thank you",
                isCorrect: false,
              },
              {
                id: `opt_${knowledgeItem.id}_distractor_2`,
                label: "See you later",
                isCorrect: false,
              },
            ]
          : undefined,
    };
  }
}
