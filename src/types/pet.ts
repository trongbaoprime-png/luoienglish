/**
 * Chú Lười Pet Companion Types & Domain Contracts
 * Server-authoritative companion system for LƯỜI ENGLISH.
 */

export type GrowthStage = "baby" | "young" | "adventurer" | "explorer" | "wise_sloth";

/**
 * Backward compatibility alias for legacy types
 */
export type PetStage = GrowthStage | "egg" | "advanced" | "legendary";

export interface PetStats {
  hunger: number;     // 0 to 100 (Safe lower bound: 20, never starves or dies)
  happiness: number;  // 0 to 100
  energy: number;     // 0 to 100 (Drives visual state: ACTIVE, RELAXED, SLEEPY; never blocks learning)
  bond: number;       // 0 to 100 (Builds through learning milestones & caring)
  knowledge?: number; // Optional legacy stat
}

export interface PetCosmetics {
  hat?: string;
  glasses?: string;
  outfit?: string;
  accessory?: string;
}

export interface PetProfile {
  id: string;
  childId: string;
  name: string;
  species: "sloth";
  visualVariant: "default" | "explorer" | "cozy" | string;
  level: number;
  xp: number;
  stats: PetStats;
  growthStage: GrowthStage;
  equippedCosmetics: PetCosmetics;
  discoveredAnimations: string[];
  version: number;
  lastFedAt: string;
  lastInteractedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Backward compatibility alias
 */
export type Pet = PetProfile & { stage: PetStage };

export type PetInteractionType =
  | "FEED"
  | "PET"
  | "PLAY_SHORT"
  | "REST"
  | "WAKE"
  | "CELEBRATE_LEARNING"
  | "CELEBRATE_LEVEL_UP"
  | "CELEBRATE_MASTERY"
  | "ENCOURAGE_AFTER_MISTAKE"
  | "WELCOME_BACK";

export type PetEmotion =
  | "HAPPY"
  | "PROUD"
  | "EXCITED"
  | "CURIOUS"
  | "SLEEPY"
  | "THINKING"
  | "ENCOURAGING"
  | "CELEBRATING"
  | "SURPRISED";

export interface PetReaction {
  emotion: PetEmotion;
  animation: string;
  soundEvent: string;
  messageKey: string;
  speechTextVi: string;
  speechTextEn: string;
  intensity: "low" | "medium" | "high";
}

export interface PetInteractionTransaction {
  id: string;
  childId: string;
  petId: string;
  interactionType: PetInteractionType;
  petFoodDelta: number;
  beforeVersion: number;
  afterVersion: number;
  idempotencyKey: string;
  createdAt: string;
}

export interface FeedPetResult {
  pet: PetProfile;
  reaction: PetReaction;
  foodRemaining: number;
  isNew: boolean;
}

export interface PetInteractionResult {
  pet: PetProfile;
  reaction: PetReaction;
  isNew: boolean;
  happinessGain?: number;
  bondGain?: number;
  messageVi?: string;
}
