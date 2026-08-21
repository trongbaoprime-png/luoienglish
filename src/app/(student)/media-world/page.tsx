"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Play } from "lucide-react";

export default function MediaWorldPage() {
  const mediaItems = [
    {
      id: "media_1",
      title: "Bài Hát: The Hello Song",
      type: "Song",
      duration: "2:15",
      tags: ["Lời dịch", "Luyện hát theo"],
    },
    {
      id: "media_2",
      title: "Khám Phá: A Day in the Life of Sloth",
      type: "Mini Doc",
      duration: "3:40",
      tags: ["Từ vựng tự nhiên", "Phụ đề song ngữ"],
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <Badge variant="secondary" className="mb-1">
          Media & Video Immersion
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">
          Thế Giới Video & Âm Nhạc
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {mediaItems.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between hover:border-primary">
            <div className="relative h-44 rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden group">
              <div className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
              <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                {item.duration}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="primary">{item.type}</Badge>
                {item.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="text-base font-black text-foreground">{item.title}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
