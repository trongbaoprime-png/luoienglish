"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChildProfileModal } from "@/components/parent/ChildProfileModal";
import { SLOTH_AVATAR_PRESETS } from "@/components/child/AvatarPresetSelector";
import { ChildProfile } from "@/types/student";
import { useAuth } from "@/lib/auth/authContext";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Sparkles,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function ParentChildrenManagementPage() {
  const { getIdToken } = useAuth();
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChildForEdit, setSelectedChildForEdit] = useState<ChildProfile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchChildren = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/children", { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        setChildrenList(data.data || []);
        // Load active child from localStorage if available
        const currentStored = localStorage.getItem("luoi_active_child_id");
        if (currentStored) {
          setActiveChildId(currentStored);
        } else if (data.data?.length > 0) {
          setActiveChildId(data.data[0].id);
          localStorage.setItem("luoi_active_child_id", data.data[0].id);
        }
      } else {
        setError(data.message || "Không thể tải danh sách học sinh.");
      }
    } catch {
      setError("Lỗi kết nối máy chủ khi tải danh sách bé.");
    } finally {
      setIsLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  const handleSelectActiveChild = (child: ChildProfile) => {
    setActiveChildId(child.id);
    localStorage.setItem("luoi_active_child_id", child.id);
    if (child.preferences?.themeId) {
      localStorage.setItem(`luoi_theme_${child.id}`, child.preferences.themeId);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedChildForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (child: ChildProfile) => {
    setSelectedChildForEdit(child);
    setIsModalOpen(true);
  };

  const handleDeleteChild = async (childId: string, name: string) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa hồ sơ học sinh của bé "${name}" không? Toàn bộ tiến độ học của bé sẽ bị xóa.`
    );
    if (!confirmDelete) return;

    setDeletingId(childId);
    try {
      const token = await getIdToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/children/${childId}`, {
        method: "DELETE",
        headers,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // If active child was deleted, clear or fallback active child ID
        if (activeChildId === childId) {
          localStorage.removeItem("luoi_active_child_id");
          localStorage.removeItem(`luoi_theme_${childId}`);
          setActiveChildId(null);
        }
        await fetchChildren();
      } else {
        alert(data.message || "Không thể xóa hồ sơ của bé.");
      }
    } catch {
      alert("Lỗi kết nối khi xóa hồ sơ.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSuccess = (savedChild: ChildProfile) => {
    handleSelectActiveChild(savedChild);
    fetchChildren();
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/parent">
              <Button variant="outline" size="sm" className="gap-1 rounded-2xl">
                <ArrowLeft className="w-4 h-4" />
                <span>Bảng Điều Khiển</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                <span>Quản Lý Hồ Sơ Học Sinh</span>
              </h1>
              <p className="text-xs text-muted-foreground font-semibold">
                Quản lý lộ trình học, khối lớp và bạn đồng hành Chú Lười cho các bé
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddModal}
            disabled={childrenList.length >= 5}
            className="gap-2 rounded-2xl shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Bé Mới ({childrenList.length}/5)</span>
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <Card key={n} className="p-6 bg-white rounded-3xl animate-pulse h-48">
                <div className="w-full h-full" />
              </Card>
            ))}
          </div>
        ) : childrenList.length === 0 ? (
          /* Empty State */
          <Card className="p-10 bg-white rounded-3xl text-center flex flex-col items-center gap-4 shadow-float">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl">
              🦥
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">Chưa có hồ sơ học sinh nào</h3>
              <p className="text-xs text-muted-foreground font-semibold max-w-sm mt-1">
                Hãy thêm thông tin của bé để Chú Lười thiết kế lộ trình học tiếng Anh cá nhân hóa phù hợp nhất!
              </p>
            </div>
            <Button variant="primary" size="md" onClick={handleOpenAddModal} className="gap-2">
              <Plus className="w-4 h-4" />
              <span>Thêm Bé Đầu Tiên</span>
            </Button>
          </Card>
        ) : (
          /* Children Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {childrenList.map((c) => {
              const avatar =
                SLOTH_AVATAR_PRESETS.find((p) => p.key === c.avatarKey) ||
                SLOTH_AVATAR_PRESETS[0]!;
              const isActive = activeChildId === c.id;

              return (
                <Card
                  key={c.id}
                  className={`p-5 rounded-3xl bg-white flex flex-col justify-between transition-all border-2 ${
                    isActive
                      ? "border-primary shadow-float ring-2 ring-primary/20"
                      : "border-border/60 hover:border-border"
                  }`}
                >
                  <div>
                    {/* Top Row: Avatar + Name + Badges */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${avatar.bgGradient} flex items-center justify-center text-3xl shadow-sm`}
                        >
                          {avatar.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-base text-foreground">
                              {c.displayName || c.nickname}
                            </h3>
                            {isActive && (
                              <Badge
                                variant="primary"
                                className="text-[10px] bg-primary text-primary-foreground flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Đang Học</span>
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground font-semibold">
                            {c.schoolGrade === 0 ? "Mầm non" : `Lớp ${c.schoolGrade}`} •{" "}
                            <span className="text-primary font-bold">{c.englishLevel}</span>
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className={`text-[10px] uppercase font-black ${
                          c.preferences?.themeId === "explorer"
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {c.preferences?.themeId === "explorer" ? "Explorer" : "Cozy"}
                      </Badge>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-muted/20 text-center mb-4">
                      <div>
                        <div className="text-[10px] text-muted-foreground font-bold flex items-center justify-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          <span>Chuỗi Học</span>
                        </div>
                        <div className="text-xs font-black text-foreground mt-0.5">
                          {c.streakDays} ngày
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-bold flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3 text-blue-500" />
                          <span>Mục Tiêu</span>
                        </div>
                        <div className="text-xs font-black text-foreground mt-0.5">
                          {c.dailyGoalMinutes}p/ngày
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-bold flex items-center justify-center gap-1">
                          <BookOpen className="w-3 h-3 text-emerald-500" />
                          <span>Tổng Thời Gian</span>
                        </div>
                        <div className="text-xs font-black text-foreground mt-0.5">
                          {c.totalStudyTimeMinutes} phút
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    {!isActive ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectActiveChild(c)}
                        className="text-xs font-bold gap-1 rounded-xl"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Chọn Bé Học</span>
                      </Button>
                    ) : (
                      <Link href="/home">
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-xs font-bold rounded-xl"
                        >
                          Vào Góc Học Tập
                        </Button>
                      </Link>
                    )}

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditModal(c)}
                        className="w-8 h-8 p-0 rounded-xl text-muted-foreground hover:text-foreground"
                        title="Chỉnh sửa hồ sơ"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteChild(c.id, c.displayName || c.nickname)}
                        disabled={deletingId === c.id}
                        className="w-8 h-8 p-0 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                        title="Xóa hồ sơ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <ChildProfileModal
        isOpen={isModalOpen}
        child={selectedChildForEdit}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
