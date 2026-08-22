"use client";

import React, { useEffect, useState } from "react";
import { AchievementDefinition } from "@/types/achievement";

interface AchievementToastProps {
  achievement: AchievementDefinition;
  onDismiss?: () => void;
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
      <div className="flex items-center gap-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-white p-4 rounded-3xl shadow-2xl border-2 border-white/50 max-w-sm">
        <div className="text-3xl bg-white/20 p-2 rounded-2xl">🏆</div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-yellow-100">
            Thành Tích Mới!
          </div>
          <div className="text-sm font-black">{achievement.titleVi}</div>
          <div className="text-xs text-yellow-50">{achievement.descriptionVi}</div>
        </div>
      </div>
    </div>
  );
}
