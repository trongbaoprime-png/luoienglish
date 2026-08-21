"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookOpen } from "lucide-react";
import { SlothMascot } from "@/components/mascot/SlothMascot";

export default function StoryWorldPage() {
  const stories = [
    {
      id: "story_1",
      title: "Chú Lười Đi Tìm Bạn Thân",
      titleEn: "Sloth's Journey to Find a Friend",
      grade: "Lớp 3",
      duration: "3 phút",
      coverColor: "from-amber-200 to-amber-100",
    },
    {
      id: "story_2",
      title: "Bữa Tiệc Trái Cây Trên Cây",
      titleEn: "The Treehouse Fruit Party",
      grade: "Lớp 3",
      duration: "4 phút",
      coverColor: "from-emerald-200 to-emerald-100",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="primary" className="mb-1">
            Góc Truyện Tương Tác
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Truyện Kể Song Ngữ Cùng Chú Lười
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {stories.map((story) => (
          <Card key={story.id} className="flex flex-col justify-between overflow-hidden group hover:border-primary">
            <div className={`h-40 rounded-2xl bg-gradient-to-br ${story.coverColor} p-4 flex items-center justify-between`}>
              <div>
                <Badge variant="outline" className="bg-white/80">{story.grade}</Badge>
                <span className="text-xs font-bold text-muted-foreground block mt-2">
                  ⏱️ {story.duration}
                </span>
              </div>
              <SlothMascot pose="reading" size="sm" />
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-black text-foreground">{story.title}</h3>
              <p className="text-xs font-bold text-primary italic mb-4">{story.titleEn}</p>
              <Button variant="primary" size="sm" className="w-full gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Đọc Truyện & Nghe Giọng Đọc</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
