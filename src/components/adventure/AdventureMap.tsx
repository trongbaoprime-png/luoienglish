"use client";

import React from "react";
import Link from "next/link";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { AdventureNode } from "./AdventureNode";
import { Sparkles, Compass, Star, Play, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IslandData {
  id: string;
  name: string;
  nameVi: string;
  category: string;
  color: string;
  gradient: string;
  borderShadow: string;
  href: string;
  stars: number;
  totalStars: number;
  unlocked: boolean;
  tag: string;
  image: string;
}

export function AdventureMap() {

  const islands: IslandData[] = [
    {
      id: "english_town",
      name: "English Town",
      nameVi: "Học theo chương trình SGK",
      category: "Bài học chính khóa",
      color: "#FF6F59",
      gradient: "from-[#FF8A3D] to-[#E76F51]",
      borderShadow: "border-[#C84B31]",
      href: "/learn/lesson_g3_u1_l1",
      stars: 12,
      totalStars: 18,
      unlocked: true,
      tag: "Trọng tâm",
      image: "/assets/islands/english_town.svg",
    },
    {
      id: "conversation_city",
      name: "Conversation City",
      nameVi: "Nói chuyện AI cùng Chú Lười",
      category: "Luyện phản xạ",
      color: "#0EA5E9",
      gradient: "from-[#38BDF8] to-[#0284C7]",
      borderShadow: "border-[#0369A1]",
      href: "/talk-to-luoi",
      stars: 8,
      totalStars: 10,
      unlocked: true,
      tag: "Live AI",
      image: "/assets/islands/conversation_city.svg",
    },
    {
      id: "game_land",
      name: "Game Land",
      nameVi: "Vừa học vừa chơi",
      category: "Minigames",
      color: "#FFD166",
      gradient: "from-[#FDE047] to-[#F59E0B]",
      borderShadow: "border-[#B45309]",
      href: "/game-land",
      stars: 15,
      totalStars: 20,
      unlocked: true,
      tag: "5 Games",
      image: "/assets/islands/game_land.svg",
    },
    {
      id: "story_forest",
      name: "Story Forest",
      nameVi: "Đọc truyện tranh tương tác",
      category: "Đọc hiểu",
      color: "#10B981",
      gradient: "from-[#4ADE80] to-[#059669]",
      borderShadow: "border-[#047857]",
      href: "/story-world",
      stars: 6,
      totalStars: 12,
      unlocked: true,
      tag: "Audio Book",
      image: "/assets/islands/story_forest.svg",
    },
    {
      id: "audio_lake",
      name: "Audio Lake",
      nameVi: "Nghe Podcast & Bài hát",
      category: "Luyện nghe",
      color: "#8B5CF6",
      gradient: "from-[#A78BFA] to-[#6D28D9]",
      borderShadow: "border-[#5B21B6]",
      href: "/media-world",
      stars: 4,
      totalStars: 10,
      unlocked: true,
      tag: "Podcast",
      image: "/assets/islands/audio_lake.svg",
    },
    {
      id: "science_island",
      name: "Science Island",
      nameVi: "Khám phá khoa học tiếng Anh",
      category: "Mở rộng",
      color: "#F97316",
      gradient: "from-[#FB923C] to-[#C2410C]",
      borderShadow: "border-[#9A3412]",
      href: "#",
      stars: 0,
      totalStars: 15,
      unlocked: false,
      tag: "Khóa",
      image: "/assets/islands/science_island.svg",
    },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto animate-fade-in pb-16">
      {/* 3D Floating World Header Banner */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-r from-[#44B5E2] via-[#60A5FA] to-[#8B5CF6] p-6 sm:p-8 text-white shadow-card border-4 border-white">
        {/* Floating Clouds Background */}
        <div className="absolute top-2 left-6 w-24 h-10 bg-white/25 rounded-full blur-xs animate-float" />
        <div className="absolute bottom-4 right-12 w-36 h-12 bg-white/20 rounded-full blur-xs animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black self-center md:self-start border border-white/40">
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Adventure World • Thế Giới Lười</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-wide drop-shadow-md">
              Quần Đảo Tri Thức 3D
            </h1>
            <p className="text-sm font-bold text-white/90 max-w-md leading-snug">
              Cùng Chú Lười bay khinh khí cầu khám phá các hòn đảo học tập diệu kỳ!
            </p>
          </div>

          {/* Floating Mascot Companion */}
          <div className="relative animate-float">
            <SlothMascot
              pose="hello"
              size="lg"
              speechBubbleText="Chào bạn! Muốn bay đến đảo nào trước?"
            />
          </div>
        </div>
      </div>

      {/* Floating Islands Grid (Master Design Style) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black font-display text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
            <span>Chọn Đảo Học Tập</span>
          </h3>
          <span className="text-xs font-bold text-muted-foreground">
            Đã mở 5/6 hòn đảo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {islands.map((island) => (
            <div
              key={island.id}
              className={cn(
                "relative group flex flex-col rounded-3xl p-5 border-3 transition-all duration-300 overflow-hidden",
                island.unlocked
                  ? "bg-white/95 border-white shadow-card hover:scale-[1.03] hover:shadow-float cursor-pointer"
                  : "bg-slate-100/80 border-slate-200 opacity-70 cursor-not-allowed"
              )}
            >
              {/* Island Tag */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    "text-[11px] font-black px-3 py-0.5 rounded-full text-white shadow-xs",
                    `bg-gradient-to-r ${island.gradient}`
                  )}
                >
                  {island.tag}
                </span>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-xs font-black text-amber-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{island.stars}/{island.totalStars}</span>
                </div>
              </div>

              {/* 3D Island Artwork Preview */}
              <div className="h-44 w-full flex items-center justify-center my-1 group-hover:scale-105 transition-transform duration-500">
                <img
                  src={island.image}
                  alt={island.name}
                  className="max-h-full max-w-full object-contain drop-shadow-lg"
                />
              </div>

              {/* Island Title & Action */}
              <div className="mt-2 flex flex-col gap-1">
                <h4 className="text-lg font-black font-display text-foreground group-hover:text-primary transition-colors">
                  {island.name}
                </h4>
                <p className="text-xs font-bold text-muted-foreground">{island.nameVi}</p>
              </div>

              {/* Enter Button CTA */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-black text-muted-foreground">{island.category}</span>
                {island.unlocked ? (
                  <Link
                    href={island.href}
                    className={cn(
                      "btn-3d text-xs px-4 py-1.5 text-white flex items-center gap-1.5",
                      `bg-gradient-to-b ${island.gradient} ${island.borderShadow}`
                    )}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Khám Phá</span>
                  </Link>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Đạt cấp 5 để mở</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* S-Curve Path to English Town Lessons */}
      <div className="card-clay p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black font-display text-foreground">
              🏰 English Town: Unit 1 — Hello & Friends
            </h3>
            <p className="text-xs font-bold text-muted-foreground">
              Chào hỏi & làm quen bạn mới (Theo chương trình SGK Lớp 3)
            </p>
          </div>
          <Link
            href="/learn/lesson_g3_u1_l1"
            className="btn-3d btn-3d-orange px-5 py-2 text-xs flex items-center gap-1.5 text-white"
          >
            <span>Học Tiếp</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Lesson S-Curve Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <AdventureNode
            id="l1"
            order={1}
            title="Lesson 1"
            titleVi="Hello & Phonics /h/"
            state="COMPLETED"
            starsEarned={3}
            href="/learn/lesson_g3_u1_l1"
          />
          <AdventureNode
            id="l2"
            order={2}
            title="Lesson 2"
            titleVi="How are you?"
            state="CURRENT"
            starsEarned={2}
            href="/learn/lesson_g3_u1_l1"
          />
          <AdventureNode
            id="l3"
            order={3}
            title="Lesson 3"
            titleVi="Nice to meet you"
            state="AVAILABLE"
            starsEarned={0}
            href="/learn/lesson_g3_u1_l1"
          />
          <AdventureNode
            id="l4"
            order={4}
            title="Challenge"
            titleVi="Thử thách trí nhớ"
            state="LOCKED"
            starsEarned={0}
            href="#"
          />
        </div>
      </div>
    </div>
  );
}
