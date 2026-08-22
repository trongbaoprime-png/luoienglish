"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import {
  Play,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Headphones,
  Mic,
  BookOpen,
  Gamepad2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface StudentHomeExperienceProps {
  childName?: string;
  className?: string;
}

export function StudentHomeExperience({
  childName = "Minh",
  className,
}: StudentHomeExperienceProps) {
  const [stars] = useState(1250);
  const [xp] = useState(45);
  const [streak] = useState(7);
  const [petFood, setPetFood] = useState(12);

  useEffect(() => {
    const savedChildId = localStorage.getItem("luoi_active_child_id");
    if (savedChildId) {
      fetch(`/api/pet?childId=${savedChildId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.petFoodBalance !== undefined) setPetFood(data.petFoodBalance);
        })
        .catch(() => {});
    }
  }, []);

  const dailyMissions = [
    {
      id: "m1",
      title: "Nhớ từ vựng (Spaced Recall)",
      duration: "3 phút",
      icon: Clock,
      color: "text-amber-500 bg-amber-100",
      completed: true,
      href: "/learn/lesson_g3_u1_l1",
    },
    {
      id: "m2",
      title: "Nghe & Shadowing",
      duration: "3 phút",
      icon: Headphones,
      color: "text-emerald-500 bg-emerald-100",
      completed: false,
      href: "/learn/lesson_g3_u1_l1",
    },
    {
      id: "m3",
      title: "Nói chuyện AI cùng Chú Lười",
      duration: "5 phút",
      icon: Mic,
      color: "text-sky-500 bg-sky-100",
      completed: false,
      href: "/talk-to-luoi",
    },
    {
      id: "m4",
      title: "Đọc truyện tranh tương tác",
      duration: "3 phút",
      icon: BookOpen,
      color: "text-purple-500 bg-purple-100",
      completed: false,
      href: "/story-world",
    },
    {
      id: "m5",
      title: "Mini Game luyện trí nhớ",
      duration: "1 phút",
      icon: Gamepad2,
      color: "text-rose-500 bg-rose-100",
      completed: false,
      href: "/game-land",
    },
  ];

  return (
    <div className={cn("flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in pb-12", className)}>
      {/* Top Quick 3D HUD (Master Design) */}
      <div className="flex items-center justify-between bg-white/95 px-4 sm:px-6 py-2.5 rounded-full border-3 border-white shadow-card">
        {/* Child Avatar & Greeting */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF8A3D] to-[#FFD166] flex items-center justify-center text-white font-black text-sm shadow-xs border-2 border-white">
            {childName.charAt(0)}
          </div>
          <div>
            <div className="text-xs font-black font-display text-foreground leading-tight">
              Chào bạn, {childName}! 👋
            </div>
            <div className="text-[10px] font-bold text-muted-foreground">Lớp 3 • Star Explorer</div>
          </div>
        </div>

        {/* Resources Metrics HUD */}
        <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-black">
          <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <img src="/assets/rewards/star.svg" alt="Star" className="w-4 h-4 object-contain" />
            <span>{stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
            <img src="/assets/rewards/xp.svg" alt="XP" className="w-4 h-4 object-contain" />
            <span>{xp} ⚡</span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            <Flame className="w-4 h-4 fill-orange-400 text-orange-500" />
            <span>{streak} ngày</span>
          </div>
          <Link
            href="/pet"
            className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 hover:scale-105 transition-transform"
          >
            <img src="/assets/rewards/pet_food.svg" alt="Táo" className="w-4 h-4 object-contain" />
            <span>{petFood}</span>
          </Link>
        </div>
      </div>

      {/* Main Welcoming 3D Story Hero Card (Master Design) */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-[#44B5E2] via-[#60A5FA] to-[#3B82F6] p-6 sm:p-10 border-4 border-white shadow-clay flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Floating Clouds Background */}
        <div className="absolute -top-4 -left-4 w-32 h-14 bg-white/20 rounded-full blur-xs animate-float" />
        <div className="absolute -bottom-6 -right-6 w-48 h-20 bg-white/20 rounded-full blur-xs animate-float" style={{ animationDelay: "1.5s" }} />

        {/* Hero Left Content */}
        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-3 max-w-md">
          <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-white border border-white/40 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Bài học hôm nay đã sẵn sàng!</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-wide drop-shadow-md">
            LƯỜI ENGLISH
          </h2>
          <p className="text-sm font-bold text-white/95 leading-relaxed">
            &ldquo;Lười học mà vẫn giỏi!&rdquo; — Cùng Chú Lười khám phá bài học mới và rinh về 3 Sao thưởng nhé!
          </p>

          <div className="mt-2 flex items-center gap-3">
            <Link
              href="/learn/lesson_g3_u1_l1"
              className="btn-3d btn-3d-orange px-8 py-3.5 text-base flex items-center gap-2 text-white shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Bắt đầu thôi!</span>
            </Link>
            <Link
              href="/adventure-map"
              className="btn-3d btn-3d-yellow px-5 py-3 text-xs flex items-center gap-1.5 text-amber-950 font-bold"
            >
              <span>Xem Bản Đồ</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3D Aviator Chú Lười Mascot Illustration with Reading & Speech */}
        <div className="relative z-10 flex flex-col items-center animate-float">
          <SlothMascot
            pose="reading"
            size="xl"
            speechBubbleText="LET'S LEARN! 🚀"
          />
        </div>
      </div>

      {/* Daily Mission Card (15 phút) — Master Design */}
      <div className="card-clay p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-foreground flex items-center gap-2">
              <span>🎯 Daily Mission</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full">
                15 phút mỗi ngày
              </span>
            </h3>
            <p className="text-xs font-bold text-muted-foreground">
              Hoàn thành chuỗi 5 nhiệm vụ để nhận rương báu Chú Lười
            </p>
          </div>

          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            1/5 Đã xong
          </span>
        </div>

        {/* Mission List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {dailyMissions.map((mission) => {
            const Icon = mission.icon;
            return (
              <Link
                key={mission.id}
                href={mission.href}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all duration-200 group no-underline",
                  mission.completed
                    ? "bg-emerald-50/60 border-emerald-200"
                    : "bg-white border-border/80 hover:border-primary hover:shadow-xs hover:scale-[1.01]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center font-black", mission.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-foreground group-hover:text-primary transition-colors">
                      {mission.title}
                    </h4>
                    <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {mission.duration}
                    </span>
                  </div>
                </div>

                {mission.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
