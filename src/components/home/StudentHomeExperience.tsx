"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { useTheme } from "@/lib/theme/themeContext";
import { Play, Map, Sparkles, Heart, Apple, Flame, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StudentHomeExperienceProps {
  childName?: string;
  className?: string;
}

export function StudentHomeExperience({
  childName = "Bảo Nhi",
  className,
}: StudentHomeExperienceProps) {
  const { themeId } = useTheme();
  const isCozy = themeId === "cozy";

  const [stars] = useState(12);
  const [xp] = useState(180);
  const [streak] = useState(3);
  const [petFood, setPetFood] = useState(2);

  useEffect(() => {
    const activeChild = localStorage.getItem("luoi_active_child_id");
    if (activeChild) {
      fetch(`/api/pet?childId=${encodeURIComponent(activeChild)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.petFoodBalance !== undefined) setPetFood(data.petFoodBalance);
        })
        .catch(() => {});
    }
  }, []);

  return (
    <div className={cn("flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in", className)}>
      {/* Top Quick HUD */}
      <div className="flex items-center justify-between bg-white/90 px-4 sm:px-6 py-2.5 rounded-full border-2 border-border/60 shadow-xs">
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-black">
          <div className="flex items-center gap-1.5 text-amber-600">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{stars}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600">
            <Zap className="w-4 h-4 fill-emerald-400 text-emerald-500" />
            <span>{xp} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-600">
            <Flame className="w-4 h-4 fill-orange-400 text-orange-500" />
            <span>{streak} ngày</span>
          </div>
        </div>

        <Link href="/pet" className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground">
          <Apple className="w-4 h-4 text-rose-500" />
          <span>{petFood} Táo</span>
        </Link>
      </div>

      {/* Main Welcoming Story Hero */}
      <div
        className={cn(
          "relative overflow-hidden rounded-4xl border-3 shadow-card p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-colors duration-500",
          isCozy
            ? "bg-gradient-to-br from-amber-100/90 via-amber-50/70 to-emerald-50/80 border-amber-200"
            : "bg-gradient-to-br from-sky-100/90 via-sky-50/70 to-emerald-50/80 border-sky-200"
        )}
      >
        <div className="flex-1 text-center md:text-left z-10">
          <Badge variant={isCozy ? "primary" : "secondary"} className="mb-2">
            {isCozy ? "🌳 Ngôi Nhà Cây Của Lười" : "🏝️ Đảo Phiêu Lưu Kì Thú"}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-2">
            Chào {childName}! Cùng Lười phiêu lưu nhé!
          </h1>
          <p className="text-sm sm:text-base font-bold text-muted-foreground max-w-lg mb-6">
            Hôm nay chúng mình cùng khám phá các câu chào hỏi và làm quen bạn mới thật tự tin!
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link href="/learn/lesson_g3_u1_l1">
              <Button
                variant="primary"
                size="lg"
                className="gap-2.5 px-7 py-3.5 text-base font-black rounded-2xl shadow-card hover:scale-105 transition-transform"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Tiếp Tục Phiêu Lưu</span>
              </Button>
            </Link>

            <Link href="/adventure-map">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 px-5 py-3.5 text-sm font-black rounded-2xl bg-white/90"
              >
                <Map className="w-4 h-4" />
                <span>Bản Đồ Bài Học</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Chú Lười Mascot Actor */}
        <div className="z-10 shrink-0">
          <SlothMascot
            pose="hello"
            size="lg"
            speechBubbleText="Học cùng Lười thật vui và không áp lực!"
          />
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/adventure-map" className="group">
          <Card className="p-5 flex items-center justify-between bg-white/90 hover:border-amber-400 hover:shadow-card transition-all rounded-3xl border-2">
            <div>
              <h3 className="text-base font-black text-foreground group-hover:text-primary transition-colors">
                Bản Đồ Phiêu Lưu
              </h3>
              <p className="text-xs font-bold text-muted-foreground">
                Xem lộ trình các bài học và mở khóa rương báu
              </p>
            </div>
            <Sparkles className="w-6 h-6 text-amber-500 shrink-0" />
          </Card>
        </Link>

        <Link href="/pet" className="group">
          <Card className="p-5 flex items-center justify-between bg-white/90 hover:border-rose-400 hover:shadow-card transition-all rounded-3xl border-2">
            <div>
              <h3 className="text-base font-black text-foreground group-hover:text-rose-500 transition-colors">
                Phòng Chú Lười
              </h3>
              <p className="text-xs font-bold text-muted-foreground">
                Cho Lười ăn táo và xem bạn lớn lên mỗi ngày
              </p>
            </div>
            <Heart className="w-6 h-6 text-rose-500 shrink-0" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
