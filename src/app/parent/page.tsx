"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/lib/auth/authContext";
import {
  ShieldCheck,
  Clock,
  Mic,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Settings,
  Lock,
  LogOut,
  LogIn,
  KeyRound,
  Play,
} from "lucide-react";

export default function ParentDashboardPage() {
  const router = useRouter();
  const { user, logout, selectChildSession } = useAuth();

  const [activeChild] = useState({
    id: "child_sample_1",
    parentUid: user?.uid || "parent_sample_1",
    name: "Bảo Nhi",
    nickname: "Bảo Nhi",
    avatarKey: "avatar_sloth_cozy",
    grade: 3,
    schoolGrade: 3 as const,
    englishLevel: "A1" as const,
    preferences: { themeId: "cozy" as const },
    totalStudyTime: 45,
    speakingMinutes: 14,
    listeningMinutes: 28,
    masteredWords: 18,
    weakWordsCount: 2,
    dailyGoalMinutes: 15,
    totalStudyTimeMinutes: 45,
    streakDays: 3,
    lastActiveDate: "2026-08-21",
    createdAt: new Date().toISOString(),
  });

  const [newPin, setNewPin] = useState("");
  const [pinMessage, setPinMessage] = useState<string | null>(null);

  const handleStartChildSession = () => {
    selectChildSession(activeChild);
    router.push("/home");
  };

  const handleSetPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      setPinMessage("Mã PIN phải từ 4–6 số.");
      return;
    }

    try {
      const res = await fetch("/api/auth/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set",
          parentUid: user?.uid || "parent_sample_1",
          pin: newPin,
        }),
      });
      const data = await res.json();
      setPinMessage(data.message);
      setNewPin("");
    } catch {
      setPinMessage("Không thể lưu mã PIN.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Link href="/home">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>Về Trang Chủ</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>Cổng Thông Tin Phụ Huynh</span>
              </h1>
              <span className="text-xs text-muted-foreground font-semibold">
                Theo dõi tiến bộ thực chất & quản lý quyền riêng tư của bé
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground hidden md:inline">
                  {user.displayName}
                </span>
                <Button onClick={logout} variant="outline" size="sm" className="gap-1 text-rose-600">
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất</span>
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Child Selector & Mode Switch Card */}
        <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center">
              👧
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-foreground">{activeChild.name}</h3>
                <Badge variant="primary">Lớp {activeChild.grade} • {activeChild.englishLevel}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Hồ sơ học sinh đang chọn</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleStartChildSession}
              variant="primary"
              size="md"
              className="gap-2 shadow-button"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Chuyển Sang Góc Bé Học</span>
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

        {/* Parental PIN & Child Safety Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PIN Management */}
          <Card className="p-6 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-base font-black text-foreground mb-1 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <span>Mã PIN Cổng Phụ Huynh (Parental Gate)</span>
              </h3>
              <p className="text-xs text-muted-foreground font-semibold mb-4">
                Mã PIN 4–6 số dùng để khóa quyền truy cập khi bé đang học.
              </p>

              {pinMessage && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-3">
                  {pinMessage}
                </div>
              )}

              <form onSubmit={handleSetPin} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="Nhập mã PIN mới (4–6 số)"
                    className="flex-1 px-4 py-2.5 rounded-xl border-2 border-border text-sm font-bold focus:outline-none focus:border-primary"
                  />
                  <Button type="submit" variant="primary" size="sm">
                    Lưu PIN
                  </Button>
                </div>
              </form>
            </div>

            <div className="mt-4 pt-4 border-t border-border/60 text-[11px] text-muted-foreground">
              🔒 Mã PIN được mã hóa một chiều an toàn bằng PBKDF2 server-side.
            </div>
          </Card>

          {/* Child Safety Settings */}
          <Card className="p-6 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-base font-black text-foreground mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span>Cài Đặt An Toàn Dành Cho Trẻ Em</span>
              </h3>
              <div className="flex flex-col gap-2.5 text-xs font-semibold text-muted-foreground">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/50">
                  <span>Hồ sơ ẩn danh (Không lộ danh tính)</span>
                  <Badge variant="success">Bật</Badge>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/50">
                  <span>Chặn tin nhắn & kênh liên lạc công cộng</span>
                  <Badge variant="success">Bảo Vệ</Badge>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/50">
                  <span>Nhắc nghỉ ngơi sau 25 phút học liên tục</span>
                  <Badge variant="primary">25 Phút</Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/60 text-[11px] text-muted-foreground flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chế độ bé học không thể thay đổi các cài đặt này.</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
