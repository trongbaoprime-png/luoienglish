"use client";

import React from "react";

export interface AdventurePathProps {
  className?: string;
}

export function AdventurePath({ className }: AdventurePathProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Shadow Trail */}
      <path
        d="M 200 60 Q 320 200 200 320 T 200 580 T 200 740"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />

      {/* Main Wooden / Stepping Stones Trail */}
      <path
        d="M 200 60 Q 320 200 200 320 T 200 580 T 200 740"
        stroke="#FDE68A"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />

      {/* Glowing Golden Center Trail */}
      <path
        d="M 200 60 Q 320 200 200 320 T 200 580 T 200 740"
        stroke="#F59E0B"
        strokeWidth="6"
        strokeDasharray="12 12"
        strokeLinecap="round"
        fill="none"
        className="animate-pulse"
      />
    </svg>
  );
}
