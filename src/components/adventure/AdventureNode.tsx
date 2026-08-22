"use client";

import React from "react";
import Link from "next/link";
import { SoundPlaybackService } from "@/lib/audio/SoundPlaybackService";
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

  const nodeIconState =
    isLocked ? "locked" : isCurrent ? "current" : isCompleted ? "completed" : isMastered ? "mastered" : isReviewDue ? "review_due" : "available";

  const handleClick = () => {
    if (isLocked) {
      SoundPlaybackService.playSound("ui.locked");
    } else {
      SoundPlaybackService.playSound("ui.mapNode");
      if (onClick) onClick();
    }
  };

  const renderContent = () => (
    <div
      onClick={handleClick}
      className={cn(
        "relative flex flex-col items-center group select-none transition-all duration-300",
        isLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer active:scale-95",
        className
      )}
    >
      {/* Node Vector Ring */}
      <div
        className={cn(
          "relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-card transition-transform duration-300",
          !isLocked && "hover:scale-105",
          isCurrent && "animate-bounce-gentle shadow-glow"
        )}
      >
        <img
          src={`/assets/nodes/node_${nodeIconState}.svg`}
          alt={`Node ${title} (${state})`}
          className="w-full h-full object-contain drop-shadow-sm"
        />

        {/* Available node number label */}
        {state === "AVAILABLE" && (
          <span className="absolute text-xl sm:text-2xl font-black text-amber-950 pointer-events-none">
            {order}
          </span>
        )}

        {/* Stars Earned Overlay */}
        {!isLocked && (
          <div className="absolute -bottom-3 flex items-center gap-1 bg-white/95 px-2.5 py-0.5 rounded-full border-2 border-amber-200 shadow-sm">
            {Array.from({ length: totalStars }).map((_, i) => (
              <img
                key={i}
                src="/assets/rewards/star.svg"
                alt="Star"
                className={cn(
                  "w-3.5 h-3.5 object-contain",
                  i < starsEarned ? "opacity-100" : "opacity-30 grayscale"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Node Title Card */}
      <div className="mt-4 text-center max-w-[160px] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-border/80 shadow-xs">
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
