import { Activity } from "@/types/curriculum";
import { IActivityEvaluator } from "./IActivityEvaluator";
import { MultipleChoiceEvaluator } from "./MultipleChoiceEvaluator";
import { SentenceBuilderEvaluator } from "./SentenceBuilderEvaluator";
import { WritingEvaluator } from "./WritingEvaluator";
import { MatchPairsEvaluator } from "./MatchPairsEvaluator";
import { SpeakingEvaluator } from "./SpeakingEvaluator";
import { VocabularyCardEvaluator } from "./VocabularyCardEvaluator";

export class ActivityEvaluatorFactory {
  private static evaluators: Map<string, IActivityEvaluator> = new Map([
    ["vocabulary_card", new VocabularyCardEvaluator()],
    ["choose_correct", new MultipleChoiceEvaluator()],
    ["multiple_choice", new MultipleChoiceEvaluator()],
    ["listen_and_choose", new MultipleChoiceEvaluator()],
    ["phonics_tap", new MultipleChoiceEvaluator()],
    ["story_quiz", new MultipleChoiceEvaluator()],
    ["mini_conversation", new MultipleChoiceEvaluator()],
    ["sentence_builder", new SentenceBuilderEvaluator()],
    ["writing_input", new WritingEvaluator()],
    ["fill_in_chunk", new WritingEvaluator()],
    ["match_pairs", new MatchPairsEvaluator()],
    ["word_match", new MatchPairsEvaluator()],
    ["listen_and_repeat", new SpeakingEvaluator()],
    ["speak_aloud", new SpeakingEvaluator()],
  ]);

  public static getEvaluator(activity: Activity): IActivityEvaluator {
    const evaluator = this.evaluators.get(activity.type);
    if (!evaluator) {
      // Fallback for options-based activity or acknowledgment
      return activity.options && activity.options.length > 0
        ? new MultipleChoiceEvaluator()
        : new VocabularyCardEvaluator();
    }
    return evaluator;
  }
}
