"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { SoundPlaybackService } from "@/lib/audio/SoundPlaybackService";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  BookOpen,
  Sparkles,
} from "lucide-react";

export default function StoryWorldPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWord, setActiveWord] = useState<string | null>(null);

  const vocabWords = [
    { word: "magical", meaning: "Kỳ diệu, phép thuật", phonetic: "/ˈmædʒ.ɪ.kəl/" },
    { word: "cloud", meaning: "Đám mây", phonetic: "/klaʊd/" },
    { word: "sky", meaning: "Bầu trời", phonetic: "/skaɪ/" },
  ];

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    SoundPlaybackService.playSound(isPlaying ? "ui.tap" : "pet.greeting");
  };

  const handleWordClick = (word: string) => {
    setActiveWord(word);
    SoundPlaybackService.playSound("learning.correct.small");
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-fade-in pb-16">
      {/* 3D Header */}
      <div className="card-clay p-4 flex items-center justify-between">
        <Link
          href="/home"
          className="btn-3d btn-3d-yellow w-10 h-10 rounded-full flex items-center justify-center p-0"
        >
          <ArrowLeft className="w-5 h-5 text-amber-950" />
        </Link>

        <div className="text-center">
          <span className="text-[11px] font-black text-emerald-600 uppercase tracking-wide">
            Story Forest • Interactive Reader
          </span>
          <h2 className="text-lg font-black font-display text-foreground">
            Story Time: The Lazy Adventure
          </h2>
        </div>

        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700">
          <BookOpen className="w-5 h-5" />
        </div>
      </div>

      {/* 3D Illustrated Story Scene Card (Night-time Lantern & Chú Lười) */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#1E3A8A] p-6 sm:p-8 text-white shadow-clay border-4 border-white flex flex-col items-center text-center gap-4">
        {/* Glowing Lantern Effect */}
        <div className="absolute top-4 right-8 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <SlothMascot
            pose="reading"
            size="xl"
            speechBubbleText="Once upon a time in the treehouse..."
          />
        </div>

        {/* Audio Scrubber Bar */}
        <div className="relative z-10 w-full max-w-md bg-white/15 backdrop-blur-md p-3.5 rounded-3xl border border-white/20 flex items-center gap-3 mt-2">
          <button
            onClick={handleTogglePlay}
            className="btn-3d btn-3d-orange w-10 h-10 rounded-full flex items-center justify-center p-0 text-white shrink-0"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          </button>

          <div className="flex-1 flex flex-col gap-1">
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full w-[45%]" />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-white/80 font-bold">
              <span>0:24</span>
              <span>2:10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Story Text Card */}
      <div className="card-clay p-6 sm:p-8 flex flex-col gap-4">
        <h3 className="text-xl font-black font-display text-foreground">
          Chương 1: Chiếc Cây Kỳ Diệu
        </h3>

        <p className="text-base sm:text-lg font-bold text-foreground leading-relaxed">
          Lazy was reading a{" "}
          <button
            onClick={() => handleWordClick("magical")}
            className="bg-amber-200 text-amber-950 px-2 py-0.5 rounded-lg border-b-2 border-amber-400 font-black hover:bg-amber-300 transition-colors"
          >
            magical
          </button>{" "}
          <button
            onClick={() => handleWordClick("book")}
            className="bg-sky-200 text-sky-950 px-2 py-0.5 rounded-lg border-b-2 border-sky-400 font-black hover:bg-sky-300 transition-colors"
          >
            book
          </button>{" "}
          when a little{" "}
          <button
            onClick={() => handleWordClick("cloud")}
            className="bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-lg border-b-2 border-emerald-400 font-black hover:bg-emerald-300 transition-colors"
          >
            cloud
          </button>{" "}
          came down from the{" "}
          <button
            onClick={() => handleWordClick("sky")}
            className="bg-purple-200 text-purple-950 px-2 py-0.5 rounded-lg border-b-2 border-purple-400 font-black hover:bg-purple-300 transition-colors"
          >
            sky
          </button>
          ...
        </p>

        {/* Selected Word Details Popup if clicked */}
        {activeWord && (
          <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 flex items-center justify-between animate-fade-in mt-2">
            <div>
              <span className="text-xs font-black text-amber-600 uppercase">Từ vựng tương tác</span>
              <h4 className="text-base font-black text-foreground capitalize">{activeWord}</h4>
              <p className="text-xs font-bold text-muted-foreground">
                {vocabWords.find((w) => w.word === activeWord)?.meaning || "Ý nghĩa từ vựng"}
              </p>
            </div>
            <button
              onClick={() => SoundPlaybackService.playSound("learning.correct.small")}
              className="btn-3d btn-3d-blue w-9 h-9 rounded-full flex items-center justify-center p-0 text-white"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Vocabulary Drawer */}
        <div className="pt-4 border-t border-border/60">
          <span className="text-xs font-black text-muted-foreground flex items-center gap-1 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Từ mới trong bài:</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {vocabWords.map((v) => (
              <button
                key={v.word}
                onClick={() => handleWordClick(v.word)}
                className="bg-white hover:bg-emerald-50 text-foreground px-3 py-1.5 rounded-2xl border-2 border-emerald-200 text-xs font-black shadow-xs flex items-center gap-1.5"
              >
                <span>{v.word}</span>
                <span className="text-muted-foreground font-normal">({v.meaning})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
