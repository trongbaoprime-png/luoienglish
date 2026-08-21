import { KnowledgeItem, RecallContextType, SkillType, ContextualRecallVariant } from "@/types/curriculum";
import { KnowledgeMastery } from "@/types/memory";

export class ContextSelectionPolicy {
  /**
   * Maps target skill to preferred recall contexts
   */
  public static getPreferredContextTypes(targetSkill: SkillType): RecallContextType[] {
    switch (targetSkill) {
      case "speaking":
        return ["speaking_challenge", "conversation", "character_intro"];
      case "listening":
        return ["audio_recognition", "conversation", "story"];
      case "reading":
        return ["story", "flashcard", "game"];
      case "writing":
        return ["writing_task", "game"];
      case "communication":
        return ["conversation", "character_intro", "story"];
      case "phonics":
        return ["speaking_challenge", "audio_recognition"];
      case "vocabulary":
      case "grammar":
      default:
        return ["flashcard", "game", "audio_recognition", "story"];
    }
  }

  /**
   * Selects an optimal contextual recall variant, prioritizing unused contexts to prevent repetition loops.
   */
  public static selectVariant(
    item: KnowledgeItem,
    targetSkill: SkillType,
    mastery?: KnowledgeMastery
  ): ContextualRecallVariant | null {
    const variants = item.recallVariants || [];
    if (variants.length === 0) return null;

    const preferredTypes = this.getPreferredContextTypes(targetSkill);
    const lastContext = mastery?.lastRecallContext;

    // 1. Filter variants matching preferred types for the skill
    let eligible = variants.filter((v) => preferredTypes.includes(v.contextType));
    if (eligible.length === 0) {
      eligible = variants;
    }

    // 2. Rotate away from last context if alternatives exist
    const nonRepeated = eligible.filter((v) => v.contextType !== lastContext);
    if (nonRepeated.length > 0) {
      return nonRepeated[Math.floor(Math.random() * nonRepeated.length)]!;
    }

    return eligible[0]!;
  }
}
