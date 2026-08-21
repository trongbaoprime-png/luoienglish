"use client";

import React, { useState } from "react";
import { Volume2 } from "lucide-react";
import { SpeechService } from "@/services/speech/SpeechService";
import { cn } from "@/lib/utils";

export interface AudioButtonProps {
  textToSpeak: string;
  lang?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AudioButton({
  textToSpeak,
  lang = "en-US",
  size = "md",
  className,
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const sizeStyles = {
    sm: "w-8 h-8 p-1.5",
    md: "w-11 h-11 p-2.5",
    lg: "w-14 h-14 p-3.5",
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    SpeechService.speak(textToSpeak, lang, 0.85);
    setTimeout(() => setIsPlaying(false), 1200);
  };

  return (
    <button
      onClick={handlePlay}
      aria-label={`Nghe phát âm: ${textToSpeak}`}
      className={cn(
        "rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-primary-hover shadow-button transition-transform duration-150 active:translate-y-0.5 active:shadow-button-active hover:scale-105 cursor-pointer",
        sizeStyles[size],
        isPlaying && "animate-pulse scale-110",
        className
      )}
    >
      <Volume2 className="w-full h-full stroke-[2.5]" />
    </button>
  );
}
