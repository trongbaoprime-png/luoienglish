"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Layers,
  BookOpen,
  HelpCircle,
  FileCheck,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function AdminContentFactoryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Link href="/home">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>Quay Về Trang Chủ</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" />
                <span>LƯỜI ENGLISH — Admin Content Factory</span>
              </h1>
              <span className="text-xs text-muted-foreground font-semibold">
                Studio biên soạn & kiểm duyệt chương trình học tiếng Anh
              </span>
            </div>
          </div>
          <Badge variant="accent">Educator Workspace</Badge>
        </div>

        {/* AI Educator Workflow Status */}
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-white border-2 border-amber-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-foreground mb-1">
                Quy Trình Kiểm Duyệt Nội Dung An Toàn
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nội dung do AI soạn thảo bắt buộc phải qua 4 bước: <strong>Ý Tưởng Sư Phạm → AI Bản Thảo → Chuyên Gia Duyệt → Xuất Bản</strong>. Tuyệt đối không cho phép AI tự động đưa bài học vào ứng dụng của trẻ nhỏ khi chưa được giáo viên xác nhận.
              </p>
            </div>
          </div>
        </Card>

        {/* Content Management Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <BookOpen className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-lg font-black text-foreground mb-1">Quản Lý Khung Chương Trình</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Cấu trúc Lớp 1 → Lớp 12, Học kỳ, Units và danh mục bài học.
              </p>
            </div>
            <Button variant="outline" size="sm">Xem 12 Khối Lớp</Button>
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <div>
              <HelpCircle className="w-8 h-8 text-sky-600 mb-3" />
              <h3 className="text-lg font-black text-foreground mb-1">Ngân Hàng Câu Hỏi & Hoạt Động</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Kho bài tập tương tác: Nghe, Nối từ, Luyện nói, Trắc nghiệm.
              </p>
            </div>
            <Button variant="outline" size="sm">Xem Hoạt Động</Button>
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <div>
              <FileCheck className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="text-lg font-black text-foreground mb-1">Hàng Đợi Kiểm Duyệt</h3>
              <p className="text-xs text-muted-foreground mb-4">
                2 bài học mới đang chờ chuyên gia sư phạm phê duyệt xuất bản.
              </p>
            </div>
            <Button variant="primary" size="sm" className="gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Duyệt Bài Viết (2)</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
