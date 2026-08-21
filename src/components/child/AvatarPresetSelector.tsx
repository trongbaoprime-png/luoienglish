"use client";

import React from "react";
import { Check } from "lucide-react";

export interface AvatarPreset {
  key: string;
  name: string;
  emoji: string;
  bgGradient: string;
  description: string;
}

export const SLOTH_AVATAR_PRESETS: AvatarPreset[] = [
  {
    key: "avatar_sloth_cozy",
    name: "Chú Lười Ấm Áp",
    emoji: "🦥",
    bgGradient: "from-amber-400 to-orange-500",
    description: "Yêu thích sự bình yên và đọc truyện tranh",
  },
  {
    key: "avatar_sloth_explorer",
    name: "Chú Lười Thám Hiểm",
    emoji: "🧭",
    bgGradient: "from-blue-500 to-indigo-600",
    description: "Thích khám phá từ vựng và thế giới mới",
  },
  {
    key: "avatar_sloth_artist",
    name: "Chú Lười Họa Sĩ",
    emoji: "🎨",
    bgGradient: "from-pink-400 to-rose-500",
    description: "Sáng tạo với sắc màu và bài hát vui nhộn",
  },
  {
    key: "avatar_sloth_hero",
    name: "Chú Lười Siêu Nhân",
    emoji: "⚡",
    bgGradient: "from-yellow-400 to-amber-500",
    description: "Dũng cảm vượt qua mọi thử thách phát âm",
  },
  {
    key: "avatar_sloth_scholar",
    name: "Chú Lười Bác Học",
    emoji: "🎓",
    bgGradient: "from-emerald-400 to-teal-600",
    description: "Thông thái và ghi nhớ từ vựng siêu đẳng",
  },
  {
    key: "avatar_sloth_sporty",
    name: "Chú Lười Năng Động",
    emoji: "⚽",
    bgGradient: "from-purple-400 to-indigo-500",
    description: "Tràn đầy năng lượng với các mini-game",
  },
];

interface AvatarPresetSelectorProps {
  selectedKey: string;
  onSelect: (key: string) => void;
}

export function AvatarPresetSelector({ selectedKey, onSelect }: AvatarPresetSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
      {SLOTH_AVATAR_PRESETS.map((preset) => {
        const isSelected = selectedKey === preset.key;
        return (
          <button
            key={preset.key}
            type="button"
            onClick={() => onSelect(preset.key)}
            className={`relative flex flex-col items-center p-2.5 rounded-2xl border-2 transition-all group text-center ${
              isSelected
                ? "border-primary bg-primary/5 shadow-md scale-105"
                : "border-border/60 hover:border-border hover:bg-muted/30"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${preset.bgGradient} flex items-center justify-center text-2xl shadow-sm mb-1.5`}
            >
              {preset.emoji}
            </div>
            <span className="text-[11px] font-bold text-foreground leading-tight line-clamp-1">
              {preset.name}
            </span>
            {isSelected && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
