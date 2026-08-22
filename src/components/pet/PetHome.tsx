"use client";

import React, { useState } from "react";
import { PetProfile, PetReaction, PetInteractionType } from "@/types/pet";
import { PetAvatar } from "./PetAvatar";
import { PetStatsDisplay } from "./PetStatsDisplay";
import { FeedButton } from "./FeedButton";
import { InteractionMenu } from "./InteractionMenu";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/lib/theme/themeContext";
import { cn } from "@/lib/utils";

export interface PetHomeProps {
  initialPet: PetProfile;
  initialFoodBalance: number;
  onFeed?: (idempotencyKey: string) => Promise<{ pet: PetProfile; reaction: PetReaction; foodRemaining: number }>;
  onInteract?: (type: PetInteractionType) => Promise<{ pet: PetProfile; reaction: PetReaction }>;
  className?: string;
}

export function PetHome({
  initialPet,
  initialFoodBalance,
  onFeed,
  onInteract,
  className,
}: PetHomeProps) {
  const [pet, setPet] = useState<PetProfile>(initialPet);
  const [foodBalance, setFoodBalance] = useState<number>(initialFoodBalance);
  const [currentReaction, setCurrentReaction] = useState<PetReaction | null>(null);
  const [loading, setLoading] = useState(false);
  const { themeId } = useTheme();

  const isCozy = themeId === "cozy";

  const triggerReaction = (reaction: PetReaction) => {
    setCurrentReaction(reaction);
    setTimeout(() => {
      setCurrentReaction(null);
    }, 3500);
  };

  const handleFeed = async () => {
    if (foodBalance <= 0 || loading) return;
    setLoading(true);

    try {
      const idempotencyKey = `feed_${pet.childId}_${Date.now()}_${Math.random()}`;
      if (onFeed) {
        const result = await onFeed(idempotencyKey);
        setPet(result.pet);
        setFoodBalance(result.foodRemaining);
        triggerReaction(result.reaction);
      } else {
        // Local fallback simulation
        setFoodBalance((prev) => Math.max(0, prev - 1));
        setPet((prev) => ({
          ...prev,
          xp: prev.xp + 10,
          stats: {
            ...prev.stats,
            hunger: Math.min(100, prev.stats.hunger + 25),
            happiness: Math.min(100, prev.stats.happiness + 15),
            energy: Math.min(100, prev.stats.energy + 10),
            bond: Math.min(100, prev.stats.bond + 2),
          },
        }));
        triggerReaction({
          emotion: "HAPPY",
          animation: "EAT",
          soundEvent: "pet.eat",
          messageKey: "pet.feed.delicious",
          speechTextVi: "Ngon quá! Cảm ơn bạn đã cho Lười ăn no nhé!",
          speechTextEn: "Yummy! Thank you for feeding me!",
          intensity: "high",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInteract = async (type: PetInteractionType) => {
    if (loading) return;
    setLoading(true);

    try {
      if (onInteract) {
        const result = await onInteract(type);
        setPet(result.pet);
        triggerReaction(result.reaction);
      } else {
        setPet((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            happiness: Math.min(100, prev.stats.happiness + 5),
            bond: Math.min(100, prev.stats.bond + 1),
          },
        }));
        triggerReaction({
          emotion: "HAPPY",
          animation: type === "PET" ? "HAPPY_BOUNCE" : "WAVE",
          soundEvent: "pet.happy",
          messageKey: "pet.petting.happy",
          speechTextVi: "Thích quá đi! Cùng học tiếng Anh thật vui nhé!",
          speechTextEn: "That feels so good! Let's have fun learning English!",
          intensity: "medium",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Badge variant={isCozy ? "primary" : "secondary"} className="mb-1">
            {isCozy ? "Ngôi Nhà Cây Của Lười" : "Căn Cứ Thám Hiểm"}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Phòng Chú Lười {pet.name}
          </h2>
        </div>
      </div>

      {/* Main Avatar & Stats Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col gap-4">
          <PetAvatar
            pet={pet}
            reaction={currentReaction}
            onPetClick={() => handleInteract("PET")}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 p-4 rounded-3xl border-2 border-border/60 shadow-sm">
            <FeedButton
              foodBalance={foodBalance}
              onFeed={handleFeed}
              loading={loading}
            />

            <div className="h-8 w-px bg-border/60 hidden sm:block" />

            <InteractionMenu
              onInteract={handleInteract}
              disabled={loading}
            />
          </div>
        </div>

        <PetStatsDisplay pet={pet} />
      </div>
    </div>
  );
}
