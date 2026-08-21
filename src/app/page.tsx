"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ThemeSelector } from "@/components/theme/ThemeSelector";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import {
  ArrowRight,
  ShieldCheck,
  Brain,
  MessageCircle,
  Heart,
} from "lucide-react";

export default function RootPortalPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border/80 bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-2xl shadow-sm">
              🦥
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground leading-none">
                LƯỜI ENGLISH
              </h1>
              <span className="text-xs font-bold text-primary">
                Lười học mà vẫn giỏi!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/parent">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                <span>Phụ Huynh</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-6xl w-full mx-auto px-6 py-10 sm:py-16 flex flex-col items-center text-center gap-10">
        {/* Mascot Greeting */}
        <SlothMascot
          pose="hello"
          size="xl"
          speechBubbleText="Xin chào bạn nhỏ! Chú Lười đã sẵn sàng cùng bạn học tiếng Anh rồi nè!"
        />

        {/* Hero Title & Description */}
        <div className="max-w-2xl flex flex-col items-center gap-3">
          <Badge variant="primary" className="text-sm px-4 py-1">
            ✨ NỀN TẢNG TIẾNG ANH CHO TRẺ EM VIỆT NAM
          </Badge>
          <h2 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight leading-tight">
            LƯỜI HỌC MÀ VẪN GIỎI
          </h2>
          <p className="text-base sm:text-lg font-semibold text-muted-foreground leading-relaxed">
            Học tiếng Anh chuẩn trường học, phản xạ giao tiếp tự nhiên cùng <strong>Chú Lười</strong> thông thái qua phương pháp Spaced Repetition và Active Recall thông minh.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/home">
            <Button variant="primary" size="xl" className="gap-3 shadow-float">
              <span>Bắt Đầu Học Ngay</span>
              <ArrowRight className="w-6 h-6" />
            </Button>
          </Link>
          <Link href="/adventure-map">
            <Button variant="outline" size="xl">
              Khám Phá Bản Đồ
            </Button>
          </Link>
        </div>

        {/* Two-Theme Selector Demo */}
        <div className="w-full max-w-2xl mt-4 pt-8 border-t border-border/80">
          <h3 className="text-lg font-black text-foreground mb-4">
            Chọn Phong Cách Học Bạn Yêu Thích
          </h3>
          <ThemeSelector />
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl mt-6">
          <Card className="text-left p-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Brain className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-foreground text-base mb-1">Nhớ Lâu Không Quên</h4>
            <p className="text-xs text-muted-foreground">
              Công nghệ Spaced Repetition nhắc ôn đúng chu kỳ não bộ.
            </p>
          </Card>

          <Card className="text-left p-6">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-foreground text-base mb-1">Tự Tin Nói Tiếng Anh</h4>
            <p className="text-xs text-muted-foreground">
              Luyện phản xạ giao tiếp từ Từ vựng → Câu → Đoạn hội thoại cùng AI Chú Lười.
            </p>
          </Card>

          <Card className="text-left p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-foreground text-base mb-1">Nuôi Chú Lười Thân Thiết</h4>
            <p className="text-xs text-muted-foreground">
              Chăm sóc và đồng hành cùng Chú Lười lớn lên qua mỗi bài học hoàn thành.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 py-6 px-6 text-center text-xs font-semibold text-muted-foreground bg-card/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 LƯỜI ENGLISH. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/parent" className="hover:text-primary transition-colors">
              Cổng Phụ Huynh
            </Link>
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin Content Factory
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
