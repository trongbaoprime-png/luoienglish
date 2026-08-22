"use client";

import React, { useEffect } from "react";
import { Trophy } from "lucide-react";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { SoundPlaybackService } from "@/lib/audio/SoundPlaybackService";
import { cn } from "@/lib/utils";

export type CelebrationIntensity = "SMALL" | "MEDIUM" | "BIG" | "EPIC";

export interface RewardCelebrationLayerProps {
  intensity: CelebrationIntensity;
  starsEarned?: number;
  xpEarned?: number;
  petFoodEarned?: number;
  onComplete?: () => void;
  className?: string;
}

export function RewardCelebrationLayer({
  intensity,
  starsEarned = 1,
  xpEarned = 10,
  petFoodEarned = 1,
  onComplete,
  className,
}: RewardCelebrationLayerProps) {
  useEffect(() => {
    if (intensity === "EPIC" || intensity === "BIG") {
      SoundPlaybackService.playSound("reward.achievement");
    } else {
      SoundPlaybackService.playSound("reward.star");
    }

    const duration =
      intensity === "SMALL" ? 1500 : intensity === "MEDIUM" ? 2500 : intensity === "BIG" ? 3500 : 4500;

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [intensity, onComplete]);

  if (intensity === "SMALL") {
    return (
      <div className={cn("pointer-events-none fixed inset-0 flex items-center justify-center z-50", className)}>
        <div className="flex items-center gap-2 bg-amber-400 text-amber-950 px-4 py-2 rounded-full font-black text-sm shadow-glow animate-bounce-gentle">
          <img src="/assets/rewards/star.svg" alt="Star" className="w-5 h-5 object-contain" />
          <span>+{starsEarned} Sao!</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in",
        className
      )}
    >
      <div className="bg-white/95 p-6 sm:p-8 rounded-4xl border-3 border-amber-300 shadow-card max-w-sm w-full text-center flex flex-col items-center gap-4 animate-scale-up">
        {/* Celebration Mascot */}
        <SlothMascot
          pose="celebrating"
          size="lg"
          speechBubbleText={
            intensity === "EPIC"
              ? "Tuyệt đỉnh! Bé đã làm chủ bài học này rồi!"
              : "Giỏi quá! Cùng nhận phần thưởng nhé!"
          }
        />

        <div className="flex items-center gap-2 text-amber-500">
          <Trophy className="w-8 h-8 fill-amber-400" />
          <h3 className="text-2xl font-black text-foreground">
            {intensity === "EPIC" ? "Làm Chủ Bài Học!" : "Hoàn Thành Xuất Sắc!"}
          </h3>
        </div>

        {/* Reward Chips */}
        <div className="flex items-center justify-center gap-3">
          {starsEarned > 0 && (
            <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-full text-xs font-black text-amber-800">
              <img src="/assets/rewards/star.svg" alt="Star" className="w-4 h-4 object-contain" />
              <span>+{starsEarned} Sao</span>
            </div>
          )}

          {xpEarned > 0 && (
            <div className="flex items-center gap-1 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full text-xs font-black text-emerald-800">
              <img src="/assets/rewards/xp.svg" alt="XP" className="w-4 h-4 object-contain" />
              <span>+{xpEarned} XP</span>
            </div>
          )}

          {petFoodEarned > 0 && (
            <div className="flex items-center gap-1 bg-rose-100 border border-rose-300 px-3 py-1.5 rounded-full text-xs font-black text-rose-800">
              <img src="/assets/rewards/pet_food.svg" alt="Táo" className="w-4 h-4 object-contain" />
              <span>+{petFoodEarned} Táo</span>
            </div>
          )}
        </div>

        <p className="text-xs font-bold text-muted-foreground mt-1">
          Đang cộng điểm thưởng vào hồ sơ của bé...
        </p>
      </div>
    </div>
  );
}
