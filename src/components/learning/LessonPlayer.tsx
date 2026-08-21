"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lesson } from "@/types/curriculum";
import { LearningEvidence, LessonSessionState } from "@/types/learning";
import { ProgressController } from "@/domain/learning/ProgressController";
import { ActivityRegistry } from "@/domain/learning/ActivityRegistry";
import { LessonSummaryRenderer } from "@/components/learning/renderers/LessonSummaryRenderer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ArrowLeft, Star, Heart } from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";

interface LessonPlayerProps {
  lesson: Lesson;
  childId?: string;
  onExit?: () => void;
}

export function LessonPlayer({ lesson, childId: propChildId, onExit }: LessonPlayerProps) {
  const router = useRouter();
  const { getIdToken } = useAuth();
  const progressController = React.useMemo(() => new ProgressController(), []);

  // Derive childId from prop or localStorage
  const activeChildId = propChildId || (typeof window !== "undefined" ? localStorage.getItem("luoi_active_child_id") || "child_sample_1" : "child_sample_1");

  const storageKey = `luoi_session_${activeChildId}_${lesson.id}`;

  const [session, setSession] = useState<LessonSessionState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.lessonId === lesson.id && parsed.childId === activeChildId && parsed.status === "in_progress") {
            return parsed;
          }
        } catch {
          // Ignore parse error
        }
      }
    }
    return progressController.createSession(activeChildId, lesson.id);
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync session to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(session));
    }
  }, [session, storageKey]);

  const activities = lesson.activities;
  const currentActivityIndex = session.currentActivityIndex;
  const currentActivity = activities[currentActivityIndex];
  const progressPercent = Math.round(
    ((currentActivityIndex + (session.status === "completed" ? 1 : 0)) / activities.length) * 100
  );

  const handleAttempt = (
    attemptData: Omit<LearningEvidence, "childId" | "lessonId" | "activityId" | "knowledgeIds" | "startedAt" | "completedAt">
  ) => {
    if (!currentActivity) return;

    const fullEvidence: LearningEvidence = {
      ...attemptData,
      childId: activeChildId,
      lessonId: lesson.id,
      activityId: currentActivity.id,
      knowledgeIds: currentActivity.knowledgeItemIds,
      startedAt: session.startedAt,
      completedAt: new Date().toISOString(),
    };

    const updatedSession = progressController.recordAttempt(session, lesson, fullEvidence);
    setSession(updatedSession);
  };

  const handleNext = async () => {
    try {
      const updatedSession = progressController.nextActivity(session, lesson);
      setSession(updatedSession);

      // If completed, submit authoritative evidence to server
      if (updatedSession.status === "completed") {
        await submitSessionToServer(updatedSession);
      }
    } catch (err: unknown) {
      console.error("Progress transition error:", err);
    }
  };

  const submitSessionToServer = async (completedSession: LessonSessionState) => {
    setIsSubmitting(true);
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch("/api/learning/session", {
        method: "POST",
        headers,
        body: JSON.stringify({
          session: completedSession,
          lessonId: lesson.id,
          childId: activeChildId,
        }),
      });

      // Clear local session storage upon completion
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // Graceful offline degradation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (onExit) {
      onExit();
    } else {
      router.push("/adventure-map");
    }
  };

  if (session.status === "completed") {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-fade-in">
        <LessonSummaryRenderer
          session={session}
          lessonTitle={lesson.titleVi || lesson.title}
          onFinish={handleFinish}
        />
      </div>
    );
  }

  if (!currentActivity) {
    return (
      <Card className="p-6 text-center max-w-md mx-auto my-8">
        <p className="text-sm font-bold text-foreground">Không tìm thấy hoạt động bài học.</p>
        <Button onClick={handleFinish} className="mt-4">Trở Về Bản Đồ</Button>
      </Card>
    );
  }

  const RendererComponent = ActivityRegistry.getRenderer(currentActivity.type);

  // Filter knowledge items referenced by this activity
  const activityKnowledge = lesson.knowledgeItems.filter((k) =>
    currentActivity.knowledgeItemIds.includes(k.id)
  );

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full p-4 sm:p-6 animate-fade-in">
      {/* Session Top Navigation & Stats Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleFinish}
            className="w-9 h-9 rounded-2xl bg-muted/40 hover:bg-muted flex items-center justify-center text-muted-foreground transition-all"
            title="Thoát bài học"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-black text-foreground line-clamp-1">
              {lesson.titleVi || lesson.title}
            </h1>
            <span className="text-[10px] text-muted-foreground font-semibold">
              Hoạt động {currentActivityIndex + 1}/{activities.length}
            </span>
          </div>
        </div>

        {/* Stats Badges (Hearts & Stars) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full text-rose-700 text-xs font-black shadow-sm">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>{session.heartsRemaining}</span>
          </div>

          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-700 text-xs font-black shadow-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{session.totalStarsEarned}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        <ProgressBar value={progressPercent} color="primary" showLabel={false} />
      </div>

      {/* Dynamic Activity Renderer Card */}
      <Card className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-border/80 shadow-float relative min-h-[420px] flex flex-col justify-center">
        <RendererComponent
          activity={currentActivity}
          knowledgeItems={activityKnowledge}
          session={session}
          onAttempt={handleAttempt}
          onNext={handleNext}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}
