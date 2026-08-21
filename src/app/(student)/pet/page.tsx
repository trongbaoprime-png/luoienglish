"use client";

import React, { useState } from "react";
import { PetAvatar } from "@/components/pet/PetAvatar";
import { PetStatsDisplay } from "@/components/pet/PetStatsDisplay";
import { Pet } from "@/types/pet";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Award } from "lucide-react";

export default function PetWorldPage() {
  const [pet, setPet] = useState<Pet>({
    id: "pet_sample_1",
    childId: "child_sample_1",
    name: "Lười Bông",
    stage: "baby",
    stats: {
      happiness: 85,
      energy: 90,
      knowledge: 120,
      bond: 70,
    },
    equippedCosmetics: {},
    lastFedAt: new Date().toISOString(),
    lastInteractedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  const handleFeedPet = () => {
    setPet((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        happiness: Math.min(100, prev.stats.happiness + 5),
        energy: Math.min(100, prev.stats.energy + 10),
        bond: Math.min(100, prev.stats.bond + 3),
      },
    }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <Badge variant="primary" className="mb-1">
            Góc Nuôi Lười
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Phòng Của Chú Lười {pet.name}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <PetAvatar pet={pet} onFeed={handleFeedPet} />

        <div className="flex flex-col gap-4">
          <Card className="bg-white/80">
            <h3 className="text-lg font-black text-foreground mb-1 flex items-center gap-1.5">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Hành Trình Trưởng Thành</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Càng học chăm chỉ, Chú Lười sẽ càng tiến hóa lên các cấp độ thông thái hơn!
            </p>

            <div className="flex items-center justify-between text-xs font-bold bg-muted/40 p-3 rounded-2xl border border-border/60">
              <span>Cấp Hiện Tại: <strong className="text-primary capitalize">{pet.stage}</strong></span>
              <span>Cấp Tiếp Theo: <strong>Young Explorer</strong></span>
            </div>
          </Card>

          <PetStatsDisplay stats={pet.stats} />
        </div>
      </div>
    </div>
  );
}
