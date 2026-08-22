"use client";

import React from "react";
import { LevelPolicy } from "@/domain/rewards/LevelPolicy";

interface XpProgressProps {
  totalXp: number;
  className?: string;
}

export function XpProgress({ totalXp, className = "" }: XpProgressProps) {
  const levelInfo = LevelPolicy.calculateLevel(totalXp);

  return (
    <div className={`flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-white font-black text-xs shadow-inner">
        {levelInfo.level}
      </div>

      <div className="flex-1 min-w-[100px]">
        <div className="flex justify-between items-center text-[10px] font-bold text-amber-900 mb-1">
          <span>Cấp {levelInfo.level}</span>
          <span>
            {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP
          </span>
        </div>
        <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-yellow-400 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
