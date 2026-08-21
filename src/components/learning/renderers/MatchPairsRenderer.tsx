"use client";

import React, { useState } from "react";
import { ActivityRendererProps } from "@/types/learning";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, ArrowRight } from "lucide-react";

interface PairItem {
  id: string;
  leftText: string;
  rightText: string;
}

export function MatchPairsRenderer({
  activity,
  knowledgeItems,
  onAttempt,
  onNext,
}: ActivityRendererProps) {
  const pairs: PairItem[] = knowledgeItems.map((k) => ({
    id: k.id,
    leftText: k.primaryText,
    rightText: k.vietnameseMeaning,
  }));

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleLeftClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedLeft(id);

    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedRight(id);

    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  const checkMatch = async (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      const updated = [...matchedIds, leftId];
      setMatchedIds(updated);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (updated.length >= pairs.length && pairs.length > 0) {
        setIsCompleted(true);
        // Send raw matched pairs list to server
        await onAttempt({
          matchedPairIds: updated.map((id) => ({ leftId: id, rightId: id })),
        }, 0);
      }
    } else {
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-xl mx-auto w-full animate-fade-in">
      <div className="text-center w-full">
        <Badge variant="accent" className="mb-2">Nối Cặp Từ Vựng</Badge>
        <h2 className="text-xl font-black text-foreground">{activity.prompt}</h2>
        <p className="text-xs text-muted-foreground font-semibold mt-1">
          Chạm vào từ tiếng Anh rồi chọn nghĩa tiếng Việt tương ứng
        </p>
      </div>

      {/* 2-Column Matching Grid */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Left Column (English) */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-muted-foreground text-center uppercase tracking-wider">
            Tiếng Anh
          </span>
          {pairs.map((p) => {
            const isMatched = matchedIds.includes(p.id);
            const isSelected = selectedLeft === p.id;

            return (
              <button
                key={`left-${p.id}`}
                type="button"
                onClick={() => handleLeftClick(p.id)}
                disabled={isMatched}
                className={`p-4 rounded-2xl border-2 font-bold text-sm text-center transition-all ${
                  isMatched
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 opacity-60"
                    : isSelected
                    ? "border-primary bg-primary/10 scale-105 shadow-md"
                    : "border-border/60 hover:border-border hover:bg-muted/30"
                }`}
              >
                {p.leftText}
              </button>
            );
          })}
        </div>

        {/* Right Column (Vietnamese) */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-muted-foreground text-center uppercase tracking-wider">
            Tiếng Việt
          </span>
          {pairs.map((p) => {
            const isMatched = matchedIds.includes(p.id);
            const isSelected = selectedRight === p.id;

            return (
              <button
                key={`right-${p.id}`}
                type="button"
                onClick={() => handleRightClick(p.id)}
                disabled={isMatched}
                className={`p-4 rounded-2xl border-2 font-bold text-sm text-center transition-all ${
                  isMatched
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 opacity-60"
                    : isSelected
                    ? "border-primary bg-primary/10 scale-105 shadow-md"
                    : "border-border/60 hover:border-border hover:bg-muted/30"
                }`}
              >
                {p.rightText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion */}
      {isCompleted && (
        <div className="w-full flex flex-col gap-3 animate-fade-in pt-2">
          <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Nối cặp hoàn hảo! Bé đã ghép đúng toàn bộ từ vựng.</span>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={onNext}
            className="w-full font-black rounded-2xl gap-2"
          >
            <span>Tiếp Tục Bài Học</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
