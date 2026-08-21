/**
 * Chú Lười Pet Companion Types
 */

export type PetStage = "egg" | "baby" | "young" | "advanced" | "legendary";

export interface PetStats {
  happiness: number; // 0 to 100
  energy: number;    // 0 to 100
  knowledge: number; // 0 to 1000
  bond: number;      // 0 to 100
}

export interface Pet {
  id: string;
  childId: string;
  name: string;
  stage: PetStage;
  stats: PetStats;
  equippedCosmetics: {
    hat?: string;
    glasses?: string;
    outfit?: string;
    accessory?: string;
  };
  lastFedAt: string;
  lastInteractedAt: string;
  createdAt: string;
}

export interface PetInteractionResult {
  pet: Pet;
  happinessGain: number;
  bondGain: number;
  messageVi: string;
}
