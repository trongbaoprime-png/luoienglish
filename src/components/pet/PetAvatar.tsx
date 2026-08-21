"use client";

import React, { useState } from "react";
import { Pet } from "@/types/pet";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { Heart, Sparkles, Utensils } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface PetAvatarProps {
  pet: Pet;
  onFeed?: () => void;
  className?: string;
}

export function PetAvatar({ pet, onFeed, className }: PetAvatarProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState<string | undefined>(
    `Xin chào! Mình là ${pet.name}!`
  );

  const handlePetClick = () => {
    setIsInteracting(true);
    setBubbleMessage("Yêu bạn nhiều lắm! Cùng học tiếng Anh nhé!");
    setTimeout(() => {
      setIsInteracting(false);
      setBubbleMessage(undefined);
    }, 2500);
  };

  const handleFeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInteracting(true);
    setBubbleMessage("Ngon quá! Cảm ơn bạn đã cho mình ăn!");
    if (onFeed) onFeed();
    setTimeout(() => {
      setIsInteracting(false);
      setBubbleMessage(undefined);
    }, 2500);
  };

  return (
    <div
      onClick={handlePetClick}
      className={cn(
        "relative flex flex-col items-center p-6 bg-gradient-to-b from-amber-50/80 to-amber-100/40 rounded-4xl border-3 border-amber-200 shadow-card cursor-pointer group select-none",
        className
      )}
    >
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full border border-amber-200 text-xs font-bold text-amber-900 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
        <span className="capitalize">{pet.stage}</span>
      </div>

      <SlothMascot
        pose={isInteracting ? "happy" : "idle"}
        size="lg"
        speechBubbleText={bubbleMessage}
      />

      <div className="text-center mt-3">
        <h3 className="text-xl font-extrabold text-foreground">{pet.name}</h3>
        <p className="text-xs font-semibold text-muted-foreground">
          Người bạn đồng hành chăm học
        </p>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Button onClick={handleFeed} variant="reward" size="sm" className="gap-1.5">
          <Utensils className="w-4 h-4" />
          <span>Cho Ăn (1 Thức Ăn)</span>
        </Button>
        <button
          onClick={handlePetClick}
          className="p-2 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 border border-rose-300 transition-transform active:scale-95"
          aria-label="Xoa đầu Chú Lười"
        >
          <Heart className="w-5 h-5 fill-rose-500" />
        </button>
      </div>
    </div>
  );
}
