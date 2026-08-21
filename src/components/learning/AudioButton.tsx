"use client";

import React, { useState } from "react";
import { Volume2 } from "lucide-react";
import { SpeechService } from "@/services/speech/SpeechService";
import { cn } from "@/lib/utils";

export interface AudioButtonProps {
  textToSpeak?: string;
  audioKey?: string;
  audioUrl?: string;
  label?: string;
  onPlay?: () => void;
  lang?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AudioButton({
  textToSpeak,
  audioKey,
  label,
  onPlay,
  lang = "en-US",
  size = "md",
  className,
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const spokenText = textToSpeak || audioKey?.replace(/_/g, " ") || "Hello";

  const sizeStyles = {
    sm: "w-8 h-8 p-1.5 text-xs",
    md: "w-11 h-11 p-2.5 text-sm",
    lg: "w-14 h-14 p-3.5 text-base",
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    if (onPlay) onPlay();
    SpeechService.speak(spokenText, lang, 0.85);
    setTimeout(() => setIsPlaying(false), 1200);
  };

  if (label) {
    return (
      <button
        type="button"
        onClick={handlePlay}
        aria-label={`Nghe: ${spokenText}`}
        className={cn(
          "px-4 py-2.5 rounded-2xl bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm",
          isPlaying && "ring-2 ring-primary bg-primary/20",
          className
        )}
      >
        <Volume2 className={cn("w-4 h-4 text-amber-700", isPlaying && "animate-pulse")} />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={`Nghe phát âm: ${spokenText}`}
      className={cn(
        "rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm border border-primary/20",
        sizeStyles[size],
        isPlaying && "ring-2 ring-primary ring-offset-2 scale-105",
        className
      )}
    >
      <Volume2 className={cn("w-full h-full", isPlaying && "animate-pulse")} />
    </button>
  );
}
