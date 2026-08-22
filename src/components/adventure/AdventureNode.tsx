"use client";

import React from "react";
import Link from "next/link";
import { Star, Lock, Sparkles, RefreshCw, Check, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdventureNodeState =
  | "LOCKED"
  | "AVAILABLE"
  | "CURRENT"
  | "COMPLETED"
  | "MASTERED"
  | "REVIEW_DUE";

export interface AdventureNodeProps {
  id: string;
  order: number;
  title: string;
  titleVi: string;
  state: AdventureNodeState;
  starsEarned: number;
  totalStars?: number;
  href: string;
  onClick?: () => void;
  className?: string;
}

export function AdventureNode({
  order,
  title,
  titleVi,
  state,
  starsEarned,
  totalStars = 3,
  href,
  onClick,
  className,
}: AdventureNodeProps) {
  const isLocked = state === "LOCKED";
  const isCurrent = state === "CURRENT";
  const isReviewDue = state === "REVIEW_DUE";
  const isMastered = state === "MASTERED";
  const isCompleted = state === "COMPLETED";

  const renderContent = () => (
    <div
      onClick={isLocked ? undefined : onClick}
      className={cn(
        "relative flex flex-col items-center group select-none transition-all duration-300",
        isLocked ? "cursor-not-allowed opacity-75" : "cursor-pointer active:scale-95",
        className
      )}
    >
      {/* Node Outer Halo & Badge */}
      <div
        className={cn(
          "relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-4 shadow-card transition-transform duration-300",
          isLocked && "bg-slate-200 border-slate-300 text-slate-400 shadow-none",
          state === "AVAILABLE" && "bg-amber-100 border-amber-400 text-amber-900 hover:scale-105",
          isCurrent && "bg-amber-400 border-amber-200 text-amber-950 animate-bounce-gentle shadow-glow",
          isCompleted && "bg-emerald-400 border-emerald-200 text-white hover:scale-105",
          isMastered && "bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 border-yellow-200 text-amber-950 shadow-glow hover:scale-105",
          isReviewDue && "bg-rose-400 border-rose-200 text-white animate-pulse shadow-glow"
        )}
      >
        {/* State Icon Indicator */}
        {isLocked && <Lock className="w-8 h-8 stroke-[2.5]" />}
        {isCurrent && <Sparkles className="w-10 h-10 fill-current animate-spin" style={{ animationDuration: "6s" }} />}
        {state === "AVAILABLE" && <span className="text-2xl font-black">{order}</span>}
        {isCompleted && <Check className="w-10 h-10 stroke-[3]" />}
        {isMastered && <Crown className="w-10 h-10 fill-current drop-shadow-sm" />}
        {isReviewDue && <RefreshCw className="w-9 h-9 stroke-[2.5] animate-spin" style={{ animationDuration: "4s" }} />}

        {/* Stars Earned Overlay */}
        {!isLocked && (
          <div className="absolute -bottom-3 flex items-center gap-0.5 bg-white/95 px-2 py-0.5 rounded-full border-2 border-amber-200 shadow-sm">
            {Array.from({ length: totalStars }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i < starsEarned
                    ? "text-amber-500 fill-amber-400"
                    : "text-slate-300 fill-slate-200"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Node Tooltip / Title Card */}
      <div className="mt-4 text-center max-w-[160px] bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-border/80 shadow-xs">
        <h4 className="text-xs font-black text-foreground truncate">{title}</h4>
        <p className="text-[11px] font-bold text-muted-foreground truncate">{titleVi}</p>
      </div>
    </div>
  );

  if (isLocked) {
    return renderContent();
  }

  return (
    <Link href={href} className="no-underline">
      {renderContent()}
    </Link>
  );
}
