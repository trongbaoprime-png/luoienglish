"use client";

import React, { useState } from "react";
import { ActivityRendererProps } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AudioButton } from "@/components/learning/AudioButton";
import { RotateCcw, ArrowRight, Sparkles } from "lucide-react";

export function SentenceBuilderRenderer({
  activity,
  onAttempt,
  onNext,
  isSubmitting,
}: ActivityRendererProps) {
  const targetSentence = activity.targetExpectedText || "Hello, my name is Linh.";
  // Split words and shuffle
  const rawWords = targetSentence.replace(/[.?]/g, "").split(" ");

  const [availableWords, setAvailableWords] = useState<string[]>(() =>
    [...rawWords].sort(() => Math.random() - 0.5)
  );
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const startTime = React.useRef(Date.now());

  const handleWordTap = (word: string, index: number) => {
    if (isChecked) return;
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);
    setAvailableWords(newAvailable);
    setSelectedWords([...selectedWords, word]);
  };

  const handleSelectedTap = (word: string, index: number) => {
    if (isChecked) return;
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
  };

  const handleReset = () => {
    setSelectedWords([]);
    setAvailableWords([...rawWords].sort(() => Math.random() - 0.5));
    setIsChecked(false);
    setIsCorrect(false);
  };

  const handleCheck = () => {
    const userBuilt = selectedWords.join(" ");
    const cleanTarget = rawWords.join(" ");
    const correct = userBuilt.toLowerCase() === cleanTarget.toLowerCase();
    const elapsed = Date.now() - startTime.current;

    setIsCorrect(correct);
    setIsChecked(true);

    onAttempt({
      skill: "grammar",
      attemptNumber: 1,
      correct,
      score: correct ? 100 : 0,
      responseTimeMs: elapsed,
      hintsUsed: 0,
      userAnswer: userBuilt,
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto w-full animate-fade-in">
      <div className="text-center w-full">
        <Badge variant="accent" className="mb-2">Ghép Câu Hoàn Chỉnh</Badge>
        <h2 className="text-xl font-black text-foreground">{activity.prompt}</h2>
        <p className="text-xs text-muted-foreground font-semibold mt-1">{activity.instructionVi}</p>
      </div>

      {activity.audioKey && (
        <AudioButton audioKey={activity.audioKey} label="Nghe mẫu câu" />
      )}

      {/* Selected Sentence Box */}
      <div className="w-full min-h-[90px] p-4 rounded-3xl bg-white border-2 border-primary/40 shadow-inner flex flex-wrap items-center gap-2">
        {selectedWords.length === 0 ? (
          <span className="text-xs font-bold text-muted-foreground italic select-none">
            Chạm vào các từ bên dưới để ghép thành câu hoàn chỉnh...
          </span>
        ) : (
          selectedWords.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              type="button"
              onClick={() => handleSelectedTap(word, idx)}
              disabled={isChecked}
              className="px-3.5 py-2 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-sm hover:scale-95 transition-all"
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Available Word Pool */}
      <div className="flex flex-wrap justify-center gap-2.5 w-full">
        {availableWords.map((word, idx) => (
          <button
            key={`pool-${word}-${idx}`}
            type="button"
            onClick={() => handleWordTap(word, idx)}
            disabled={isChecked}
            className="px-4 py-2.5 rounded-2xl bg-muted/40 hover:bg-muted border-2 border-border text-foreground font-bold text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="w-full flex items-center justify-between gap-3 pt-2">
        {!isChecked ? (
          <>
            <Button
              variant="outline"
              size="md"
              onClick={handleReset}
              disabled={selectedWords.length === 0}
              className="rounded-2xl gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Xếp Lại</span>
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleCheck}
              disabled={selectedWords.length === 0 || isSubmitting}
              className="flex-1 font-black rounded-2xl"
            >
              Kiểm Tra Câu
            </Button>
          </>
        ) : isCorrect ? (
          <div className="w-full flex flex-col gap-3 animate-fade-in">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Câu văn rất chuẩn xác và đúng ngữ pháp!</span>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={onNext}
              className="w-full font-black rounded-2xl gap-2"
            >
              <span>Tiếp Tục</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3 animate-fade-in">
            <div className="p-3 rounded-2xl bg-rose-100 text-rose-900 text-xs font-bold text-center">
              Thứ tự các từ chưa chính xác, bé hãy chạm vào từ để đổi lại nhé!
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="w-full font-black rounded-2xl"
            >
              Thử Lại
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
