"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  ShieldCheck,
  Clock,
  Mic,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Settings,
  Plus,
} from "lucide-react";

export default function ParentDashboardPage() {
  const [activeChild] = useState({
    name: "Bảo Nhi",
    grade: 3,
    level: "A1",
    totalStudyTime: 45,
    speakingMinutes: 14,
    listeningMinutes: 28,
    masteredWords: 18,
    weakWordsCount: 2,
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Link href="/home">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay Về Góc Bé Học</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>Cổng Thông Tin Phụ Huynh</span>
              </h1>
              <span className="text-xs text-muted-foreground font-semibold">
                Theo dõi tiến bộ thực chất & quản lý hồ sơ an toàn
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Child Selector Card */}
        <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center">
              👧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-foreground">{activeChild.name}</h3>
                <Badge variant="primary">Lớp {activeChild.grade} • {activeChild.level}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Hồ sơ đang hoạt động</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Thêm Hồ Sơ Con</span>
            </Button>
          </div>
        </Card>

        {/* True Learning Metrics Grid */}
        <div>
          <h2 className="text-lg font-black text-foreground mb-3">
            Chỉ Số Học Tập Thực Chất Tuần Này
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-5">
              <Clock className="w-6 h-6 text-sky-500 mb-2" />
              <span className="text-2xl font-black text-foreground">{activeChild.totalStudyTime} phút</span>
              <span className="text-xs font-bold text-muted-foreground block mt-1">
                Thời gian học tập tích cực
              </span>
            </Card>

            <Card className="p-5">
              <Mic className="w-6 h-6 text-rose-500 mb-2" />
              <span className="text-2xl font-black text-foreground">{activeChild.speakingMinutes} phút</span>
              <span className="text-xs font-bold text-muted-foreground block mt-1">
                Thời lượng luyện phát âm
              </span>
            </Card>

            <Card className="p-5">
              <Brain className="w-6 h-6 text-emerald-500 mb-2" />
              <span className="text-2xl font-black text-foreground">{activeChild.masteredWords} từ</span>
              <span className="text-xs font-bold text-muted-foreground block mt-1">
                Từ vựng ghi nhớ vững chắc
              </span>
            </Card>

            <Card className="p-5">
              <AlertTriangle className="w-6 h-6 text-amber-500 mb-2" />
              <span className="text-2xl font-black text-foreground">{activeChild.weakWordsCount} từ</span>
              <span className="text-xs font-bold text-muted-foreground block mt-1">
                Từ vựng cần củng cố thêm
              </span>
            </Card>
          </div>
        </div>

        {/* Coaching Recommendation */}
        <Card className="p-6 bg-gradient-to-r from-emerald-50/70 to-white border-2 border-emerald-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-foreground mb-1">
                Gợi Ý Đồng Hành Cùng Bé Hôm Nay
              </h3>
              <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                Bảo Nhi đã học rất tốt mẫu câu <em>&ldquo;What&apos;s your name?&rdquo;</em> và <em>&ldquo;My name is...&rdquo;</em>. Khi ở nhà hoặc đi dạo, bố mẹ có thể đố vui bé giới thiệu tên bằng tiếng Anh để bé tăng phản xạ tự nhiên nhé!
              </p>
            </div>
          </div>
        </Card>

        {/* Child Safety Settings */}
        <Card className="p-6 bg-white">
          <h3 className="text-base font-black text-foreground mb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span>Cài Đặt An Toàn & Bảo Mật Dành Cho Trẻ Em</span>
          </h3>
          <div className="flex flex-col gap-3 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
              <span>Hồ sơ ẩn danh (Không hiển thị công khai trên internet)</span>
              <Badge variant="success">Đang Kích Hoạt</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
              <span>Chặn tin nhắn người lạ & kênh liên lạc công cộng</span>
              <Badge variant="success">Bảo Vệ Tuyệt Đối</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
              <span>Giới hạn thời gian học liên tục (Cảnh báo nghỉ ngơi sau 25 phút)</span>
              <Badge variant="primary">25 Phút</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
