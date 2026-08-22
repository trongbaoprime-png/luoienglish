"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PetHome } from "@/components/pet/PetHome";
import { PetProfile, PetReaction, PetInteractionType } from "@/types/pet";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UserCheck, AlertCircle, Loader2 } from "lucide-react";

export default function PetWorldPage() {
  const [pet, setPet] = useState<PetProfile | null>(null);
  const [foodBalance, setFoodBalance] = useState<number>(0);
  const [childId, setChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const activeChild = localStorage.getItem("luoi_active_child_id");
    if (!activeChild) {
      setLoading(false);
      return;
    }

    setChildId(activeChild);

    fetch(`/api/pet?childId=${encodeURIComponent(activeChild)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Không thể tải dữ liệu Chú Lười");
        }
        return res.json();
      })
      .then((data) => {
        if (data.pet) {
          setPet(data.pet);
          setFoodBalance(data.petFoodBalance || 0);
        }
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleFeed = async (idempotencyKey: string) => {
    if (!childId) throw new Error("Chưa chọn học sinh");

    const res = await fetch("/api/pet/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, foodAmount: 1, idempotencyKey }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to feed pet");
    }

    const data = await res.json();
    return {
      pet: data.pet as PetProfile,
      reaction: data.reaction as PetReaction,
      foodRemaining: data.foodRemaining as number,
    };
  };

  const handleInteract = async (type: PetInteractionType) => {
    if (!childId) throw new Error("Chưa chọn học sinh");

    const res = await fetch("/api/pet/interact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId,
        interactionType: type,
        idempotencyKey: `int_${childId}_${Date.now()}_${Math.random()}`,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to interact with pet");
    }

    const data = await res.json();
    return {
      pet: data.pet as PetProfile,
      reaction: data.reaction as PetReaction,
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-bold text-muted-foreground">Đang đánh thức Chú Lười...</p>
      </div>
    );
  }

  if (!childId) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-12 bg-white/90 shadow-card border-2">
        <UserCheck className="w-12 h-12 text-primary mb-3 stroke-[2.5]" />
        <h3 className="text-xl font-black text-foreground mb-2">Vui lòng chọn hồ sơ bé</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Bạn cần chọn hồ sơ bé đang học để Chú Lười đồng hành và cùng tiến bộ nhé!
        </p>
        <Link href="/parent/children">
          <Button variant="primary" size="lg" className="font-black px-6">
            Chọn Hồ Sơ Học Sinh
          </Button>
        </Link>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-12 bg-white/90 border-rose-200 shadow-card">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h3 className="text-lg font-black text-foreground mb-2">Không thể truy cập Chú Lười</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Thử Lại
        </Button>
      </Card>
    );
  }

  if (!pet) {
    return null;
  }

  return (
    <PetHome
      initialPet={pet}
      initialFoodBalance={foodBalance}
      onFeed={handleFeed}
      onInteract={handleInteract}
    />
  );
}
