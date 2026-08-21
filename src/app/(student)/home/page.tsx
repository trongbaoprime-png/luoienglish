"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import {
  Play,
  Brain,
  Map,
  BookOpen,
  MessageCircle,
  Video,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function StudentHomePage() {
  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-fade-in">
      {/* Hero Welcome Banner with Chú Lười */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-primary/10 to-amber-200/20 border-2 border-primary/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center md:text-left">
          <Badge variant="primary" className="mb-3">
            ✨ Bài Học Hôm Nay
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-2">
            Chào Bảo Nhi! Cùng Chú Lười học nhé!
          </h2>
          <p className="text-sm sm:text-base font-semibold text-muted-foreground max-w-xl mb-6">
            Hôm nay chúng mình sẽ khám phá cách hỏi tên và kết bạn tiếng Anh thật tự tin nhé!
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link href="/learn/lesson_g3_u1_l1">
              <Button variant="primary" size="lg" className="gap-2 shadow-float">
                <Play className="w-5 h-5 fill-current" />
                <span>Học Tiếp: What&apos;s your name?</span>
              </Button>
            </Link>
            <Link href="/adventure-map">
              <Button variant="outline" size="lg" className="gap-2">
                <Map className="w-5 h-5" />
                <span>Bản Đồ Phiêu Lưu</span>
              </Button>
            </Link>
          </div>
        </div>

        <SlothMascot
          pose="hello"
          size="lg"
          speechBubbleText="Lười học mà vẫn giỏi! Cùng luyện nói nào!"
          className="shrink-0"
        />
      </Card>

      {/* Daily Spaced Repetition & Quick Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Active Recall Memory Card */}
        <Card className="md:col-span-2 border-2 border-amber-300/80 bg-gradient-to-br from-white to-amber-50/50 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-black text-foreground">
                  Ghi Nhớ Siêu Tốc (Active Recall)
                </h3>
              </div>
              <p className="text-xs font-semibold text-muted-foreground">
                Ôn tập 3 từ vựng đúng chu kỳ để nhớ lâu không bao giờ quên!
              </p>
            </div>
            <Badge variant="accent">3 Từ Cần Ôn</Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2">
            <div className="bg-white p-3 rounded-2xl border border-amber-200 text-center">
              <span className="text-xs font-bold text-muted-foreground block">Từ 1</span>
              <span className="text-base font-extrabold text-primary">Hello</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200 text-center">
              <span className="text-xs font-bold text-muted-foreground block">Từ 2</span>
              <span className="text-base font-extrabold text-primary">Friend</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200 text-center">
              <span className="text-xs font-bold text-muted-foreground block">Từ 3</span>
              <span className="text-base font-extrabold text-primary">Name</span>
            </div>
          </div>

          <Link href="/learn/lesson_g3_u1_l1" className="mt-4">
            <Button variant="secondary" size="md" className="w-full gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Bắt Đầu Ôn Tập Nhận Thưởng</span>
            </Button>
          </Link>
        </Card>

        {/* Pet Companion Widget */}
        <Card className="flex flex-col justify-between bg-gradient-to-br from-white to-emerald-50/40 border-2 border-emerald-200">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-black text-foreground flex items-center gap-1.5">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>Chú Lười Bông</span>
              </h3>
              <Badge variant="success">Level 1</Badge>
            </div>
            <p className="text-xs font-semibold text-muted-foreground mb-3">
              Đang đói bụng! Hãy hoàn thành bài học để kiếm thức ăn cho Chú Lười nhé!
            </p>
          </div>

          <Link href="/pet">
            <Button variant="outline" size="sm" className="w-full gap-1.5 justify-between">
              <span>Thăm Phòng Chú Lười</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* Product Worlds Quick Navigation Grid */}
      <div>
        <h3 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
          <span>Khám Phá Các Vùng Đất LƯỜI</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link href="/adventure-map">
            <Card className="hover:border-primary hover:-translate-y-1 transition-all cursor-pointer h-full">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                <Map className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground text-base">Bản Đồ Phiêu Lưu</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Khám phá hòn đảo tiếng Anh Lớp 3
              </p>
            </Card>
          </Link>

          <Link href="/talk-to-luoi">
            <Card className="hover:border-primary hover:-translate-y-1 transition-all cursor-pointer h-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground text-base">Nói Cùng Chú Lười</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Luyện phản xạ giao tiếp tự nhiên với AI
              </p>
            </Card>
          </Link>

          <Link href="/story-world">
            <Card className="hover:border-primary hover:-translate-y-1 transition-all cursor-pointer h-full">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground text-base">Góc Truyện Cổ Tích</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Đọc truyện tương tác chạm nghe phát âm
              </p>
            </Card>
          </Link>

          <Link href="/media-world">
            <Card className="hover:border-primary hover:-translate-y-1 transition-all cursor-pointer h-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-foreground text-base">Media & Bài Hát</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Xem video ngắn và hát tiếng Anh
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
