"use client";

import React from "react";
import { PetProfile, PetReaction } from "@/types/pet";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { useTheme } from "@/lib/theme/themeContext";
import { PetReactionLayer } from "./PetReactionLayer";
import { MascotPose } from "@/types/assets";
import { cn } from "@/lib/utils";

export interface PetAvatarProps {
  pet: PetProfile;
  reaction?: PetReaction | null;
  onPetClick?: () => void;
  className?: string;
}

export function PetAvatar({ pet, reaction, onPetClick, className }: PetAvatarProps) {
  const { themeId } = useTheme();
  const isCozy = themeId === "cozy";

  // Map reaction animation to MascotPose
  let pose: MascotPose = "idle";
  if (reaction) {
    if (reaction.animation === "EAT") pose = "eating";
    else if (reaction.animation === "HAPPY_BOUNCE") pose = "happy";
    else if (reaction.animation === "CLAP" || reaction.animation === "STAR_CELEBRATE") pose = "celebrating";
    else if (reaction.animation === "SLEEP") pose = "sleeping";
    else if (reaction.animation === "WAKE" || reaction.animation === "WAVE") pose = "hello";
    else if (reaction.animation === "THINK") pose = "thinking";
    else if (reaction.animation === "ENCOURAGE_NOD") pose = "encourage";
  } else if (pet.stats.energy < 25) {
    pose = "sleeping";
  }

  const speechText = reaction?.speechTextVi || `Xin chào! Mình là ${pet.name}!`;

  return (
    <div
      onClick={onPetClick}
      className={cn(
        "relative flex flex-col items-center p-6 rounded-4xl border-3 shadow-card cursor-pointer group select-none transition-all duration-300",
        isCozy
          ? "bg-gradient-to-b from-amber-50/90 to-amber-100/50 border-amber-200 hover:border-amber-300"
          : "bg-gradient-to-b from-sky-50/90 to-emerald-50/50 border-sky-200 hover:border-sky-300",
        className
      )}
    >
      {/* Particle Effect Layer */}
      <PetReactionLayer emotion={reaction?.emotion} active={Boolean(reaction)} />

      {/* Room Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-3 py-1 rounded-full border border-amber-200 text-xs font-black text-amber-900 shadow-sm">
        <span>LV.{pet.level}</span>
        <span className="capitalize text-muted-foreground font-bold">({pet.growthStage})</span>
      </div>

      {/* Chú Lười Mascot Avatar */}
      <SlothMascot
        pose={pose}
        size="lg"
        speechBubbleText={speechText}
      />

      <div className="text-center mt-3">
        <h3 className="text-xl font-extrabold text-foreground">{pet.name}</h3>
        <p className="text-xs font-bold text-muted-foreground">
          {isCozy ? "Người bạn ấm áp trong Ngôi Nhà Cây" : "Người bạn thám hiểm trên Đảo Diệu Kỳ"}
        </p>
      </div>
    </div>
  );
}
