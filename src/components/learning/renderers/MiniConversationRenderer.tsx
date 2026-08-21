"use client";

import React, { useState } from "react";
import { ActivityRendererProps } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export function MiniConversationRenderer({
  activity,
  onAttempt,
  onNext,
  isSubmitting,
}: ActivityRendererProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const options = activity.options || [];

  const handleSelect = (id: string) => {
    if (isChecked) return;
    setSelectedOptionId(id);
  };

  const handleCheck = async () => {
    if (!selectedOptionId) return;

    const result = await onAttempt({ selectedOptionId }, 0);
    const correct = result ? result.correct : Boolean(options.find((o) => o.id === selectedOptionId)?.isCorrect);

    setIsCorrect(correct);
    setIsChecked(true);
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto w-full animate-fade-in">
      <div className="text-center w-full">
        <Badge variant="accent" className="mb-2">Hội Thoại Cùng Chú Lười</Badge>
        <h2 className="text-xl font-black text-foreground">{activity.prompt}</h2>
        <p className="text-xs text-muted-foreground font-semibold mt-1">{activity.instructionVi}</p>
      </div>

      {/* Dialogue Scene Box */}
      <div className="w-full flex flex-col gap-4">
        {/* Sloth Speech Bubble */}
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-700 flex items-center justify-center text-3xl shrink-0 shadow-sm border border-amber-300">
            🦥
          </div>
          <div className="p-4 rounded-3xl rounded-tl-sm bg-white border-2 border-primary/30 shadow-md flex-1">
            <span className="text-xs font-bold text-muted-foreground block mb-1">
              Chú Lười:
            </span>
            <p className="text-base font-black text-foreground">
              &ldquo;{activity.targetExpectedText || activity.prompt}&rdquo;
            </p>
          </div>
        </div>

        {/* Student Response Options */}
        <div className="flex flex-col gap-2.5 mt-2 pl-4 border-l-2 border-primary/20">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Lựa chọn câu trả lời của bé:
          </span>
          {options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let btnClass = "border-border/60 hover:border-border hover:bg-muted/20";

            if (isChecked) {
              if (opt.isCorrect) {
                btnClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
              } else if (isSelected && !opt.isCorrect) {
                btnClass = "border-rose-500 bg-rose-50 text-rose-900";
              }
            } else if (isSelected) {
              btnClass = "border-primary bg-primary/5 shadow-md";
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                disabled={isChecked}
                className={`p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base flex items-center justify-between transition-all ${btnClass}`}
              >
                <span>{opt.label}</span>
                {isChecked && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex items-center justify-between pt-2">
        {!isChecked ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleCheck}
            disabled={!selectedOptionId || isSubmitting}
            className="w-full font-black rounded-2xl"
          >
            Gửi Câu Trả Lời
          </Button>
        ) : isCorrect ? (
          <div className="w-full flex flex-col gap-3 animate-fade-in">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Đối thoại rất tự nhiên và chuẩn xác!</span>
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
              Câu trả lời chưa phù hợp với ngữ cảnh hội thoại, hãy chọn lại nhé!
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setSelectedOptionId(null);
                setIsChecked(false);
                setIsCorrect(false);
              }}
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
