"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Lesson } from "@/types/curriculum";
import { RawActivityResponse, LearningSession, ActivityEvaluationResult } from "@/types/learning";
import { ActivityRegistry } from "@/domain/learning/ActivityRegistry";
import { LessonSummaryRenderer } from "@/components/learning/renderers/LessonSummaryRenderer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ArrowLeft, Star, Heart, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";

interface LessonPlayerProps {
  lesson: Lesson;
  childId?: string;
  onExit?: () => void;
}

export function LessonPlayer({ lesson, childId: propChildId, onExit }: LessonPlayerProps) {
  const router = useRouter();
  const { getIdToken } = useAuth();

  // Child ID without demo fallback
  const [activeChildId] = useState<string | null>(() => {
    if (propChildId) return propChildId;
    if (typeof window !== "undefined") {
      return localStorage.getItem("luoi_active_child_id");
    }
    return null;
  });

  const [session, setSession] = useState<LearningSession | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const storageKey = activeChildId ? `luoi_session_id_${activeChildId}_${lesson.id}` : null;

  // Initialize or resume authoritative session from server
  const initServerSession = useCallback(async () => {
    if (!activeChildId) {
      setIsLoadingSession(false);
      return;
    }

    setIsLoadingSession(true);
    setSessionError(null);

    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/learning/session/start", {
        method: "POST",
        headers,
        body: JSON.stringify({
          childId: activeChildId,
          lessonId: lesson.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Không thể khởi tạo phiên học.");
      }

      setSession(data.data.session);
      if (storageKey) {
        localStorage.setItem(storageKey, data.data.session.id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối máy chủ.";
      setSessionError(msg);
    } finally {
      setIsLoadingSession(false);
    }
  }, [activeChildId, getIdToken, lesson.id, storageKey]);

  useEffect(() => {
    initServerSession();
  }, [initServerSession]);

  const handleAttempt = async (
    rawResponse: RawActivityResponse,
    hintsUsed: number = 0
  ): Promise<ActivityEvaluationResult | void> => {
    if (!session || !activeChildId) return;

    const currentActivity = lesson.activities[session.currentActivityIndex];
    if (!currentActivity) return;

    setIsSubmitting(true);
    setNetworkError(null);

    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/learning/session/${session.id}/attempt`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          activityId: currentActivity.id,
          rawResponse,
          hintsUsed,
          responseTimeMs: 2000,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Lỗi đánh giá câu trả lời.");
      }

      setSession(data.data.session);
      return data.data.evaluation;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi mạng khi gửi câu trả lời.";
      setNetworkError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!session) return;

    const nextIndex = session.currentActivityIndex + 1;
    if (nextIndex >= lesson.activities.length) {
      // Completed all activities -> call complete API
      await completeServerSession();
    }
  };

  const completeServerSession = async () => {
    if (!session) return;
    setIsSubmitting(true);
    setNetworkError(null);

    try {
      const token = await getIdToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/learning/session/${session.id}/complete`, {
        method: "POST",
        headers,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Không thể xác nhận hoàn thành bài học.");
      }

      setSession(data.data.session);

      // Only clear storage on confirmed 200 OK commit
      if (storageKey && typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi mạng khi lưu kết quả bài học.";
      setNetworkError(msg);
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

  if (!activeChildId) {
    return (
      <Card className="max-w-md mx-auto p-6 text-center my-10 rounded-3xl animate-fade-in">
        <h2 className="text-lg font-black text-foreground mb-2">Chưa chọn hồ sơ bé</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Vui lòng chọn hồ sơ học sinh để bắt đầu bài học một cách an toàn.
        </p>
        <Button onClick={() => router.push("/adventure-map")} className="rounded-2xl">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Về Trang Chủ Chọn Hồ Sơ</span>
        </Button>
      </Card>
    );
  }

  if (isLoadingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin text-4xl">🦥</div>
        <p className="text-xs font-bold text-muted-foreground">Đang tải phiên học từ máy chủ...</p>
      </div>
    );
  }

  if (sessionError || !session) {
    return (
      <Card className="max-w-md mx-auto p-6 text-center my-10 rounded-3xl border-2 border-rose-200 bg-rose-50/50 animate-fade-in">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h2 className="text-lg font-black text-rose-900 mb-2">Không thể tải phiên học</h2>
        <p className="text-xs text-rose-700 mb-4">{sessionError || "Phiên học không tồn tại."}</p>
        <Button onClick={initServerSession} variant="outline" className="rounded-2xl mr-2">
          <RefreshCw className="w-4 h-4 mr-2" />
          <span>Thử Lại</span>
        </Button>
        <Button onClick={handleFinish} variant="primary" className="rounded-2xl">
          <span>Về Bản Đồ</span>
        </Button>
      </Card>
    );
  }

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

  const activities = lesson.activities;
  const currentActivityIndex = session.currentActivityIndex;
  const currentActivity = activities[currentActivityIndex];
  const progressPercent = Math.round(
    ((session.completedActivityIds.length) / Math.max(1, activities.length)) * 100
  );

  if (!currentActivity) {
    return (
      <Card className="p-6 text-center max-w-md mx-auto my-8">
        <p className="text-sm font-bold text-foreground">Không tìm thấy hoạt động bài học.</p>
        <Button onClick={handleFinish} className="mt-4">Trở Về Bản Đồ</Button>
      </Card>
    );
  }

  const RendererComponent = ActivityRegistry.getRenderer(currentActivity.type);

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

      {/* Network Failure Banner */}
      {networkError && (
        <div className="p-3 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{networkError}</span>
          </div>
          <Button size="sm" variant="outline" onClick={completeServerSession} className="rounded-xl h-8 text-xs">
            Thử Lại
          </Button>
        </div>
      )}

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
