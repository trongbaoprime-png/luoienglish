"use client";

import React from "react";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Play } from "lucide-react";
import { useTheme } from "@/lib/theme/themeContext";
import { cn } from "@/lib/utils";

export interface LearningSceneIntroProps {
  lessonTitle: string;
  lessonTitleVi: string;
  objectiveDescription: string;
  onStart: () => void;
  className?: string;
}

export function LearningSceneIntro({
  lessonTitle,
  lessonTitleVi,
  objectiveDescription,
  onStart,
  className,
}: LearningSceneIntroProps) {
  const { themeId } = useTheme();
  const isCozy = themeId === "cozy";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-xl mx-auto rounded-4xl border-3 shadow-card transition-all duration-300 animate-fade-in",
        isCozy
          ? "bg-gradient-to-b from-amber-50/95 via-amber-100/50 to-emerald-50/70 border-amber-200"
          : "bg-gradient-to-b from-sky-50/95 via-sky-100/50 to-emerald-50/70 border-sky-200",
        className
      )}
    >
      <Badge variant={isCozy ? "primary" : "secondary"} className="mb-4">
        ✨ Khởi Động Bài Học
      </Badge>

      <SlothMascot
        pose="hello"
        size="lg"
        speechBubbleText="Chào bạn! Sẵn sàng khám phá cùng Lười chưa?"
        className="mb-4"
      />

      <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-1">
        {lessonTitle}
      </h2>
      <p className="text-sm font-bold text-primary mb-3">{lessonTitleVi}</p>

      <p className="text-xs sm:text-sm font-semibold text-muted-foreground max-w-md mb-8">
        {objectiveDescription}
      </p>

      <Button
        onClick={onStart}
        variant="primary"
        size="lg"
        className="gap-2.5 px-8 py-4 text-base font-black rounded-2xl shadow-card hover:scale-105 transition-transform"
      >
        <Play className="w-5 h-5 fill-current" />
        <span>Bắt Đầu Ngay!</span>
      </Button>
    </div>
  );
}
