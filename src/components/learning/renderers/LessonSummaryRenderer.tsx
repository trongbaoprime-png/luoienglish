"use client";

import React from "react";
import { LessonSessionState } from "@/types/learning";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { Star, Trophy, Sparkles, Flame, Apple, ArrowRight } from "lucide-react";

interface LessonSummaryRendererProps {
  session: LessonSessionState;
  lessonTitle: string;
  onFinish: () => void;
}

export function LessonSummaryRenderer({
  session,
  lessonTitle,
  onFinish,
}: LessonSummaryRendererProps) {
  const accuracy = session.evidences.length > 0
    ? Math.round(
        (session.evidences.filter((e) => e.correct).length / session.evidences.length) * 100
      )
    : 100;

  return (
    <div className="flex flex-col items-center gap-6 max-w-lg mx-auto w-full animate-scale-up py-4">
      {/* Mascot Celebration */}
      <div className="relative">
        <SlothMascot pose="celebrating" size="lg" />
        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-lg animate-bounce">
          <Trophy className="w-5 h-5" />
        </div>
      </div>

      <div className="text-center">
        <Badge variant="primary" className="mb-2">Hoàn Thành Xuất Sắc</Badge>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">{lessonTitle}</h1>
        <p className="text-xs text-muted-foreground font-semibold mt-1">
          Chú Lười rất tự hào về tinh thần học tập của bé hôm nay!
        </p>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <Card className="p-4 rounded-3xl bg-amber-50/80 border-2 border-amber-300 text-center flex flex-col items-center">
          <Star className="w-6 h-6 text-amber-500 fill-amber-400 mb-1 animate-pulse" />
          <span className="text-2xl font-black text-amber-900">+{session.totalStarsEarned}</span>
          <span className="text-[10px] font-bold text-amber-700 uppercase">Sao Thưởng</span>
        </Card>

        <Card className="p-4 rounded-3xl bg-indigo-50/80 border-2 border-indigo-300 text-center flex flex-col items-center">
          <Sparkles className="w-6 h-6 text-indigo-500 mb-1" />
          <span className="text-2xl font-black text-indigo-900">+{session.totalXpEarned}</span>
          <span className="text-[10px] font-bold text-indigo-700 uppercase">Điểm XP</span>
        </Card>

        <Card className="p-4 rounded-3xl bg-emerald-50/80 border-2 border-emerald-300 text-center flex flex-col items-center">
          <Apple className="w-6 h-6 text-emerald-500 fill-emerald-400 mb-1" />
          <span className="text-2xl font-black text-emerald-900">+{session.totalPetFoodEarned}</span>
          <span className="text-[10px] font-bold text-emerald-700 uppercase">Thức Ăn Pet</span>
        </Card>
      </div>

      {/* Accuracy Stats */}
      <Card className="p-4 rounded-3xl bg-white border-2 border-border/80 w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <div>
            <div className="text-xs font-bold text-foreground">Độ chính xác bài học</div>
            <div className="text-[10px] text-muted-foreground font-semibold">
              {session.evidences.filter((e) => e.correct).length}/{session.evidences.length} câu đúng
            </div>
          </div>
        </div>
        <span className="text-xl font-black text-primary">{accuracy}%</span>
      </Card>

      {/* Finish Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onFinish}
        className="w-full font-black rounded-2xl gap-2 shadow-button text-base py-4"
      >
        <span>Thu Thập Phần Thưởng & Về Bản Đồ</span>
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
