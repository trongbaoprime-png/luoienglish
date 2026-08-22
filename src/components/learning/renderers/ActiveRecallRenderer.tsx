"use client";

import React, { useState } from "react";
import { Sparkles, HelpCircle } from "lucide-react";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { cn } from "@/lib/utils";

export interface ActiveRecallRendererProps {
  promptText: string;
  promptTextVi: string;
  options: Array<{
    id: string;
    label: string;
    isCorrect: boolean;
  }>;
  onAnswer: (selectedOptionId: string) => void;
  disabled?: boolean;
}

export function ActiveRecallRenderer({
  promptText,
  promptTextVi,
  options,
  onAnswer,
  disabled = false,
}: ActiveRecallRendererProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (disabled || selectedId) return;
    setSelectedId(id);
    onAnswer(id);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto animate-fade-in">
      {/* Mystery Challenge Header */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-amber-200 to-amber-100 px-4 py-1.5 rounded-full border border-amber-300 shadow-xs text-xs font-black text-amber-900">
        <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
        <span>Thử Thách Trí Nhớ Chú Lười</span>
      </div>

      <SlothMascot
        pose="thinking"
        size="md"
        speechBubbleText="Bé còn nhớ từ này không nhỉ? Cùng chọn nhé!"
      />

      {/* Prompt Card */}
      <div className="w-full bg-white/90 p-6 rounded-3xl border-2 border-border/80 text-center shadow-sm">
        <h3 className="text-xl font-black text-foreground mb-1">{promptText}</h3>
        <p className="text-sm font-bold text-muted-foreground">{promptTextVi}</p>
      </div>

      {/* Option Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            disabled={disabled || Boolean(selectedId)}
            className={cn(
              "p-4 rounded-2xl border-2 font-black text-base shadow-sm transition-all duration-200 active:scale-95 text-left flex items-center justify-between",
              selectedId === opt.id
                ? "bg-amber-100 border-amber-400 text-amber-950"
                : "bg-white/90 border-border/60 hover:border-amber-300 text-foreground"
            )}
          >
            <span>{opt.label}</span>
            <HelpCircle className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
