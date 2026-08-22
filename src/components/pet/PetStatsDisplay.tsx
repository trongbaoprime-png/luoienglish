import React from "react";
import { PetProfile, PetStats } from "@/types/pet";
import { GrowthPolicy } from "@/domain/pet/GrowthPolicy";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Heart, Zap, Apple, Smile, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PetStatsDisplayProps {
  pet: PetProfile;
  className?: string;
}

export function PetStatsDisplay({ pet, className }: PetStatsDisplayProps) {
  const stats: PetStats = pet.stats;
  const stageInfo = GrowthPolicy.getStageInfo(pet.growthStage);
  const nextStage = GrowthPolicy.getNextStage(pet.growthStage);

  const statList = [
    {
      label: "Độ No",
      value: stats.hunger,
      icon: Apple,
      color: "rose" as const,
      textColor: "text-rose-500",
      symbol: "🍎",
    },
    {
      label: "Vui Vẻ",
      value: stats.happiness,
      icon: Smile,
      color: "gold" as const,
      textColor: "text-amber-500",
      symbol: "❤️",
    },
    {
      label: "Năng Lượng",
      value: stats.energy,
      icon: Zap,
      color: "secondary" as const,
      textColor: "text-emerald-500",
      symbol: "⚡",
    },
    {
      label: "Gắn Kết",
      value: stats.bond,
      icon: Heart,
      color: "rose" as const,
      textColor: "text-pink-500",
      symbol: "💛",
    },
  ];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Growth Stage Card */}
      <Card className="bg-white/90 p-4 border-2 border-amber-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h4 className="text-base font-black text-foreground">{stageInfo.titleVi}</h4>
            <span className="text-xs font-semibold text-muted-foreground">({stageInfo.titleEn})</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            {pet.xp} XP
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{stageInfo.descriptionVi}</p>

        {nextStage && (
          <div className="text-[11px] bg-muted/40 p-2.5 rounded-xl border border-border/60 flex items-center justify-between font-bold">
            <span>Tiếp theo: <strong className="text-primary">{nextStage.titleVi}</strong></span>
            <span className="text-muted-foreground">Cần {nextStage.minXp} XP & {nextStage.minBond} Gắn Kết</span>
          </div>
        )}
      </Card>

      {/* 4 Core Dimensions */}
      <Card className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white/90 shadow-sm">
        {statList.map(({ label, value, color, textColor, symbol }) => (
          <div key={label} className="flex flex-col gap-1.5 bg-muted/20 p-2.5 rounded-2xl border border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                <span>{symbol}</span> {label}
              </span>
            </div>
            <ProgressBar value={value} color={color} />
            <span className={cn("text-right text-[11px] font-black", textColor)}>
              {value}/100
            </span>
          </div>
        ))}
      </Card>
    </div>
  );
}
