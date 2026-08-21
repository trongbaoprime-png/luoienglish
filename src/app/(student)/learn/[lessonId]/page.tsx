"use client";

import React, { useState } from "react";
import Link from "next/link";
import { sampleLesson1 } from "@/content/seed/grade3_hello_and_friends";
import { KnowledgeItemCard } from "@/components/learning/KnowledgeItemCard";
import { ActivityContainer } from "@/components/learning/ActivityContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { BookOpen, Sparkles, ArrowLeft, Star, Heart } from "lucide-react";

export default function LearnLessonPage() {
  const lesson = sampleLesson1;

  const [mode, setMode] = useState<"overview" | "playing" | "completed">("overview");
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [totalStarsEarned, setTotalStarsEarned] = useState(0);

  const activities = lesson.activities;
  const currentActivity = activities[currentActivityIndex];
  const progressPercent = Math.round(((currentActivityIndex + 1) / activities.length) * 100);

  const handleStartActivities = () => {
    setMode("playing");
    setCurrentActivityIndex(0);
    setTotalStarsEarned(0);
  };

  const handleActivityComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      setTotalStarsEarned((prev) => prev + currentActivity.rewardPoints.stars);
    }

    if (currentActivityIndex + 1 < activities.length) {
      setCurrentActivityIndex((prev) => prev + 1);
    } else {
      setMode("completed");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between gap-3">
        <Link href="/adventure-map">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay Lại Bản Đồ</span>
          </Button>
        </Link>
        <Badge variant="primary">{lesson.titleVi}</Badge>
      </div>

      {mode === "overview" && (
        <div className="flex flex-col gap-6">
          {/* Lesson Hero Card */}
          <Card className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-gradient-to-r from-amber-100/60 to-white border-2 border-primary/40">
            <div className="flex-1 text-center sm:text-left">
              <span className="text-xs font-extrabold text-primary uppercase tracking-wider block mb-1">
                Lớp 3 • Unit 1 • Bài 1
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
                {lesson.title}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-muted-foreground mb-4">
                {lesson.description}
              </p>
              <Button onClick={handleStartActivities} variant="primary" size="lg" className="gap-2 shadow-float">
                <Sparkles className="w-5 h-5" />
                <span>Bắt Đầu Luyện Tập ({activities.length} Thử Thách)</span>
              </Button>
            </div>
            <SlothMascot pose="reading" size="lg" speechBubbleText="Cùng nghe và lặp lại từ vựng trước nhé!" />
          </Card>

          {/* Knowledge Items Grid */}
          <div>
            <h3 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Từ Vựng & Mẫu Câu Cần Nắm</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {lesson.knowledgeItems.map((item) => (
                <KnowledgeItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === "playing" && (
        <div className="flex flex-col gap-6">
          {/* Progress Header */}
          <div className="flex flex-col gap-2 bg-white/70 p-4 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>
                Thử thách {currentActivityIndex + 1} / {activities.length}
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>+{totalStarsEarned} Sao đã đạt</span>
              </span>
            </div>
            <ProgressBar value={progressPercent} color="gold" />
          </div>

          {/* Active Activity */}
          <ActivityContainer
            activity={currentActivity}
            onComplete={handleActivityComplete}
          />
        </div>
      )}

      {mode === "completed" && (
        <Card className="text-center p-8 sm:p-12 flex flex-col items-center gap-6 bg-gradient-to-b from-amber-50 to-emerald-50/50 border-3 border-amber-300 shadow-float">
          <SlothMascot
            pose="celebrating"
            size="xl"
            speechBubbleText="Hoan hô! Bạn đã hoàn thành xuất sắc bài học!"
          />

          <div>
            <Badge variant="success" className="mb-2 text-sm px-4 py-1">
              ✨ BÀI HỌC HOÀN THÀNH
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-1">
              Tuyệt Vời Lắm, Bảo Nhi!
            </h2>
            <p className="text-base font-semibold text-muted-foreground max-w-md">
              Bạn đã ghi nhớ toàn bộ từ vựng và mẫu câu trong bài <strong>{lesson.title}</strong>!
            </p>
          </div>

          {/* Reward Summary Box */}
          <div className="flex items-center gap-4 bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-sm">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-amber-500">+{totalStarsEarned || 3}</span>
              <span className="text-xs font-bold text-muted-foreground">Sao Thưởng</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-sky-500">+50</span>
              <span className="text-xs font-bold text-muted-foreground">Điểm XP</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-emerald-500">+2</span>
              <span className="text-xs font-bold text-muted-foreground">Thức Ăn Lười</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link href="/adventure-map">
              <Button variant="primary" size="lg">
                Tiếp Tục Phiêu Lưu
              </Button>
            </Link>
            <Link href="/pet">
              <Button variant="secondary" size="lg" className="gap-2">
                <Heart className="w-5 h-5 fill-current" />
                <span>Cho Chú Lười Ăn</span>
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
