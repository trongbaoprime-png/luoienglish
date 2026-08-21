"use client";

import React, { useState } from "react";
import { ActivityRendererProps } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AudioButton } from "@/components/learning/AudioButton";
import { CheckCircle2, XCircle, Sparkles, ArrowRight, HelpCircle } from "lucide-react";

export function MultipleChoiceRenderer({
  activity,
  onAttempt,
  onNext,
  isSubmitting,
}: ActivityRendererProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const startTime = React.useRef(Date.now());

  const options = activity.options || [];

  const handleSelect = (id: string) => {
    if (isChecked) return;
    setSelectedOptionId(id);
  };

  const handleCheck = () => {
    if (!selectedOptionId) return;
    const selected = options.find((o) => o.id === selectedOptionId);
    const correct = Boolean(selected?.isCorrect);
    const elapsed = Date.now() - startTime.current;

    setIsCorrect(correct);
    setIsChecked(true);

    onAttempt({
      skill: "reading",
      attemptNumber: 1,
      correct,
      score: correct ? Math.max(50, 100 - hintsUsed * 20) : 0,
      responseTimeMs: elapsed,
      hintsUsed,
      userAnswer: selected?.label || "",
    });
  };

  const handleRetry = () => {
    setSelectedOptionId(null);
    setIsChecked(false);
    setIsCorrect(false);
    setShowHint(true);
    setHintsUsed((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto w-full animate-fade-in">
      {/* Question Header */}
      <div className="text-center w-full">
        <Badge variant="accent" className="mb-2">Thử Thách Trắc Nghiệm</Badge>
        <h2 className="text-xl font-black text-foreground">{activity.prompt}</h2>
        <p className="text-xs text-muted-foreground font-semibold mt-1">{activity.instructionVi}</p>
      </div>

      {activity.audioKey && (
        <AudioButton audioKey={activity.audioKey} label="Nghe câu hỏi" />
      )}

      {/* Options List */}
      <div className="flex flex-col gap-3 w-full">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let borderClass = "border-border/60 hover:border-border hover:bg-muted/20";

          if (isChecked) {
            if (opt.isCorrect) {
              borderClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
            } else if (isSelected && !opt.isCorrect) {
              borderClass = "border-rose-500 bg-rose-50 text-rose-900";
            }
          } else if (isSelected) {
            borderClass = "border-primary bg-primary/5 shadow-md scale-[1.01]";
          }

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              disabled={isChecked}
              className={`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center justify-between transition-all ${borderClass}`}
            >
              <span>{opt.label}</span>
              {isChecked && opt.isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              {isChecked && isSelected && !opt.isCorrect && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Hint Box if shown */}
      {showHint && activity.hint && (
        <div className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Gợi ý từ Chú Lười: {activity.hint}</span>
        </div>
      )}

      {/* Feedback & Actions */}
      <div className="w-full flex items-center justify-between pt-2">
        {!isChecked ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleCheck}
            disabled={!selectedOptionId || isSubmitting}
            className="w-full font-black rounded-2xl"
          >
            Kiểm Tra Đáp Án
          </Button>
        ) : isCorrect ? (
          <div className="w-full flex flex-col gap-3 animate-fade-in">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Chính xác tuyệt vời! Bạn đã nhận được điểm sao.</span>
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
              Chưa chính xác rồi, bé hãy cùng Chú Lười thử lại nhé!
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={handleRetry}
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
