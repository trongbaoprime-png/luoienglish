"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { Star, Lock, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdventureMapPage() {
  const nodes = [
    {
      id: "lesson_g3_u1_l1",
      order: 1,
      title: "Bài 1: What's your name?",
      titleVi: "Hỏi tên và giới thiệu",
      status: "unlocked" as const,
      starsEarned: 3,
      totalStars: 3,
      href: "/learn/lesson_g3_u1_l1",
    },
    {
      id: "lesson_g3_u1_l2",
      order: 2,
      title: "Bài 2: How are you?",
      titleVi: "Hỏi thăm sức khỏe",
      status: "unlocked" as const,
      starsEarned: 2,
      totalStars: 3,
      href: "/learn/lesson_g3_u1_l1",
    },
    {
      id: "lesson_g3_u1_l3",
      order: 3,
      title: "Bài 3: Meet my new friends",
      titleVi: "Giới thiệu bạn bè",
      status: "locked" as const,
      starsEarned: 0,
      totalStars: 3,
      href: "#",
    },
    {
      id: "chest_unit_1",
      order: 4,
      title: "Rương Kho Báu Unit 1",
      titleVi: "Mở khóa 50 Xu + Thức Ăn Chú Lười",
      status: "locked" as const,
      isChest: true,
      starsEarned: 0,
      totalStars: 0,
      href: "#",
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Badge variant="primary" className="mb-1">
            Lớp 3 • Học Kỳ 1
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Bản Đồ Phiêu Lưu — Unit 1: Hello & Friends
          </h2>
        </div>
      </div>

      {/* Map Canvas Card */}
      <Card className="relative min-h-[480px] p-6 sm:p-10 bg-gradient-to-b from-sky-100/50 via-amber-50/40 to-emerald-100/40 border-3 border-border flex flex-col items-center justify-between overflow-hidden">
        {/* Floating Mascot guide */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
          <SlothMascot
            pose="encourage"
            size="md"
            speechBubbleText="Chinh phục từng trạm để mở rương báu nhé!"
          />
        </div>

        {/* Quest Nodes Path */}
        <div className="w-full max-w-md flex flex-col items-center gap-8 my-auto z-10">
          {nodes.map((node, index) => {
            const isUnlocked = node.status === "unlocked";

            return (
              <div key={node.id} className="relative flex flex-col items-center group">
                {/* Connecting Path Line */}
                {index > 0 && (
                  <div
                    className={cn(
                      "absolute -top-8 w-1.5 h-8 rounded-full",
                      isUnlocked ? "bg-primary" : "bg-border"
                    )}
                  />
                )}

                {node.isChest ? (
                  <div
                    className={cn(
                      "w-20 h-20 rounded-3xl border-4 flex items-center justify-center shadow-float cursor-pointer transition-transform hover:scale-105",
                      isUnlocked
                        ? "bg-amber-400 border-amber-600 text-amber-950 animate-bounce"
                        : "bg-slate-200 border-slate-300 text-slate-400"
                    )}
                  >
                    <Gift className="w-10 h-10" />
                  </div>
                ) : (
                  <Link href={node.href}>
                    <div
                      className={cn(
                        "w-20 h-20 rounded-full border-4 flex items-center justify-center shadow-button transition-all cursor-pointer",
                        isUnlocked
                          ? "bg-primary border-primary-hover text-primary-foreground hover:scale-110 active:translate-y-1"
                          : "bg-slate-200 border-slate-300 text-slate-400 pointer-events-none"
                      )}
                    >
                      {isUnlocked ? (
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-black">{node.order}</span>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[...Array(node.totalStars)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3 h-3",
                                  i < node.starsEarned
                                    ? "text-amber-300 fill-amber-300"
                                    : "text-white/40"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Lock className="w-7 h-7" />
                      )}
                    </div>
                  </Link>
                )}

                {/* Node Label Card */}
                <div className="mt-2 text-center bg-white/90 px-3 py-1.5 rounded-xl border border-border/80 shadow-sm">
                  <h4 className="text-xs font-bold text-foreground">{node.title}</h4>
                  <span className="text-[10px] text-muted-foreground">{node.titleVi}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
