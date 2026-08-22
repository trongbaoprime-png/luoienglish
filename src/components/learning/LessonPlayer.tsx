"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Lesson } from "@/types/curriculum";
import { RawActivityResponse, LearningSession, ActivityEvaluationResult } from "@/types/learning";
import { LessonSummaryRenderer } from "@/components/learning/renderers/LessonSummaryRenderer";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { SoundPlaybackService } from "@/lib/audio/SoundPlaybackService";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  ArrowLeft,
  Volume2,
  Mic,
  SkipForward,
  Sparkles,
  BookOpen,
  MessageSquare,
  Smile,
} from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";
import { cn } from "@/lib/utils";

interface LessonPlayerProps {
  lesson: Lesson;
  childId?: string;
  onExit?: () => void;
}

export function LessonPlayer({ lesson, childId: propChildId, onExit }: LessonPlayerProps) {
  const router = useRouter();
  const { getIdToken } = useAuth();

  const [activeChildId] = useState<string | null>(() => {
    if (propChildId) return propChildId;
    if (typeof window !== "undefined") {
      return localStorage.getItem("luoi_active_child_id") || "child_demo";
    }
    return "child_demo";
  });

  const [activeTab, setActiveTab] = useState<"vocab" | "dialogue" | "game">("vocab");
  const [session, setSession] = useState<LearningSession | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const storageKey = activeChildId ? `luoi_session_id_${activeChildId}_${lesson.id}` : null;

  // Initialize or resume session
  const initServerSession = useCallback(async () => {
    setIsLoadingSession(true);

    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/learning/session/start", {
        method: "POST",
        headers,
        body: JSON.stringify({
          childId: activeChildId || "child_demo",
          lessonId: lesson.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSession(data.data.session);
        if (storageKey) {
          localStorage.setItem(storageKey, data.data.session.id);
        }
      } else {
        // Local fallback session
        setSession({
          id: `local_sess_${Date.now()}`,
          childId: activeChildId || "child_demo",
          lessonId: lesson.id,
          status: "in_progress",
          currentActivityIndex: 0,
          completedActivityIds: [],
          evidences: [],
          totalStarsEarned: 0,
          totalXpEarned: 0,
          totalPetFoodEarned: 0,
          heartsRemaining: 5,
          maxHearts: 5,
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 1,
        });
      }
    } catch {
      // Local fallback session
      setSession({
        id: `local_sess_${Date.now()}`,
        childId: activeChildId || "child_demo",
        lessonId: lesson.id,
        status: "in_progress",
        currentActivityIndex: 0,
        completedActivityIds: [],
        evidences: [],
        totalStarsEarned: 0,
        totalXpEarned: 0,
        totalPetFoodEarned: 0,
        heartsRemaining: 5,
        maxHearts: 5,
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      });
    } finally {
      setIsLoadingSession(false);
    }
  }, [activeChildId, getIdToken, lesson.id, storageKey]);

  useEffect(() => {
    initServerSession();
  }, [initServerSession]);

  const handleAttempt = async (
    rawResponse?: RawActivityResponse
  ): Promise<ActivityEvaluationResult | void> => {
    if (!session) return;
    if (rawResponse) {
      // Validated client attempt
    }

    const currentActivity = lesson.activities[session.currentActivityIndex];
    if (!currentActivity) return;

    try {
      // Audio cue on attempt
      SoundPlaybackService.playSound("learning.correct.small");

      // Advance locally if API fails or for demo
      const nextIdx = session.currentActivityIndex + 1;
      const isCompleted = nextIdx >= lesson.activities.length;

      setSession({
        ...session,
        currentActivityIndex: isCompleted ? session.currentActivityIndex : nextIdx,
        status: isCompleted ? "completed" : "in_progress",
      });
    } finally {
      // Complete attempt
    }
  };

  const handlePlayVoice = () => {
    SoundPlaybackService.playSound("pet.greeting");
  };

  const handleToggleMic = () => {
    setIsRecording(!isRecording);
    SoundPlaybackService.playSound("ui.tap");
  };

  if (isLoadingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <SlothMascot pose="thinking" size="lg" />
        <h3 className="text-lg font-black font-display text-foreground animate-pulse">
          Chú Lười đang chuẩn bị bài học cho bạn...
        </h3>
      </div>
    );
  }

  if (session && session.status === "completed") {
    return (
      <LessonSummaryRenderer
        session={session}
        lessonTitle={lesson.title}
        onFinish={onExit || (() => router.push("/adventure-map"))}
      />
    );
  }

  const vocabList = [
    { word: "mother", meaning: "Mẹ", icon: "👩" },
    { word: "father", meaning: "Bố", icon: "👨" },
    { word: "sister", meaning: "Chị/Em gái", icon: "👧" },
  ];

  const currentIdx = session ? session.currentActivityIndex : 0;
  const total = lesson.activities.length || 6;
  const progressPercent = Math.round(((currentIdx + 1) / total) * 100);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-fade-in pb-16">
      {/* 3D Master Lesson Header */}
      <div className="card-clay p-4 sm:p-5 flex items-center justify-between gap-4">
        <button
          onClick={onExit || (() => router.push("/adventure-map"))}
          className="btn-3d btn-3d-yellow w-10 h-10 rounded-full flex items-center justify-center p-0"
        >
          <ArrowLeft className="w-5 h-5 text-amber-950" />
        </button>

        <div className="flex-1 flex flex-col items-center">
          <span className="text-xs font-black text-amber-600 tracking-wide">
            {lesson.unitId?.toUpperCase() || "UNIT 1"} • BÀI {currentIdx + 1}/{total}
          </span>
          <h2 className="text-base sm:text-lg font-black font-display text-foreground truncate max-w-xs sm:max-w-md">
            {lesson.title || "Lesson 12: My Family"}
          </h2>
          <div className="w-full max-w-xs mt-1.5">
            <ProgressBar value={progressPercent} className="h-3" />
          </div>
        </div>

        <button
          onClick={() => SoundPlaybackService.playSound("learning.hint")}
          className="btn-3d btn-3d-orange text-xs px-3.5 py-1.5 text-white flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>Gợi ý</span>
        </button>
      </div>

      {/* 3D Storybook Scene Card with Chú Lười */}
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-[#BAE6FD] via-[#E0F2FE] to-[#FEF3C7] p-6 sm:p-8 border-4 border-white shadow-clay flex flex-col items-center text-center gap-4">
        <SlothMascot
          pose="speaking"
          size="lg"
          speechBubbleText="Hello! I'm Lazy. Cùng làm quen với gia đình mình nhé!"
        />

        {/* 3D Audio Controls Bar (Green Audio, Blue Mic, Orange Skip) */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-2">
          {/* Green Audio Play Button */}
          <button
            onClick={handlePlayVoice}
            className="btn-3d btn-3d-green w-12 h-12 rounded-full flex items-center justify-center p-0 shadow-md"
            title="Nghe phát âm chuẩn"
          >
            <Volume2 className="w-6 h-6 text-white" />
          </button>

          {/* Big 3D Blue Microphone Button */}
          <button
            onClick={handleToggleMic}
            className={cn(
              "btn-3d btn-3d-blue px-6 py-3.5 text-sm sm:text-base flex items-center gap-2.5 text-white shadow-lg",
              isRecording && "animate-pulse"
            )}
          >
            <Mic className="w-5 h-5 fill-current" />
            <span>{isRecording ? "Đang lắng nghe..." : "Nhấn để nói"}</span>
          </button>

          {/* Skip Button */}
          <button
            onClick={() => handleAttempt({ selectedOptionId: "opt_1" })}
            className="btn-3d btn-3d-yellow w-12 h-12 rounded-full flex items-center justify-center p-0 shadow-md"
            title="Bỏ qua"
          >
            <SkipForward className="w-5 h-5 text-amber-950" />
          </button>
        </div>
      </div>

      {/* 3D Navigation Tabs: Từ vựng / Hội thoại / Học vui */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveTab("vocab")}
          className={cn(
            "btn-3d px-5 py-2 text-xs flex items-center gap-1.5 transition-all",
            activeTab === "vocab"
              ? "btn-3d-orange text-white"
              : "bg-white text-muted-foreground border-2 border-border/80"
          )}
        >
          <BookOpen className="w-4 h-4" />
          <span>Từ vựng</span>
        </button>

        <button
          onClick={() => setActiveTab("dialogue")}
          className={cn(
            "btn-3d px-5 py-2 text-xs flex items-center gap-1.5 transition-all",
            activeTab === "dialogue"
              ? "btn-3d-orange text-white"
              : "bg-white text-muted-foreground border-2 border-border/80"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Hội thoại</span>
        </button>

        <button
          onClick={() => setActiveTab("game")}
          className={cn(
            "btn-3d px-5 py-2 text-xs flex items-center gap-1.5 transition-all",
            activeTab === "game"
              ? "btn-3d-orange text-white"
              : "bg-white text-muted-foreground border-2 border-border/80"
          )}
        >
          <Smile className="w-4 h-4" />
          <span>Học vui</span>
        </button>
      </div>

      {/* Tab 1: 3D Vocabulary Flashcards Grid (Mother, Father, Sister) */}
      {activeTab === "vocab" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          {vocabList.map((item) => (
            <div
              key={item.word}
              className="card-clay p-5 flex flex-col items-center text-center gap-3 hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => SoundPlaybackService.playSound("learning.correct.small")}
            >
              <div className="w-16 h-16 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-3xl shadow-xs">
                {item.icon}
              </div>
              <div>
                <h4 className="text-base font-black font-display text-foreground capitalize">
                  {item.word}
                </h4>
                <p className="text-xs font-bold text-muted-foreground">{item.meaning}</p>
              </div>

              <button className="btn-3d btn-3d-blue w-8 h-8 rounded-full flex items-center justify-center p-0 mt-1">
                <Volume2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Dialogue Stream */}
      {activeTab === "dialogue" && (
        <div className="card-clay p-6 flex flex-col gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-xl shrink-0">
              🦥
            </div>
            <div className="bg-amber-100/80 p-3.5 rounded-2xl rounded-tl-xs text-xs sm:text-sm font-bold text-amber-950 border border-amber-200">
              This is my family! Who is this?
            </div>
          </div>

          <div className="flex items-start gap-3 justify-end">
            <div className="bg-sky-500 text-white p-3.5 rounded-2xl rounded-tr-xs text-xs sm:text-sm font-bold shadow-xs">
              This is my mother! 👩
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Fun Mini-Challenge Activity */}
      {activeTab === "game" && (
        <div className="card-clay p-6 flex flex-col items-center text-center gap-4 animate-fade-in">
          <h4 className="text-lg font-black font-display text-foreground">
            Luyện tập ghép từ vào câu cùng Chú Lười
          </h4>
          <p className="text-xs font-bold text-muted-foreground">
            Chọn từ đúng để hoàn thành câu: &ldquo;This is my ______&rdquo;
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {["father", "sister", "brother"].map((word) => (
              <button
                key={word}
                onClick={() => handleAttempt({ selectedOptionId: word })}
                className="btn-3d btn-3d-yellow px-6 py-2.5 text-sm capitalize text-amber-950"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
