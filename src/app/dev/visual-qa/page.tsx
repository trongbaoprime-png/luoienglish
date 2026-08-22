"use client";

import React, { useState } from "react";
import { SlothMascot } from "@/components/mascot/SlothMascot";
import { AdventureNode } from "@/components/adventure/AdventureNode";
import { RewardCelebrationLayer, CelebrationIntensity } from "@/components/learning/RewardCelebrationLayer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/lib/theme/themeContext";
import { MascotPose } from "@/types/assets";

export default function DevVisualQAPage() {
  const { themeId, toggleTheme } = useTheme();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeCelebration, setActiveCelebration] = useState<CelebrationIntensity | null>(null);

  const mascotPoses: MascotPose[] = [
    "idle",
    "hello",
    "happy",
    "thinking",
    "listening",
    "speaking",
    "reading",
    "writing",
    "encourage",
    "eating",
    "sleeping",
    "celebrating",
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-8">
      {/* Celebration Layer Simulation */}
      {activeCelebration && (
        <RewardCelebrationLayer
          intensity={activeCelebration}
          starsEarned={activeCelebration === "EPIC" ? 3 : 1}
          xpEarned={activeCelebration === "EPIC" ? 50 : 15}
          petFoodEarned={activeCelebration === "EPIC" ? 2 : 1}
          onComplete={() => setActiveCelebration(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-1">Development QA Matrix</Badge>
          <h1 className="text-2xl font-black text-foreground">Visual QA Matrix (/dev/visual-qa)</h1>
          <p className="text-xs text-muted-foreground">
            Bảng ma trận kiểm thử trực quan toàn diện: Tất cả các trạng thái Chú Lười, Nút Bản đồ, Hiệu ứng phần thưởng, Dual-Theme.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleTheme()}
          >
            Chuyển Theme: <strong className="ml-1 capitalize">{themeId}</strong>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setReducedMotion(!reducedMotion)}
          >
            Reduced Motion: <strong className="ml-1">{reducedMotion ? "ON" : "OFF"}</strong>
          </Button>
        </div>
      </div>

      {/* 1. Mascot Poses Matrix */}
      <div>
        <h3 className="text-lg font-black text-foreground mb-3">1. Bộ Nhân Vật Chú Lười V1 (Mascot Poses)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mascotPoses.map((pose) => (
            <Card key={pose} className="p-4 flex flex-col items-center gap-2 bg-white/95 border-2">
              <SlothMascot pose={pose} size="md" animate={!reducedMotion} />
              <span className="text-xs font-black capitalize text-foreground">{pose}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. Adventure Map Nodes Matrix */}
      <div>
        <h3 className="text-lg font-black text-foreground mb-3">2. Trạng Thái Nút Bản Đồ (6 Node States)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <AdventureNode id="n1" order={1} title="Bài 1" titleVi="Khởi động" state="COMPLETED" starsEarned={3} href="#" />
          <AdventureNode id="n2" order={2} title="Bài 2" titleVi="Đang học" state="CURRENT" starsEarned={2} href="#" />
          <AdventureNode id="n3" order={3} title="Bài 3" titleVi="Sẵn sàng" state="AVAILABLE" starsEarned={0} href="#" />
          <AdventureNode id="n4" order={4} title="Bài 4" titleVi="Xuất sắc" state="MASTERED" starsEarned={3} href="#" />
          <AdventureNode id="n5" order={5} title="Bài 5" titleVi="Cần ôn lại" state="REVIEW_DUE" starsEarned={1} href="#" />
          <AdventureNode id="n6" order={6} title="Bài 6" titleVi="Chưa mở" state="LOCKED" starsEarned={0} href="#" />
        </div>
      </div>

      {/* 3. Reward Celebration FX Testing */}
      <div>
        <h3 className="text-lg font-black text-foreground mb-3">3. Hiệu Ứng Phần Thưởng & Ăn Mừng (FX Tiers)</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={() => setActiveCelebration("SMALL")}>
            Kích hoạt: SMALL FX (Single Star)
          </Button>
          <Button variant="secondary" onClick={() => setActiveCelebration("MEDIUM")}>
            Kích hoạt: MEDIUM FX (Star Burst)
          </Button>
          <Button variant="outline" onClick={() => setActiveCelebration("BIG")}>
            Kích hoạt: BIG FX (Pet Celebration)
          </Button>
          <Button variant="reward" onClick={() => setActiveCelebration("EPIC")}>
            Kích hoạt: EPIC FX (Unit Mastered)
          </Button>
        </div>
      </div>

      {/* 4. Button & UI Variant Matrix */}
      <div>
        <h3 className="text-lg font-black text-foreground mb-3">4. Hệ Thống Nút Bấm & Thẻ UI</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="reward">Reward Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button disabled>Disabled Button</Button>
        </div>
      </div>
    </div>
  );
}
