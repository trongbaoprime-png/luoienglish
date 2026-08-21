"use client";

import React, { useState } from "react";
import { Activity } from "@/types/curriculum";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { AudioButton } from "./AudioButton";
import { CheckCircle2, XCircle, Mic, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityContainerProps {
  activity: Activity;
  onComplete: (isCorrect: boolean, score: number) => void;
  className?: string;
}

export function ActivityContainer({
  activity,
  onComplete,
  className,
}: ActivityContainerProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSelectOption = (id: string) => {
    if (isAnswerChecked) return;
    setSelectedOptionId(id);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId && activity.options && activity.options.length > 0) return;

    if (activity.options && activity.options.length > 0) {
      const selected = activity.options.find((o) => o.id === selectedOptionId);
      const correct = Boolean(selected?.isCorrect);
      setIsCorrect(correct);
      setIsAnswerChecked(true);
    } else {
      setIsCorrect(true);
      setIsAnswerChecked(true);
    }
  };

  const handleNext = () => {
    onComplete(isCorrect, isCorrect ? 100 : 50);
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setIsRecording(false);
  };

  const handleVoiceSimulate = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setIsCorrect(true);
      setIsAnswerChecked(true);
    }, 1500);
  };

  return (
    <Card className={cn("max-w-2xl mx-auto flex flex-col gap-6", className)}>
      {/* Activity Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <Badge variant="accent">Hoạt Động</Badge>
          <span className="text-xs font-bold text-muted-foreground uppercase">
            {activity.type.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>+{activity.rewardPoints.stars} Sao</span>
        </div>
      </div>

      {/* Mascot & Prompt */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/30 p-5 rounded-3xl border border-border/40">
        <SlothMascot
          pose={isAnswerChecked ? (isCorrect ? "happy" : "thinking") : "hello"}
          size="md"
        />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-black text-foreground mb-1">
            {activity.prompt}
          </h2>
          <p className="text-sm font-semibold text-muted-foreground">
            {activity.instructionVi}
          </p>
          {activity.targetExpectedText && (
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
              <AudioButton textToSpeak={activity.targetExpectedText} size="sm" />
              <span className="text-base font-bold text-primary">
                &ldquo;{activity.targetExpectedText}&rdquo;
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Options or Interaction Area */}
      {activity.options && activity.options.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
          {activity.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let buttonStyle = "border-border/80 bg-white hover:border-primary/60";

            if (isSelected) {
              buttonStyle = "border-primary bg-primary/10 shadow-sm";
            }

            if (isAnswerChecked) {
              if (opt.isCorrect) {
                buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
              } else if (isSelected && !opt.isCorrect) {
                buttonStyle = "border-rose-500 bg-rose-50 text-rose-950 line-through";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswerChecked}
                className={cn(
                  "p-4 rounded-2xl border-3 text-left font-bold text-base transition-all select-none cursor-pointer flex items-center justify-between",
                  buttonStyle
                )}
              >
                <span>{opt.label}</span>
                {isAnswerChecked && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                {isAnswerChecked && isSelected && !opt.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Speech / Repeat Action Area */
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <button
            onClick={handleVoiceSimulate}
            disabled={isRecording || isAnswerChecked}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-float transition-all cursor-pointer",
              isRecording
                ? "bg-rose-500 text-white border-rose-300 animate-ping"
                : "bg-primary text-primary-foreground border-primary-hover hover:scale-105"
            )}
          >
            <Mic className="w-10 h-10" />
          </button>
          <span className="text-sm font-bold text-muted-foreground">
            {isRecording ? "Đang lắng nghe bạn nói..." : "Nhấn vào Micro để nói"}
          </span>
        </div>
      )}

      {/* Action / Feedback Footer */}
      <div className="pt-4 border-t border-border/60 flex items-center justify-between">
        {isAnswerChecked ? (
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <div className="flex items-center gap-1.5 text-emerald-600 font-black text-lg">
                <CheckCircle2 className="w-6 h-6" />
                <span>Chính xác! Giỏi quá!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-rose-600 font-bold text-base">
                <XCircle className="w-6 h-6" />
                <span>Chưa đúng rồi, cùng xem lại nhé!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            {activity.hint ? `Gợi ý: ${activity.hint}` : "Chọn một đáp án rồi bấm Kiểm Tra"}
          </div>
        )}

        {isAnswerChecked ? (
          <Button onClick={handleNext} variant="primary" size="md">
            Tiếp Tục
          </Button>
        ) : (
          <Button
            onClick={handleCheckAnswer}
            disabled={!selectedOptionId && Boolean(activity.options?.length)}
            variant="primary"
            size="md"
          >
            Kiểm Tra
          </Button>
        )}
      </div>
    </Card>
  );
}
