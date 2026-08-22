"use client";

import React from "react";
import Link from "next/link";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { SoundPlaybackService } from "@/lib/audio/SoundPlaybackService";
import {
  Gamepad2,
  ArrowLeft,
  Play,
  Trophy,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GameLandPage() {

  const games = [
    {
      id: "word_rain",
      title: "Word Rain",
      titleVi: "Hứng từ vựng đúng",
      desc: "Nhanh tay bắt đúng quả táo mang từ vựng tương ứng khi rơi xuống!",
      reward: "+15 Sao / ván",
      color: "from-[#38BDF8] to-[#0284C7]",
      icon: "🌧️",
    },
    {
      id: "memory_match",
      title: "Memory Match",
      titleVi: "Lật thẻ bài trí nhớ",
      desc: "Tìm các cặp thẻ từ và hình ảnh tương ứng trước khi hết giờ!",
      reward: "+20 Sao / ván",
      color: "from-[#FBBF24] to-[#D97706]",
      icon: "🃏",
    },
    {
      id: "sentence_builder",
      title: "Sentence Builder",
      titleVi: "Ghép câu 3D",
      desc: "Xếp các khối hộp từ thành câu tiếng Anh chuẩn chỉnh.",
      reward: "+25 Sao / ván",
      color: "from-[#4ADE80] to-[#15803D]",
      icon: "🧱",
    },
    {
      id: "listen_tap",
      title: "Listen & Tap",
      titleVi: "Nghe & Chạm nhanh",
      desc: "Lắng nghe Chú Lười phát âm và chạm nhanh vào đồ vật đúng!",
      reward: "+15 Sao / ván",
      color: "from-[#F472B6] to-[#DB2777]",
      icon: "🎧",
    },
    {
      id: "spelling_bee",
      title: "Spelling Bee",
      titleVi: "Đánh vần từng chữ cái",
      desc: "Ghép từng chữ cái để tạo thành từ vựng hoàn chỉnh.",
      reward: "+20 Sao / ván",
      color: "from-[#A78BFA] to-[#6D28D9]",
      icon: "🐝",
    },
  ];

  const handlePlayGame = (gameId?: string) => {
    if (gameId) {
      // Game selected
    }
    SoundPlaybackService.playSound("reward.achievement");
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
          <span className="text-[11px] font-black text-amber-600 uppercase tracking-wide">
            Game Zone • Vừa Học Vừa Chơi
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-display text-foreground">
            Khu Trò Chơi Luyện Phản Xạ
          </h2>
        </div>

        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
          <Gamepad2 className="w-5 h-5" />
        </div>
      </div>

      {/* Hero Mascot Banner */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-r from-[#FFD166] via-[#F59E0B] to-[#FF8A3D] p-6 sm:p-8 text-white shadow-clay border-4 border-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black self-center sm:self-start text-amber-950 border border-white/40">
            <Trophy className="w-4 h-4 text-amber-900" />
            <span>Thử Thách Game Hàng Ngày</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-display text-amber-950 drop-shadow-xs">
            Học Qua Minigames Vui Nhộn
          </h3>
          <p className="text-xs sm:text-sm font-bold text-amber-900/90 max-w-sm">
            Chơi game giúp bé củng cố từ vựng và phản xạ phát âm tự nhiên nhất!
          </p>
        </div>

        <div className="animate-float">
          <SlothMascot
            pose="playing_game"
            size="lg"
            speechBubbleText="Chơi một ván cùng Lười nào! 🎮"
          />
        </div>
      </div>

      {/* 5 Minigames Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((game) => (
          <div
            key={game.id}
            className="card-clay p-5 flex flex-col justify-between gap-4 hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs text-white bg-gradient-to-br", game.color)}>
                  {game.icon}
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-xs font-black text-amber-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{game.reward}</span>
                </div>
              </div>

              <h4 className="text-base font-black font-display text-foreground mt-2">
                {game.title}
              </h4>
              <p className="text-xs font-bold text-primary">{game.titleVi}</p>
              <p className="text-xs text-muted-foreground leading-snug">{game.desc}</p>
            </div>

            <button
              onClick={() => handlePlayGame(game.id)}
              className="btn-3d btn-3d-orange w-full py-2.5 text-xs text-white flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Chơi Ngay</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
