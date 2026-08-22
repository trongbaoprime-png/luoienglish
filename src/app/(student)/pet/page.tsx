"use client";

import React, { useEffect, useState } from "react";
import { PetHome } from "@/components/pet/PetHome";
import { PetProfile, PetReaction, PetInteractionType } from "@/types/pet";

export default function PetWorldPage() {
  const [pet, setPet] = useState<PetProfile | null>(null);
  const [foodBalance, setFoodBalance] = useState<number>(3);
  const [childId, setChildId] = useState<string>("child_sample_1");

  useEffect(() => {
    // In production, resolves active child from session/context
    const activeChild = localStorage.getItem("luoi_active_child_id") || "child_sample_1";
    setChildId(activeChild);

    fetch(`/api/pet?childId=${activeChild}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.pet) {
          setPet(data.pet);
          setFoodBalance(data.petFoodBalance || 0);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch live pet, using default state:", err);
      });
  }, []);

  const handleFeed = async (idempotencyKey: string) => {
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

  const defaultPet: PetProfile = {
    id: `pet_${childId}`,
    childId,
    name: "Chú Lười",
    species: "sloth",
    visualVariant: "cozy",
    level: 1,
    xp: 120,
    stats: {
      hunger: 75,
      happiness: 85,
      energy: 90,
      bond: 65,
    },
    growthStage: "baby",
    equippedCosmetics: {
      hat: "cozy_knit_cap",
    },
    discoveredAnimations: ["IDLE_BREATHE", "EAT", "HAPPY_BOUNCE", "CLAP", "WAVE"],
    version: 1,
    lastFedAt: new Date().toISOString(),
    lastInteractedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <PetHome
      initialPet={pet || defaultPet}
      initialFoodBalance={foodBalance}
      onFeed={handleFeed}
      onInteract={handleInteract}
    />
  );
}
