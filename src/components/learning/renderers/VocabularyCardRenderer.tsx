"use client";

import React, { useState } from "react";
import { ActivityRendererProps } from "@/types/learning";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AudioButton } from "@/components/learning/AudioButton";
import { CheckCircle2, RotateCw } from "lucide-react";

export function VocabularyCardRenderer({
  activity,
  knowledgeItems,
  onAttempt,
  onNext,
  isSubmitting,
}: ActivityRendererProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const startTime = React.useRef(Date.now());

  const primaryItem = knowledgeItems[0];
  const primaryWord = primaryItem?.primaryText || activity.targetExpectedText || "Word";
  const vietnamese = primaryItem?.vietnameseMeaning || activity.instructionVi;
  const ipa = primaryItem?.phoneticIpa || "";
  const example = primaryItem?.exampleSentence || "";

  const handleComplete = () => {
    const elapsed = Date.now() - startTime.current;
    onAttempt({
      skill: "vocabulary",
      attemptNumber: 1,
      correct: true,
      score: 100,
      responseTimeMs: elapsed,
      hintsUsed: 0,
      userAnswer: primaryWord,
    });
    onNext();
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto w-full animate-fade-in">
      {/* Activity Instruction */}
      <div className="text-center">
        <Badge variant="accent" className="mb-2">Khám Phá Từ Vựng</Badge>
        <h2 className="text-lg font-black text-foreground">{activity.prompt}</h2>
        <p className="text-xs text-muted-foreground font-semibold mt-0.5">{activity.instructionVi}</p>
      </div>

      {/* Flip Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full cursor-pointer perspective-1000"
      >
        <Card className={`p-8 rounded-3xl bg-gradient-to-b from-white to-amber-50/50 border-2 border-primary/30 shadow-float flex flex-col items-center justify-center text-center min-h-[260px] transition-all hover:scale-[1.02] ${isFlipped ? "bg-amber-100/40" : ""}`}>
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-3 shadow-inner">
            🦥
          </div>

          <h3 className="text-3xl sm:text-4xl font-black text-primary tracking-tight mb-1">
            {primaryWord}
          </h3>

          {ipa && (
            <span className="text-xs font-bold text-muted-foreground font-mono bg-muted/30 px-3 py-1 rounded-full mb-3">
              {ipa}
            </span>
          )}

          {isFlipped ? (
            <div className="animate-fade-in text-center">
              <span className="text-lg font-bold text-emerald-600 block mb-1">
                {vietnamese}
              </span>
              {example && (
                <p className="text-xs text-muted-foreground italic max-w-sm">
                  &ldquo;{example}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mt-2">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Chạm để lật xem nghĩa tiếng Việt</span>
            </div>
          )}
        </Card>
      </div>

      {/* Audio & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        <AudioButton
          audioKey={activity.audioKey || primaryItem?.audioKey}
          label="Nghe Phát Âm Chuẩn"
          className="w-full sm:w-auto"
        />

        <Button
          variant="primary"
          size="lg"
          onClick={handleComplete}
          disabled={isSubmitting}
          className="w-full sm:w-auto gap-2 shadow-button font-black rounded-2xl"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Đã Nhớ Từ Này</span>
        </Button>
      </div>
    </div>
  );
}
