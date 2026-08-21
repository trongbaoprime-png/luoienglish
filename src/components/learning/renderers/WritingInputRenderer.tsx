"use client";

import React, { useState } from "react";
import { ActivityRendererProps } from "@/types/learning";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AudioButton } from "@/components/learning/AudioButton";
import { ArrowRight, Sparkles, HelpCircle } from "lucide-react";

export function WritingInputRenderer({
  activity,
  knowledgeItems,
  onAttempt,
  onNext,
  isSubmitting,
}: ActivityRendererProps) {
  const [inputValue, setInputValue] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const targetAnswer = activity.targetExpectedText || knowledgeItems[0]?.primaryText || "";

  const handleCheck = async () => {
    if (!inputValue.trim()) return;

    const result = await onAttempt({ typedText: inputValue.trim() }, hintsUsed);
    const correct = result ? result.correct : inputValue.trim().toLowerCase() === targetAnswer.trim().toLowerCase();

    setIsCorrect(correct);
    setIsChecked(true);
  };

  const handleRetry = () => {
    setIsChecked(false);
    setIsCorrect(false);
    setHintsUsed((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto w-full animate-fade-in">
      <div className="text-center w-full">
        <Badge variant="accent" className="mb-2">Thử Thách Luyện Viết</Badge>
        <h2 className="text-xl font-black text-foreground">{activity.prompt}</h2>
        <p className="text-xs text-muted-foreground font-semibold mt-1">{activity.instructionVi}</p>
      </div>

      {activity.audioKey && (
        <AudioButton audioKey={activity.audioKey} label="Nghe từ mẫu" />
      )}

      {/* Input Box */}
      <Card className="p-6 rounded-3xl bg-white border-2 border-primary/40 shadow-inner w-full flex flex-col gap-3">
        <label className="text-xs font-bold text-muted-foreground">
          Nhập từ hoặc câu chính xác:
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isChecked && isCorrect}
          placeholder="Gõ câu trả lời vào đây..."
          className="w-full px-4 py-3 rounded-2xl border-2 border-border text-lg font-black focus:outline-none focus:border-primary text-center"
        />

        {hintsUsed > 0 && activity.hint && (
          <span className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Gợi ý: {activity.hint}</span>
          </span>
        )}
      </Card>

      {/* Actions */}
      <div className="w-full flex items-center justify-between pt-2">
        {!isChecked ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleCheck}
            disabled={!inputValue.trim() || isSubmitting}
            className="w-full font-black rounded-2xl"
          >
            Kiểm Tra Chính Tả
          </Button>
        ) : isCorrect ? (
          <div className="w-full flex flex-col gap-3 animate-fade-in">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Chính xác! Bé viết đúng chính tả từng ký tự.</span>
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
              Chính tả chưa đúng, bé kiểm tra lại từng chữ cái nhé!
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={handleRetry}
              className="w-full font-black rounded-2xl"
            >
              Sửa Lại
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
