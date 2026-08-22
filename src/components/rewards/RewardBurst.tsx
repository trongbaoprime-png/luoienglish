"use client";

import React, { useEffect, useState } from "react";
import { RewardPresentation } from "@/domain/rewards/RewardPresentation";

interface RewardBurstProps {
  presentation: RewardPresentation;
  onFinished?: () => void;
}

export function RewardBurst({ presentation, onFinished }: RewardBurstProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinished?.();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinished]);

  if (!visible || presentation.celebrationIntensity === "NONE") {
    return null;
  }

  const isBig =
    presentation.celebrationIntensity === "BIG" ||
    presentation.celebrationIntensity === "EPIC";

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center animate-fade-in">
      <div
        className={`transform transition-all duration-500 scale-100 p-6 rounded-3xl shadow-2xl border-4 text-center ${
          isBig
            ? "bg-gradient-to-b from-amber-100 to-yellow-200 border-yellow-400"
            : "bg-white/95 backdrop-blur-md border-amber-300"
        }`}
      >
        <div className="text-4xl mb-2 animate-bounce">
          {presentation.mascotReaction === "EXCITED" && "🦥🎉"}
          {presentation.mascotReaction === "PROUD" && "🦥⭐"}
          {presentation.mascotReaction === "CELEBRATE" && "🦥🏆"}
          {presentation.mascotReaction === "HAPPY" && "🦥✨"}
        </div>

        <h3 className="text-lg font-black text-amber-950 mb-3">
          {presentation.messageVi}
        </h3>

        <div className="flex items-center justify-center gap-4 text-sm font-bold text-amber-900">
          {presentation.starsEarned > 0 && (
            <div className="flex items-center gap-1 bg-yellow-400/30 px-3 py-1.5 rounded-2xl">
              <span>⭐</span>
              <span>+{presentation.starsEarned} Sao</span>
            </div>
          )}
          {presentation.xpEarned > 0 && (
            <div className="flex items-center gap-1 bg-sky-400/30 px-3 py-1.5 rounded-2xl">
              <span>⚡</span>
              <span>+{presentation.xpEarned} XP</span>
            </div>
          )}
          {presentation.petFoodEarned > 0 && (
            <div className="flex items-center gap-1 bg-emerald-400/30 px-3 py-1.5 rounded-2xl">
              <span>🍎</span>
              <span>+{presentation.petFoodEarned} Thức Ăn</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
