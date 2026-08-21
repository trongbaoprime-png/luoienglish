"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Clock, Star, Brain, Mic } from "lucide-react";

export default function StudentProgressPage() {
  const stats = [
    { label: "Tổng thời gian học", value: "45 phút", icon: Clock, color: "text-sky-500" },
    { label: "Sao tích lũy", value: "12 ⭐", icon: Star, color: "text-amber-500" },
    { label: "Từ vựng đã làm chủ", value: "18 từ", icon: Brain, color: "text-emerald-500" },
    { label: "Thời lượng luyện nói", value: "14 phút", icon: Mic, color: "text-rose-500" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in">
      <div>
        <Badge variant="primary" className="mb-1">
          Báo Cáo Năng Lực
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground">
          Nhật Ký Tiến Bộ Của Bảo Nhi
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} className="p-4 flex flex-col items-center text-center">
              <Icon className={`w-8 h-8 ${s.color} mb-2`} />
              <span className="text-2xl font-black text-foreground">{s.value}</span>
              <span className="text-xs font-bold text-muted-foreground mt-1">{s.label}</span>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-black text-foreground mb-4">
          Tiến Độ Hoàn Thành Chương Trình Lớp 3
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Unit 1: Hello & Friends</span>
              <span className="text-primary">65% Hoàn Thành</span>
            </div>
            <ProgressBar value={65} color="gold" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Unit 2: My School Things</span>
              <span className="text-muted-foreground">Chưa Bắt Đầu</span>
            </div>
            <ProgressBar value={0} />
          </div>
        </div>
      </Card>
    </div>
  );
}
