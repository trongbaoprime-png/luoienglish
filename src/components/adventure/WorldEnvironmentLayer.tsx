"use client";

import React from "react";
import { useTheme } from "@/lib/theme/themeContext";
import { Sparkles, Sun, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorldEnvironmentLayerProps {
  children?: React.ReactNode;
  className?: string;
}

export function WorldEnvironmentLayer({ children, className }: WorldEnvironmentLayerProps) {
  const { themeId } = useTheme();
  const isCozy = themeId === "cozy";

  return (
    <div
      className={cn(
        "relative w-full min-h-[850px] overflow-hidden rounded-4xl border-3 shadow-card p-6 sm:p-10 transition-colors duration-500",
        isCozy
          ? "bg-gradient-to-b from-amber-50/80 via-amber-100/40 to-emerald-50/60 border-amber-200"
          : "bg-gradient-to-b from-sky-50/80 via-sky-100/40 to-emerald-50/60 border-sky-200",
        className
      )}
    >
      {/* Background Layer: Drifting Sun & Clouds */}
      <div className="absolute top-6 left-8 pointer-events-none opacity-80 animate-pulse">
        <Sun className={cn("w-14 h-14", isCozy ? "text-amber-400 fill-amber-300" : "text-amber-300 fill-amber-200")} />
      </div>

      <div className="absolute top-12 right-12 pointer-events-none opacity-60 animate-float" style={{ animationDuration: "5s" }}>
        <Cloud className="w-20 h-20 text-white fill-white/80 drop-shadow-sm" />
      </div>

      <div className="absolute top-36 left-1/4 pointer-events-none opacity-40 animate-float" style={{ animationDuration: "7s" }}>
        <Cloud className="w-16 h-16 text-white fill-white/80 drop-shadow-sm" />
      </div>

      {/* Floating Particles (Fireflies / Sparkles) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Sparkles className="absolute top-1/4 left-1/3 w-6 h-6 text-amber-400/60 animate-bounce-gentle" />
        <Sparkles className="absolute top-1/2 right-1/4 w-7 h-7 text-emerald-400/60 animate-bounce-gentle" style={{ animationDelay: "1s" }} />
        <Sparkles className="absolute bottom-1/3 left-1/5 w-5 h-5 text-amber-300/70 animate-bounce-gentle" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content Canvas */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
