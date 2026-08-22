"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface RewardSummaryProps {
  starsEarned: number;
  xpEarned: number;
  petFoodEarned: number;
  streakDays?: number;
  messageVi?: string;
  onContinue: () => void;
}

export function RewardSummary({
  starsEarned,
  xpEarned,
  petFoodEarned,
  streakDays = 1,
  messageVi = "Hoàn thành xuất sắc bài học cùng Chú Lười!",
  onContinue,
}: RewardSummaryProps) {
  return (
    <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50 border-4 border-amber-300 text-center max-w-md mx-auto shadow-2xl animate-fade-in">
      <div className="text-6xl mb-4 animate-bounce">🦥✨</div>

      <h2 className="text-2xl font-black text-amber-950 mb-2">Thật Tuyệt Vời!</h2>
      <p className="text-sm font-bold text-amber-800 mb-6">{messageVi}</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/80 p-3 rounded-2xl border border-yellow-200 shadow-sm">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-xs text-amber-700 font-bold">Sao</div>
          <div className="text-lg font-black text-amber-950">+{starsEarned}</div>
        </div>

        <div className="bg-white/80 p-3 rounded-2xl border border-sky-200 shadow-sm">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xs text-sky-700 font-bold">Kinh Nghiệm</div>
          <div className="text-lg font-black text-sky-950">+{xpEarned}</div>
        </div>

        <div className="bg-white/80 p-3 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="text-2xl mb-1">🍎</div>
          <div className="text-xs text-emerald-700 font-bold">Thức Ăn</div>
          <div className="text-lg font-black text-emerald-950">+{petFoodEarned}</div>
        </div>
      </div>

      {streakDays > 0 && (
        <div className="mb-6 flex items-center justify-center gap-2 bg-orange-100/80 px-4 py-2 rounded-2xl border border-orange-200 text-xs font-bold text-orange-900">
          <span>🔥</span>
          <span>Chuỗi học tập liên tiếp: {streakDays} ngày</span>
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        onClick={onContinue}
        className="w-full rounded-2xl font-black shadow-lg"
      >
        Tiếp Tục Hành Trình
      </Button>
    </div>
  );
}
