"use client";

import React from "react";
import { useTheme } from "@/lib/theme/themeContext";
import { Sparkles, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThemeToggleProps {
  childId?: string;
  className?: string;
}

export function ThemeToggle({ childId, className }: ThemeToggleProps) {
  const { themeId, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => toggleTheme(childId)}
      aria-label="Chuyển đổi giao diện Cozy và Explorer"
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-xs font-bold transition-all duration-200 cursor-pointer select-none",
        themeId === "cozy"
          ? "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200"
          : "bg-sky-100 border-sky-300 text-sky-900 hover:bg-sky-200",
        className
      )}
    >
      {themeId === "cozy" ? (
        <>
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Cozy Lười</span>
        </>
      ) : (
        <>
          <Compass className="w-4 h-4 text-sky-600 animate-spin" style={{ animationDuration: "8s" }} />
          <span>Explorer Lười</span>
        </>
      )}
    </button>
  );
}
