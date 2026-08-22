import React from "react";
import { PetEmotion } from "@/types/pet";
import { Sparkles, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PetReactionLayerProps {
  emotion?: PetEmotion;
  active: boolean;
  className?: string;
}

export function PetReactionLayer({ emotion, active, className }: PetReactionLayerProps) {
  if (!active || !emotion) return null;

  const isCelebration = emotion === "CELEBRATING" || emotion === "PROUD";
  const isLove = emotion === "HAPPY" || emotion === "EXCITED";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-20",
        className
      )}
    >
      {isLove && (
        <div className="absolute animate-bounce-gentle flex gap-8">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-400 drop-shadow-md animate-pulse" />
          <Heart className="w-6 h-6 text-pink-400 fill-pink-300 drop-shadow-md -translate-y-4" />
        </div>
      )}

      {isCelebration && (
        <div className="absolute flex items-center justify-center gap-6">
          <Sparkles className="w-10 h-10 text-amber-400 fill-amber-300 animate-spin" style={{ animationDuration: "3s" }} />
          <Star className="w-8 h-8 text-amber-500 fill-amber-400 animate-bounce-gentle" />
          <Sparkles className="w-10 h-10 text-amber-400 fill-amber-300 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
      )}
    </div>
  );
}
