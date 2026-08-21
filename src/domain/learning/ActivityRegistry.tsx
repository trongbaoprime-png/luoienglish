import React from "react";
import { ActivityType } from "@/types/curriculum";
import { ActivityRendererComponent, ActivityRendererProps } from "@/types/learning";
import { VocabularyCardRenderer } from "@/components/learning/renderers/VocabularyCardRenderer";
import { MultipleChoiceRenderer } from "@/components/learning/renderers/MultipleChoiceRenderer";
import { SentenceBuilderRenderer } from "@/components/learning/renderers/SentenceBuilderRenderer";
import { SpeakingPromptRenderer } from "@/components/learning/renderers/SpeakingPromptRenderer";
import { MiniConversationRenderer } from "@/components/learning/renderers/MiniConversationRenderer";
import { MatchPairsRenderer } from "@/components/learning/renderers/MatchPairsRenderer";
import { WritingInputRenderer } from "@/components/learning/renderers/WritingInputRenderer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function UnknownActivityFallback({ activity, onNext }: ActivityRendererProps) {
  return (
    <Card className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-center max-w-md mx-auto">
      <h3 className="text-base font-black text-amber-900 mb-1">
        Dạng hoạt động chưa được hỗ trợ
      </h3>
      <p className="text-xs text-amber-700 mb-4">
        Hoạt động &ldquo;{activity.type}&rdquo; sẽ sớm có mặt trên LƯỜI ENGLISH.
      </p>
      <Button variant="primary" size="md" onClick={onNext} className="rounded-2xl">
        Bỏ Qua Hoạt Động Này
      </Button>
    </Card>
  );
}

export class ActivityRegistry {
  private static registry: Map<string, ActivityRendererComponent> = new Map([
    ["listen_and_repeat", SpeakingPromptRenderer],
    ["speak_aloud", SpeakingPromptRenderer],
    ["word_match", MatchPairsRenderer],
    ["match_pairs", MatchPairsRenderer],
    ["choose_correct", MultipleChoiceRenderer],
    ["multiple_choice", MultipleChoiceRenderer],
    ["listen_and_choose", MultipleChoiceRenderer],
    ["fill_in_chunk", WritingInputRenderer],
    ["writing_input", WritingInputRenderer],
    ["mini_conversation", MiniConversationRenderer],
    ["sentence_builder", SentenceBuilderRenderer],
    ["story_quiz", MultipleChoiceRenderer],
    ["phonics_tap", MultipleChoiceRenderer],
    ["vocabulary_card", VocabularyCardRenderer],
  ]);

  public static getRenderer(type: ActivityType | string): ActivityRendererComponent {
    return this.registry.get(type) || UnknownActivityFallback;
  }

  public static register(type: string, component: ActivityRendererComponent) {
    this.registry.set(type, component);
  }

  public static hasRenderer(type: string): boolean {
    return this.registry.has(type);
  }
}
