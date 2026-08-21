"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LessonPlayer } from "@/components/learning/LessonPlayer";
import { lessonG3U1L1, lessonG3U2L1 } from "@/domain/curriculum/seedGrade3";
import { Lesson } from "@/types/curriculum";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function LearnLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = (params?.lessonId as string) || "lesson_g3_u1_l1";

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lookup lesson from seed dataset
    if (lessonId === "lesson_g3_u2_l1") {
      setLesson(lessonG3U2L1);
    } else {
      setLesson(lessonG3U1L1);
    }
    setIsLoading(false);
  }, [lessonId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin text-3xl">🦥</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <Card className="max-w-md mx-auto p-6 text-center my-10 rounded-3xl">
        <h2 className="text-lg font-black text-foreground mb-2">Không tìm thấy bài học</h2>
        <p className="text-xs text-muted-foreground mb-4">Bài học bạn đang tìm kiếm không tồn tại.</p>
        <Button onClick={() => router.push("/adventure-map")} className="rounded-2xl">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Về Bản Đồ Phiêu Lưu</span>
        </Button>
      </Card>
    );
  }

  return <LessonPlayer lesson={lesson} onExit={() => router.push("/adventure-map")} />;
}
