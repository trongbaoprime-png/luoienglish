"use client";

import React from "react";
import { WorldEnvironmentLayer } from "./WorldEnvironmentLayer";
import { AdventureNode, AdventureNodeState } from "./AdventureNode";
import { AdventurePath } from "./AdventurePath";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { Badge } from "@/components/ui/Badge";
import { useTheme } from "@/lib/theme/themeContext";
import { cn } from "@/lib/utils";

export interface AdventureMapNodeData {
  id: string;
  order: number;
  title: string;
  titleVi: string;
  state: AdventureNodeState;
  starsEarned: number;
  totalStars?: number;
  href: string;
  // Percentage coordinate along S-curve
  positionX: number; // e.g. 50 (center), 75 (right), 25 (left)
  positionY: number; // e.g. 100px, 260px, 420px, etc.
}

export interface AdventureMapProps {
  unitTitle?: string;
  unitTitleVi?: string;
  nodes?: AdventureMapNodeData[];
  className?: string;
}

export function AdventureMap({
  unitTitle = "Unit 1: Hello & Friends",
  unitTitleVi = "Chào Hỏi & Làm Quen Bạn Mới",
  nodes,
  className,
}: AdventureMapProps) {
  const { themeId } = useTheme();
  const isCozy = themeId === "cozy";

  const defaultNodes: AdventureMapNodeData[] = [
    {
      id: "lesson_g3_u1_l1",
      order: 1,
      title: "Lesson 1: Hello!",
      titleVi: "Chào hỏi & Phonics /h/",
      state: "COMPLETED",
      starsEarned: 3,
      href: "/learn/lesson_g3_u1_l1",
      positionX: 50,
      positionY: 80,
    },
    {
      id: "lesson_g3_u1_l2",
      order: 2,
      title: "Lesson 2: How are you?",
      titleVi: "Hỏi thăm sức khỏe",
      state: "CURRENT",
      starsEarned: 2,
      href: "/learn/lesson_g3_u1_l1",
      positionX: 75,
      positionY: 240,
    },
    {
      id: "lesson_g3_u1_l3",
      order: 3,
      title: "Lesson 3: Nice to meet you",
      titleVi: "Làm quen bạn mới",
      state: "AVAILABLE",
      starsEarned: 0,
      href: "/learn/lesson_g3_u1_l1",
      positionX: 25,
      positionY: 420,
    },
    {
      id: "challenge_g3_u1",
      order: 4,
      title: "Mini Challenge",
      titleVi: "Thử thách trí nhớ Chú Lười",
      state: "LOCKED",
      starsEarned: 0,
      href: "#",
      positionX: 50,
      positionY: 600,
    },
  ];

  const mapNodes = nodes || defaultNodes;

  return (
    <div className={cn("flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in", className)}>
      {/* Unit Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/90 p-5 rounded-3xl border-2 border-border/60 shadow-sm">
        <div>
          <Badge variant={isCozy ? "primary" : "secondary"} className="mb-1">
            {isCozy ? "🌳 Ngôi Nhà Cây Của Lười" : "🏝️ Đảo Phiêu Lưu Kì Thú"}
          </Badge>
          <h2 className="text-2xl font-black text-foreground">{unitTitle}</h2>
          <p className="text-xs font-bold text-muted-foreground">{unitTitleVi}</p>
        </div>
      </div>

      {/* Main Map Canvas */}
      <WorldEnvironmentLayer className="relative flex flex-col items-center">
        {/* SVG Path Layer */}
        <div className="absolute inset-0 flex justify-center pointer-events-none">
          <AdventurePath className="w-full max-w-[400px] h-full" />
        </div>

        {/* Nodes Layer */}
        <div className="relative w-full max-w-[440px] h-[750px]">
          {mapNodes.map((node) => (
            <div
              key={node.id}
              className="absolute -translate-x-1/2"
              style={{
                left: `${node.positionX}%`,
                top: `${node.positionY}px`,
              }}
            >
              <AdventureNode
                id={node.id}
                order={node.order}
                title={node.title}
                titleVi={node.titleVi}
                state={node.state}
                starsEarned={node.starsEarned}
                href={node.href}
              />
            </div>
          ))}

          {/* Chú Lười Mascot companion positioning at Current Node */}
          <div className="absolute left-[80%] top-[180px] hidden sm:block pointer-events-none">
            <SlothMascot
              pose="hello"
              size="md"
              speechBubbleText="Học tiếp bài này cùng Lười nhé!"
            />
          </div>
        </div>
      </WorldEnvironmentLayer>
    </div>
  );
}
