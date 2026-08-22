"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SoundPlaybackService } from "@/lib/audio/SoundPlaybackService";
import {
  Video,
  Play,
  ArrowLeft,
  Clock,
  BookOpen,
  Headphones,
  Film,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MediaWorldPage() {
  const [activeCategory, setActiveCategory] = useState<"stories" | "news" | "videos" | "podcast">("stories");

  const categories = [
    { id: "stories", label: "Stories", icon: BookOpen },
    { id: "news", label: "News", icon: Newspaper },
    { id: "videos", label: "Videos", icon: Film },
    { id: "podcast", label: "Podcast", icon: Headphones },
  ] as const;

  const mediaCards = [
    {
      id: "m1",
      title: "The Brave Little Sloth",
      level: "A1 • 5 phút",
      icon: "🦥",
      color: "from-[#FFD166] to-[#FF8A3D]",
      category: "stories",
    },
    {
      id: "m2",
      title: "Amazing Animals Around Us",
      level: "A2 • 6 phút",
      icon: "🐧",
      color: "from-[#38BDF8] to-[#0284C7]",
      category: "videos",
    },
    {
      id: "m3",
      title: "Space Adventure for Kids",
      level: "A2 • 7 phút",
      icon: "🚀",
      color: "from-[#A78BFA] to-[#6D28D9]",
      category: "videos",
    },
    {
      id: "m4",
      title: "School Life in London",
      level: "A1 • 4 phút",
      icon: "🏫",
      color: "from-[#4ADE80] to-[#15803D]",
      category: "news",
    },
  ];

  const handlePlayMedia = () => {
    SoundPlaybackService.playSound("pet.greeting");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in pb-16">
      {/* 3D Header */}
      <div className="card-clay p-4 sm:p-5 flex items-center justify-between">
        <Link
          href="/home"
          className="btn-3d btn-3d-yellow w-10 h-10 rounded-full flex items-center justify-center p-0"
        >
          <ArrowLeft className="w-5 h-5 text-amber-950" />
        </Link>

        <div className="text-center">
          <span className="text-[11px] font-black text-sky-600 uppercase tracking-wide">
            Media World • English Immersion
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-display text-foreground">
            Thế Giới Video & Podcast
          </h2>
        </div>

        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
          <Video className="w-5 h-5" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "btn-3d px-5 py-2 text-xs flex items-center gap-1.5 transition-all",
                isActive
                  ? "btn-3d-orange text-white"
                  : "bg-white text-muted-foreground border-2 border-border/80"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Media Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mediaCards.map((item) => (
          <div
            key={item.id}
            onClick={handlePlayMedia}
            className="card-clay p-4 flex items-center justify-between gap-4 hover:scale-[1.02] transition-transform cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-14 h-14 rounded-3xl flex items-center justify-center text-3xl shadow-xs text-white bg-gradient-to-br shrink-0",
                  item.color
                )}
              >
                {item.icon}
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-black font-display text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-amber-500" />
                  {item.level}
                </span>
              </div>
            </div>

            <button className="btn-3d btn-3d-blue w-10 h-10 rounded-full flex items-center justify-center p-0 shrink-0 text-white shadow-xs">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
