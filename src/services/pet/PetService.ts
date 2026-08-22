import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  FeedPetResult,
  PetInteractionResult,
  PetInteractionType,
  PetProfile,
  PetReaction,
} from "@/types/pet";
import { MotivationEvent } from "@/types/motivation";
import { PetReactionEngine } from "@/domain/pet/PetReactionEngine";
import { BondPolicy } from "@/domain/pet/BondPolicy";
import { GrowthPolicy } from "@/domain/pet/GrowthPolicy";

export class PetService {
  /**
   * Retrieves or initializes a child's Chú Lười pet profile
   */
  public static async getOrInitPet(childId: string): Promise<PetProfile> {
    const petRepo = RepositoryFactory.getPetRepository();
    let pet = await petRepo.findByChildId(childId);

    if (!pet) {
      pet = {
        id: `pet_${childId}`,
        childId,
        name: "Chú Lười",
        species: "sloth",
        visualVariant: "default",
        level: 1,
        xp: 0,
        stats: {
          hunger: 60,
          happiness: 75,
          energy: 85,
          bond: 15,
        },
        growthStage: "baby",
        equippedCosmetics: {},
        discoveredAnimations: ["IDLE_BREATHE", "EAT", "HAPPY_BOUNCE", "CLAP", "WAVE"],
        version: 1,
        lastFedAt: new Date().toISOString(),
        lastInteractedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await petRepo.create(pet);
    }

    return pet;
  }

  /**
   * Atomically feeds the pet using earned PetFood from RewardBalance.
   */
  public static async feedPet(
    childId: string,
    idempotencyKey: string,
    foodAmount = 1
  ): Promise<FeedPetResult> {
    const petRepo = RepositoryFactory.getPetRepository();
    const pet = await PetService.getOrInitPet(childId);

    return await petRepo.recordFeedTransaction({
      childId,
      petId: pet.id,
      foodAmount,
      idempotencyKey,
    });
  }

  /**
   * Performs an emotional interaction (Petting, Play, Rest, Wake)
   */
  public static async interact(
    childId: string,
    interactionType: PetInteractionType,
    idempotencyKey?: string
  ): Promise<PetInteractionResult> {
    const petRepo = RepositoryFactory.getPetRepository();
    const pet = await PetService.getOrInitPet(childId);
    const key = idempotencyKey || `int_${childId}_${Date.now()}_${Math.random()}`;

    return await petRepo.recordInteractionTransaction({
      childId,
      petId: pet.id,
      interactionType,
      idempotencyKey: key,
    });
  }

  /**
   * Evaluates an authoritative learning MotivationEvent and updates pet bond / triggers reaction
   */
  public static async onLearningMotivationEvent(
    childId: string,
    event: MotivationEvent
  ): Promise<{ pet: PetProfile; reaction: PetReaction }> {
    const petRepo = RepositoryFactory.getPetRepository();
    let pet = await PetService.getOrInitPet(childId);

    const bondGain = BondPolicy.getLearningBondGain(event.eventType);
    const newBond = Math.min(100, pet.stats.bond + bondGain);
    const newGrowth = GrowthPolicy.calculateGrowthStage(pet.xp, newBond);

    pet = await petRepo.update(pet.id, {
      stats: {
        ...pet.stats,
        bond: newBond,
        happiness: Math.min(100, pet.stats.happiness + 5),
      },
      growthStage: newGrowth,
    });

    const reaction = PetReactionEngine.fromLearningEvent(event, pet);

    return { pet, reaction };
  }
}
