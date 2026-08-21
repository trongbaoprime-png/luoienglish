"use client";

import React from "react";
import { useTheme } from "@/lib/theme/themeContext";
import { ThemeId } from "@/types/theme";
import { THEMES } from "@/lib/theme/themeTokens";
import { Sparkles, Compass, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThemeSelectorProps {
  childId?: string;
  onThemeSelect?: (themeId: ThemeId) => void;
  className?: string;
}

export function ThemeSelector({ childId, onThemeSelect, className }: ThemeSelectorProps) {
  const { themeId, setThemeId } = useTheme();

  const themeList: { id: ThemeId; icon: React.ElementType }[] = [
    { id: "cozy", icon: Sparkles },
    { id: "explorer", icon: Compass },
  ];

  const handleSelect = (id: ThemeId) => {
    setThemeId(id, childId);
    if (onThemeSelect) onThemeSelect(id);
  };

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mx-auto", className)}>
      {themeList.map(({ id, icon: Icon }) => {
        const item = THEMES[id];
        const isSelected = themeId === id;

        return (
          <div
            key={id}
            onClick={() => handleSelect(id)}
            className={cn(
              "relative p-5 rounded-3xl border-3 cursor-pointer transition-all duration-200 select-none",
              isSelected
                ? "border-primary bg-white shadow-card scale-[1.02]"
                : "border-border/60 bg-white/70 hover:bg-white hover:border-border"
            )}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
            <div className="flex items-center gap-3 mb-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center",
                  id === "cozy" ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">{item.nameVi}</h3>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.name}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
              {item.descriptionVi}
            </p>
          </div>
        );
      })}
    </div>
  );
}
