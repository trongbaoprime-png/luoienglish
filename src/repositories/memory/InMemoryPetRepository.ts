import {
  FeedPetResult,
  PetInteractionResult,
  PetInteractionTransaction,
  PetProfile,
} from "@/types/pet";
import {
  IPetRepository,
  RecordFeedParams,
  RecordInteractionParams,
} from "../interfaces/IPetRepository";
import { RepositoryFactory } from "../RepositoryFactory";
import { HungerPolicy } from "@/domain/pet/HungerPolicy";
import { BondPolicy } from "@/domain/pet/BondPolicy";
import { GrowthPolicy } from "@/domain/pet/GrowthPolicy";
import { PetReactionEngine } from "@/domain/pet/PetReactionEngine";

export class InMemoryPetRepository implements IPetRepository {
  private pets: Map<string, PetProfile> = new Map([
    [
      "child_sample_1",
      {
        id: "pet_sample_1",
        childId: "child_sample_1",
        name: "Lười Bông",
        species: "sloth",
        visualVariant: "cozy",
        level: 1,
        xp: 120,
        stats: {
          hunger: 80,
          happiness: 85,
          energy: 90,
          bond: 70,
          knowledge: 120,
        },
        growthStage: "baby",
        equippedCosmetics: {
          hat: "cozy_knit_cap",
        },
        discoveredAnimations: ["IDLE_BREATHE", "EAT", "HAPPY_BOUNCE"],
        version: 1,
        lastFedAt: new Date().toISOString(),
        lastInteractedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  private interactions: Map<string, PetInteractionTransaction> = new Map();
  private childLocks: Map<string, Promise<unknown>> = new Map();

  // Failure hook for testing
  public failureHook?: (stage: "BEFORE_FEED_COMMIT" | "BEFORE_INTERACTION_COMMIT") => void;

  public async findByChildId(childId: string): Promise<PetProfile | null> {
    const p = this.pets.get(childId);
    return p ? { ...p, stats: { ...p.stats }, equippedCosmetics: { ...p.equippedCosmetics } } : null;
  }

  public async create(pet: PetProfile): Promise<PetProfile> {
    this.pets.set(pet.childId, { ...pet });
    return { ...pet };
  }

  public async update(id: string, updates: Partial<PetProfile>): Promise<PetProfile> {
    for (const [childId, pet] of this.pets.entries()) {
      if (pet.id === id || pet.childId === id || childId === id || `pet_${childId}` === id) {
        const updated: PetProfile = {
          ...pet,
          ...updates,
          stats: { ...pet.stats, ...(updates.stats || {}) },
          version: pet.version + 1,
          updatedAt: new Date().toISOString(),
        };
        this.pets.set(childId, updated);
        return { ...updated };
      }
    }
    // Auto-create if updating a non-existent pet profile
    const childId = id.startsWith("pet_") ? id.replace("pet_", "") : id;
    const newPet: PetProfile = {
      id: `pet_${childId}`,
      childId,
      name: "Chú Lười",
      species: "sloth",
      visualVariant: "default",
      level: 1,
      xp: 0,
      stats: { hunger: 60, happiness: 75, energy: 85, bond: 15, ...(updates.stats || {}) },
      growthStage: "baby",
      equippedCosmetics: {},
      discoveredAnimations: ["IDLE_BREATHE", "EAT", "HAPPY_BOUNCE", "CLAP", "WAVE"],
      version: 1,
      lastFedAt: new Date().toISOString(),
      lastInteractedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...updates,
    };
    this.pets.set(childId, newPet);
    return { ...newPet };
  }

  public async getInteraction(idempotencyKey: string): Promise<PetInteractionTransaction | null> {
    const tx = this.interactions.get(idempotencyKey);
    return tx ? { ...tx } : null;
  }

  /**
   * Atomically deducts PetFood from RewardBalance, updates PetProfile stats & growth,
   * and records PetInteractionTransaction inside a serialized lock boundary.
   */
  public async recordFeedTransaction(params: RecordFeedParams): Promise<FeedPetResult> {
    const { childId, foodAmount, idempotencyKey } = params;
    const lockKey = childId;
    const prevLock = this.childLocks.get(lockKey) || Promise.resolve();
    let releaseLock: () => void;
    const currentLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    this.childLocks.set(
      lockKey,
      prevLock.then(() => currentLock)
    );

    await prevLock;

    try {
      // 1. Check idempotency
      const existingTx = this.interactions.get(idempotencyKey);
      let pet = this.pets.get(childId);
      if (!pet) {
        pet = {
          id: `pet_${childId}`,
          childId,
          name: "Chú Lười",
          species: "sloth",
          visualVariant: "default",
          level: 1,
          xp: 0,
          stats: { hunger: 50, happiness: 70, energy: 80, bond: 10 },
          growthStage: "baby",
          equippedCosmetics: {},
          discoveredAnimations: ["IDLE_BREATHE", "EAT", "HAPPY_BOUNCE"],
          version: 1,
          lastFedAt: new Date().toISOString(),
          lastInteractedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.pets.set(childId, pet);
      }

      const rewardRepo = RepositoryFactory.getRewardRepository();
      const currentBalance = await rewardRepo.getBalance(childId);

      if (existingTx) {
        const reaction = PetReactionEngine.fromInteraction("FEED", pet);
        return {
          pet: { ...pet },
          reaction,
          foodRemaining: currentBalance.totalPetFood,
          isNew: false,
        };
      }

      // 2. Check sufficient PetFood balance
      if (currentBalance.totalPetFood < foodAmount) {
        throw new Error(`Insufficient PetFood balance. Required: ${foodAmount}, Available: ${currentBalance.totalPetFood}`);
      }

      if (this.failureHook) {
        this.failureHook("BEFORE_FEED_COMMIT");
      }

      // 3. Deduct PetFood via reward transaction
      const feedTx = {
        id: `tx_feed_${idempotencyKey}`,
        childId,
        idempotencyKey: `feed_reward_${idempotencyKey}`,
        triggerEvent: "pet_nurtured" as const,
        starsDelta: 0,
        xpDelta: 0,
        coinsDelta: 0,
        petFoodDelta: -foodAmount,
        reason: `Cho Chú Lười ăn (${foodAmount} thức ăn)`,
        createdAt: new Date().toISOString(),
      };
      await rewardRepo.recordTransaction(feedTx);

      // 4. Update PetProfile stats and growth stage
      const beforeVersion = pet.version;
      const newHunger = HungerPolicy.feed(pet.stats.hunger, foodAmount);
      const newHappiness = Math.min(100, pet.stats.happiness + HungerPolicy.FEED_HAPPINESS_GAIN);
      const newEnergy = Math.min(100, pet.stats.energy + HungerPolicy.FEED_ENERGY_GAIN);
      const newBond = Math.min(100, pet.stats.bond + BondPolicy.getFeedBondGain());
      const newXp = pet.xp + HungerPolicy.FEED_XP_GAIN * foodAmount;
      const newGrowthStage = GrowthPolicy.calculateGrowthStage(newXp, newBond);

      pet = {
        ...pet,
        xp: newXp,
        stats: {
          ...pet.stats,
          hunger: newHunger,
          happiness: newHappiness,
          energy: newEnergy,
          bond: newBond,
        },
        growthStage: newGrowthStage,
        version: beforeVersion + 1,
        lastFedAt: new Date().toISOString(),
        lastInteractedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.pets.set(childId, pet);

      // 5. Record interaction transaction
      const interactionTx: PetInteractionTransaction = {
        id: `pet_int_${idempotencyKey}`,
        childId,
        petId: pet.id,
        interactionType: "FEED",
        petFoodDelta: -foodAmount,
        beforeVersion,
        afterVersion: pet.version,
        idempotencyKey,
        createdAt: new Date().toISOString(),
      };
      this.interactions.set(idempotencyKey, interactionTx);

      const reaction = PetReactionEngine.fromInteraction("FEED", pet);
      const updatedBalance = await rewardRepo.getBalance(childId);

      return {
        pet: { ...pet },
        reaction,
        foodRemaining: updatedBalance.totalPetFood,
        isNew: true,
      };
    } finally {
      releaseLock!();
    }
  }

  /**
   * Records a non-currency interaction (Petting, Play, Rest, Wake)
   */
  public async recordInteractionTransaction(
    params: RecordInteractionParams
  ): Promise<PetInteractionResult> {
    const { childId, interactionType, idempotencyKey } = params;
    const lockKey = childId;
    const prevLock = this.childLocks.get(lockKey) || Promise.resolve();
    let releaseLock: () => void;
    const currentLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    this.childLocks.set(
      lockKey,
      prevLock.then(() => currentLock)
    );

    await prevLock;

    try {
      let pet = this.pets.get(childId);
      if (!pet) {
        pet = {
          id: `pet_${childId}`,
          childId,
          name: "Chú Lười",
          species: "sloth",
          visualVariant: "default",
          level: 1,
          xp: 0,
          stats: { hunger: 50, happiness: 70, energy: 80, bond: 10 },
          growthStage: "baby",
          equippedCosmetics: {},
          discoveredAnimations: ["IDLE_BREATHE", "EAT", "HAPPY_BOUNCE"],
          version: 1,
          lastFedAt: new Date().toISOString(),
          lastInteractedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        this.pets.set(childId, pet);
      }

      const existingTx = this.interactions.get(idempotencyKey);
      if (existingTx) {
        const reaction = PetReactionEngine.fromInteraction(interactionType, pet);
        return {
          pet: { ...pet },
          reaction,
          isNew: false,
        };
      }

      if (this.failureHook) {
        this.failureHook("BEFORE_INTERACTION_COMMIT");
      }

      const beforeVersion = pet.version;
      let happinessGain = 0;
      let bondGain = 0;

      if (interactionType === "PET") {
        happinessGain = 5;
        bondGain = BondPolicy.getPetBondGain();
      } else if (interactionType === "PLAY_SHORT") {
        happinessGain = 10;
        bondGain = 1;
      }

      const newHappiness = Math.min(100, pet.stats.happiness + happinessGain);
      const newBond = Math.min(100, pet.stats.bond + bondGain);
      const newGrowthStage = GrowthPolicy.calculateGrowthStage(pet.xp, newBond);

      pet = {
        ...pet,
        stats: {
          ...pet.stats,
          happiness: newHappiness,
          bond: newBond,
        },
        growthStage: newGrowthStage,
        version: beforeVersion + 1,
        lastInteractedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.pets.set(childId, pet);

      const interactionTx: PetInteractionTransaction = {
        id: `pet_int_${idempotencyKey}`,
        childId,
        petId: pet.id,
        interactionType,
        petFoodDelta: 0,
        beforeVersion,
        afterVersion: pet.version,
        idempotencyKey,
        createdAt: new Date().toISOString(),
      };
      this.interactions.set(idempotencyKey, interactionTx);

      const reaction = PetReactionEngine.fromInteraction(interactionType, pet);

      return {
        pet: { ...pet },
        reaction,
        isNew: true,
        happinessGain,
        bondGain,
      };
    } finally {
      releaseLock!();
    }
  }
}
