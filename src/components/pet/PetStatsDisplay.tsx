import React from "react";
import { PetStats } from "@/types/pet";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Heart, Zap, BookOpen, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PetStatsDisplayProps {
  stats: PetStats;
  className?: string;
}

export function PetStatsDisplay({ stats, className }: PetStatsDisplayProps) {
  const statList = [
    {
      label: "Hạnh Phúc",
      value: stats.happiness,
      icon: Smile,
      color: "gold" as const,
      textColor: "text-amber-600",
    },
    {
      label: "Năng Lượng",
      value: stats.energy,
      icon: Zap,
      color: "secondary" as const,
      textColor: "text-emerald-600",
    },
    {
      label: "Tri Thức",
      value: Math.min(100, Math.floor(stats.knowledge / 10)),
      icon: BookOpen,
      color: "primary" as const,
      textColor: "text-sky-600",
    },
    {
      label: "Gắn Kết",
      value: stats.bond,
      icon: Heart,
      color: "rose" as const,
      textColor: "text-rose-600",
    },
  ];

  return (
    <Card className={cn("grid grid-cols-2 sm:grid-cols-4 gap-4 p-4", className)}>
      {statList.map(({ label, value, icon: Icon, color, textColor }) => (
        <div key={label} className="flex flex-col gap-1.5 bg-muted/20 p-3 rounded-2xl border border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">{label}</span>
            <Icon className={cn("w-4 h-4", textColor)} />
          </div>
          <ProgressBar value={value} color={color} />
          <span className="text-right text-[10px] font-black text-foreground">
            {value}%
          </span>
        </div>
      ))}
    </Card>
  );
}
