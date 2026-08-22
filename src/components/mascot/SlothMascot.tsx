"use client";

import React, { useState } from "react";
import { useTheme } from "@/lib/theme/themeContext";
import { MascotPose } from "@/types/assets";
import { getAssetUrl } from "@/lib/assets/assetRegistry";
import { cn } from "@/lib/utils";

export interface SlothMascotProps {
  pose?: MascotPose;
  size?: "sm" | "md" | "lg" | "xl";
  speechBubbleText?: string;
  className?: string;
  animate?: boolean;
}

export function SlothMascot({
  pose = "idle",
  size = "md",
  speechBubbleText,
  className,
  animate = true,
}: SlothMascotProps) {
  const { themeId } = useTheme();
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
  };

  const assetUrl = hasError
    ? `/assets/placeholders/sloth_${themeId}_${pose}.svg`
    : getAssetUrl(`mascot.sloth.{theme}.${pose}`, themeId);

  return (
    <div className={cn("relative inline-flex flex-col items-center select-none", className)}>
      {/* Speech Bubble */}
      {speechBubbleText && (
        <div className="relative mb-3 max-w-xs bg-white text-foreground px-4 py-2.5 rounded-2xl border-2 border-border shadow-card text-center animate-bounce-gentle">
          <p className="text-sm font-black leading-snug">{speechBubbleText}</p>
          {/* Bubble Tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-border rotate-45" />
        </div>
      )}

      {/* Mascot Container */}
      <div
        className={cn(
          "relative flex items-center justify-center transition-transform duration-300",
          sizeClasses[size],
          animate && "hover:scale-105"
        )}
      >
        <img
          src={assetUrl}
          alt={`Chú Lười ${pose}`}
          onError={() => setHasError(true)}
          className={cn(
            "w-full h-full object-contain drop-shadow-md",
            animate && pose !== "sleeping" && "animate-breathe"
          )}
        />
      </div>
    </div>
  );
}
