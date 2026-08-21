"use client";

import React from "react";
import { useTheme } from "@/lib/theme/themeContext";
import { MascotPose } from "@/types/assets";
import { cn } from "@/lib/utils";

export interface SlothMascotProps {
  pose?: MascotPose;
  size?: "sm" | "md" | "lg" | "xl";
  speechBubbleText?: string;
  className?: string;
  animate?: boolean;
}

export function SlothMascot({
  pose = "idle",
  size = "md",
  speechBubbleText,
  className,
  animate = true,
}: SlothMascotProps) {
  const { themeId } = useTheme();

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
  };

  const isCozy = themeId === "cozy";

  return (
    <div className={cn("relative inline-flex flex-col items-center select-none", className)}>
      {/* Optional Speech Bubble */}
      {speechBubbleText && (
        <div className="relative mb-3 max-w-xs bg-white text-foreground px-4 py-2.5 rounded-2xl border-2 border-border shadow-card text-center animate-bounce-gentle">
          <p className="text-sm font-bold leading-snug">{speechBubbleText}</p>
          {/* Speech Bubble Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-border rotate-45" />
        </div>
      )}

      {/* Chú Lười Vector Character Container */}
      <div
        className={cn(
          "relative flex items-center justify-center transition-transform duration-300",
          sizeClasses[size],
          animate && "hover:scale-105"
        )}
      >
        {/* Render Vector Sloth (Chú Lười) */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className={animate ? "animate-pulse" : ""} style={{ animationDuration: "3s" }}>
            {/* Sloth Body */}
            <ellipse
              cx="100"
              cy="125"
              rx="60"
              ry="55"
              fill={isCozy ? "#D97706" : "#0284C7"} // Warm caramel for Cozy, Ocean blue for Explorer
            />

            {/* Sloth Belly */}
            <ellipse
              cx="100"
              cy="135"
              rx="40"
              ry="38"
              fill={isCozy ? "#FEF3C7" : "#E0F2FE"}
            />

            {/* Sloth Head */}
            <circle
              cx="100"
              cy="70"
              r="48"
              fill={isCozy ? "#D97706" : "#0284C7"}
            />

            {/* Cream Face Mask */}
            <ellipse
              cx="100"
              cy="75"
              rx="38"
              ry="30"
              fill="#FFFBEB"
            />

            {/* Sloth Eye Patches */}
            <ellipse
              cx="82"
              cy="72"
              rx="12"
              ry="8"
              transform="rotate(-15 82 72)"
              fill="#78350F"
            />
            <ellipse
              cx="118"
              cy="72"
              rx="12"
              ry="8"
              transform="rotate(15 118 72)"
              fill="#78350F"
            />

            {/* Friendly Sparkly Eyes */}
            <circle cx="83" cy="72" r="4.5" fill="#FFFFFF" />
            <circle cx="84" cy="72" r="3" fill="#1E293B" />
            <circle cx="85" cy="71" r="1" fill="#FFFFFF" />

            <circle cx="117" cy="72" r="4.5" fill="#FFFFFF" />
            <circle cx="116" cy="72" r="3" fill="#1E293B" />
            <circle cx="115" cy="71" r="1" fill="#FFFFFF" />

            {/* Sloth Nose */}
            <ellipse cx="100" cy="80" rx="6" ry="4.5" fill="#451A03" />

            {/* Sloth Smile */}
            <path
              d="M 92 88 Q 100 96 108 88"
              stroke="#451A03"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="transparent"
            />

            {/* Theme Accessories */}
            {isCozy ? (
              // Cozy Theme: Soft Knit Scarf
              <g>
                <path
                  d="M 70 98 Q 100 112 130 98 Q 100 120 70 98"
                  fill="#10B981"
                />
                <rect x="110" y="105" width="16" height="32" rx="4" fill="#10B981" />
              </g>
            ) : (
              // Explorer Theme: Explorer Hat / Goggles
              <g>
                <ellipse cx="100" cy="35" rx="35" ry="12" fill="#EAB308" />
                <rect x="75" y="20" width="50" height="20" rx="8" fill="#CA8A04" />
                {/* Goggles */}
                <circle cx="85" cy="40" r="10" fill="#BAE6FD" stroke="#0F172A" strokeWidth="2.5" />
                <circle cx="115" cy="40" r="10" fill="#BAE6FD" stroke="#0F172A" strokeWidth="2.5" />
                <line x1="95" y1="40" x2="105" y2="40" stroke="#0F172A" strokeWidth="3" />
              </g>
            )}

            {/* Sloth Paws (Pose: Hello / Waving if pose == 'hello') */}
            {pose === "hello" ? (
              <g>
                {/* Left Paw Resting */}
                <ellipse cx="50" cy="130" rx="14" ry="10" fill={isCozy ? "#B45309" : "#0369A1"} />
                {/* Right Paw Waving */}
                <g className="animate-bounce" style={{ animationDuration: "1.2s" }}>
                  <ellipse cx="155" cy="65" rx="14" ry="12" transform="rotate(25 155 65)" fill={isCozy ? "#B45309" : "#0369A1"} />
                  {/* Soft Claws */}
                  <circle cx="163" cy="56" r="2.5" fill="#FFFBEB" />
                  <circle cx="167" cy="61" r="2.5" fill="#FFFBEB" />
                  <circle cx="168" cy="67" r="2.5" fill="#FFFBEB" />
                </g>
              </g>
            ) : (
              // Default Resting Paws
              <g>
                <ellipse cx="52" cy="130" rx="14" ry="10" fill={isCozy ? "#B45309" : "#0369A1"} />
                <ellipse cx="148" cy="130" rx="14" ry="10" fill={isCozy ? "#B45309" : "#0369A1"} />
              </g>
            )}
          </g>
        </svg>
      </div>
    </div>
  );
}
