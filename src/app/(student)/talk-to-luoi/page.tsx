"use client";

import React, { useState } from "react";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { SoundPlaybackService } from "@/lib/audio/SoundPlaybackService";
import { Mic, Volume2, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TalkToLuoiPage() {
  const [messages, setMessages] = useState<Array<{ sender: "luoi" | "user"; text: string; textVi?: string }>>([
    {
      sender: "luoi",
      text: "Hi Minh! What did you do yesterday?",
      textVi: "Chào Minh! Hôm qua bạn đã làm gì thế nè?",
    },
    {
      sender: "user",
      text: "I played football.",
      textVi: "Mình đã chơi đá bóng.",
    },
    {
      sender: "luoi",
      text: "Wow! That's great! Who did you play with?",
      textVi: "Tuyệt quá! Bạn đã chơi cùng với ai thế?",
    },
  ]);

  const [isRecording, setIsRecording] = useState(false);

  const suggestions = ["my friends", "at school", "in the park", "with my brother"];

  const handleSendSuggestion = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `I played with ${text}.` },
    ]);
    SoundPlaybackService.playSound("learning.correct.small");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "luoi",
          text: `Awesome! Playing ${text} sounds like so much fun! What else do you like to do?`,
          textVi: `Tuyệt đỉnh! Chơi cùng ${text} vui thật đấy! Bạn còn thích làm gì nữa không?`,
        },
      ]);
      SoundPlaybackService.playSound("pet.greeting");
    }, 1000);
  };

  const handleToggleMic = () => {
    setIsRecording(!isRecording);
    SoundPlaybackService.playSound(isRecording ? "ui.tap" : "learning.correct.small");
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto animate-fade-in pb-16">
      {/* 3D Header */}
      <div className="card-clay p-4 flex items-center justify-between">
        <Link
          href="/home"
          className="btn-3d btn-3d-yellow w-10 h-10 rounded-full flex items-center justify-center p-0"
        >
          <ArrowLeft className="w-5 h-5 text-amber-950" />
        </Link>

        <div className="text-center">
          <span className="text-[11px] font-black text-primary uppercase tracking-wide">
            Conversation City • AI Live Tutor
          </span>
          <h2 className="text-lg font-black font-display text-foreground">
            Nói chuyện với Chú Lười
          </h2>
        </div>

        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700">
          AI
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="card-clay p-6 flex flex-col gap-4 min-h-[380px] justify-between">
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[360px] pr-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-start gap-3",
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {msg.sender === "luoi" && (
                <div className="w-10 h-10 shrink-0">
                  <SlothMascot pose="speaking" size="sm" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[78%] p-4 rounded-3xl text-sm font-bold shadow-xs",
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white rounded-tr-none"
                    : "bg-amber-50/90 text-foreground border-2 border-amber-200/80 rounded-tl-none"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-black">{msg.text}</p>
                  {msg.sender === "luoi" && (
                    <button
                      onClick={() => SoundPlaybackService.playSound("pet.greeting")}
                      className="text-amber-700 hover:scale-110 transition-transform"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {msg.textVi && (
                  <p className="text-[11px] font-semibold text-muted-foreground mt-1 pt-1 border-t border-amber-200/60">
                    {msg.textVi}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-col gap-2 pt-3 border-t border-border/60">
          <span className="text-xs font-black text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gợi ý câu:</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {suggestions.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendSuggestion(chip)}
                className="bg-white hover:bg-amber-100 text-foreground px-3.5 py-1.5 rounded-full border-2 border-amber-200 text-xs font-black shadow-xs active:scale-95 transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Big Blue Microphone Action Bar */}
      <div className="card-clay p-4 flex flex-col items-center gap-3">
        {/* Pulsating Waveform Simulation when active */}
        {isRecording && (
          <div className="flex items-center gap-1.5 h-6">
            <div className="w-1.5 h-3 bg-sky-500 rounded-full animate-bounce" />
            <div className="w-1.5 h-6 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
            <div className="w-1.5 h-4 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
            <div className="w-1.5 h-5 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0.45s" }} />
            <div className="w-1.5 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: "0.6s" }} />
          </div>
        )}

        <button
          onClick={handleToggleMic}
          className={cn(
            "btn-3d btn-3d-blue px-10 py-4 text-base sm:text-lg flex items-center gap-3 text-white shadow-lg",
            isRecording && "animate-glow"
          )}
        >
          <Mic className="w-6 h-6 fill-current" />
          <span>{isRecording ? "Đang lắng nghe..." : "Nhấn để nói"}</span>
        </button>
      </div>
    </div>
  );
}
