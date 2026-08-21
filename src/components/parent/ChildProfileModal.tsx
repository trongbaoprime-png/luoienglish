"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AvatarPresetSelector } from "@/components/child/AvatarPresetSelector";
import { ChildProfile, EnglishLevel, SchoolGrade } from "@/types/student";
import { ThemeId } from "@/types/theme";
import { X, Sparkles, AlertTriangle, UserCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";

interface ChildProfileModalProps {
  isOpen: boolean;
  child?: ChildProfile | null;
  onClose: () => void;
  onSuccess: (savedChild: ChildProfile) => void;
}

export function ChildProfileModal({
  isOpen,
  child,
  onClose,
  onSuccess,
}: ChildProfileModalProps) {
  const { getIdToken } = useAuth();
  const isEditing = !!child;

  const [nickname, setNickname] = useState(child?.nickname || "");
  const [avatarKey, setAvatarKey] = useState(child?.avatarKey || "avatar_sloth_cozy");
  const [schoolGrade, setSchoolGrade] = useState<SchoolGrade>(child?.schoolGrade ?? 1);
  const [englishLevel, setEnglishLevel] = useState<EnglishLevel>(child?.englishLevel ?? "A1");
  const [themeId, setThemeId] = useState<ThemeId>(child?.preferences?.themeId ?? "cozy");
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(child?.dailyGoalMinutes ?? 15);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || nickname.trim().length < 2) {
      setError("Tên của bé phải từ 2 ký tự trở lên.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getIdToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const payload = {
        nickname: nickname.trim(),
        displayName: nickname.trim(),
        avatarKey,
        schoolGrade: Number(schoolGrade),
        englishLevel,
        preferences: { themeId },
        dailyGoalMinutes: Number(dailyGoalMinutes),
      };

      const url = isEditing ? `/api/children/${child.id}` : "/api/children";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess(data.data);
        onClose();
      } else {
        setError(data.message || "Không thể lưu thông tin của bé.");
      }
    } catch {
      setError("Lỗi kết nối đến máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <Card className="w-full max-w-lg bg-white p-6 rounded-3xl shadow-float relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted/40 hover:bg-muted flex items-center justify-center text-muted-foreground transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground">
              {isEditing ? "Chỉnh Sửa Hồ Sơ Của Bé" : "Thêm Hồ Sơ Học Sinh Mới"}
            </h2>
            <p className="text-xs text-muted-foreground font-semibold">
              Cá nhân hóa lộ trình học tiếng Anh cho từng bé
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar Preset */}
          <div>
            <label className="text-xs font-bold text-foreground mb-1.5 block">
              Chọn Bạn Đồng Hành Chú Lười
            </label>
            <AvatarPresetSelector selectedKey={avatarKey} onSelect={setAvatarKey} />
          </div>

          {/* Nickname */}
          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">
              Tên / Biệt danh của bé <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ví dụ: Bé Bơ, Bảo Nhi, Tí Hon..."
              maxLength={30}
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-border text-sm font-bold focus:outline-none focus:border-primary"
            />
            <span className="text-[10px] text-muted-foreground mt-0.5 block">
              Không cần nhập họ tên đầy đủ để bảo vệ quyền riêng tư của bé.
            </span>
          </div>

          {/* Grade & English Level Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">
                Khối Lớp Hiện Tại
              </label>
              <select
                value={schoolGrade}
                onChange={(e) => setSchoolGrade(Number(e.target.value) as SchoolGrade)}
                className="w-full px-3 py-2.5 rounded-2xl border-2 border-border text-xs font-bold bg-white focus:outline-none focus:border-primary"
              >
                <option value={0}>Mầm non (3–5 tuổi)</option>
                <option value={1}>Lớp 1 (6 tuổi)</option>
                <option value={2}>Lớp 2 (7 tuổi)</option>
                <option value={3}>Lớp 3 (8 tuổi)</option>
                <option value={4}>Lớp 4 (9 tuổi)</option>
                <option value={5}>Lớp 5 (10 tuổi)</option>
                <option value={6}>Lớp 6 (11 tuổi)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">
                Trình Độ Tiếng Anh
              </label>
              <select
                value={englishLevel}
                onChange={(e) => setEnglishLevel(e.target.value as EnglishLevel)}
                className="w-full px-3 py-2.5 rounded-2xl border-2 border-border text-xs font-bold bg-white focus:outline-none focus:border-primary"
              >
                <option value="Pre-A1">Mới bắt đầu (Pre-A1)</option>
                <option value="A1">Cơ bản (A1 - Starter)</option>
                <option value="A1+">Tự tin (A1+ - Mover)</option>
                <option value="A2">Nâng cao (A2 - Flyer)</option>
                <option value="B1">Thành thạo (B1)</option>
              </select>
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="text-xs font-bold text-foreground mb-1.5 block">
              Giao Diện Yêu Thích Của Bé
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setThemeId("cozy")}
                className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                  themeId === "cozy"
                    ? "border-amber-500 bg-amber-500/10 shadow-sm"
                    : "border-border/60 hover:border-border"
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-foreground">Cozy Sloth</div>
                  <div className="text-[10px] text-muted-foreground font-semibold">
                    Tone ấm áp, dễ thương
                  </div>
                </div>
                <Badge variant="primary" className="text-[10px] bg-amber-500 text-white">
                  Cam Ấm
                </Badge>
              </button>

              <button
                type="button"
                onClick={() => setThemeId("explorer")}
                className={`p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                  themeId === "explorer"
                    ? "border-indigo-500 bg-indigo-500/10 shadow-sm"
                    : "border-border/60 hover:border-border"
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-foreground">Explorer Sloth</div>
                  <div className="text-[10px] text-muted-foreground font-semibold">
                    Tone xanh thám hiểm
                  </div>
                </div>
                <Badge variant="primary" className="text-[10px] bg-indigo-600 text-white">
                  Xanh Dương
                </Badge>
              </button>
            </div>
          </div>

          {/* Daily Goal */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-foreground">
                Mục Tiêu Học Hằng Ngày
              </label>
              <span className="text-xs font-black text-primary">
                {dailyGoalMinutes} phút/ngày
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={dailyGoalMinutes}
              onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-2 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isLoading ? "Đang lưu..." : isEditing ? "Lưu Thay Đổi" : "Tạo Hồ Sơ"}</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
