import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { PetService } from "./PetService";
import { GrowthPolicy } from "@/domain/pet/GrowthPolicy";
import { HungerPolicy } from "@/domain/pet/HungerPolicy";
import { BondPolicy } from "@/domain/pet/BondPolicy";
import { PetReactionEngine } from "@/domain/pet/PetReactionEngine";
import { InMemoryPetRepository } from "@/repositories/memory/InMemoryPetRepository";
import { InMemoryRewardRepository } from "@/repositories/memory/InMemoryRewardRepository";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { MotivationEvent } from "@/types/motivation";

describe("Pet Companion Core & Emotional Learning Loop (LE-010)", () => {
  let petRepo: InMemoryPetRepository;
  let rewardRepo: InMemoryRewardRepository;

  const childAId = "child_pet_alice";
  const childBId = "child_pet_bob";

  beforeEach(async () => {
    petRepo = new InMemoryPetRepository();
    rewardRepo = new InMemoryRewardRepository();

    (RepositoryFactory as unknown as { getPetRepository: () => typeof petRepo }).getPetRepository =
      () => petRepo;
    (RepositoryFactory as unknown as { getRewardRepository: () => typeof rewardRepo }).getRewardRepository =
      () => rewardRepo;

    // Seed Child A with initial PetFood balance = 2
    await rewardRepo.recordTransaction({
      id: "tx_seed_food",
      childId: childAId,
      idempotencyKey: "seed_key_alice_food",
      triggerEvent: "lesson_completed",
      starsDelta: 3,
      xpDelta: 50,
      coinsDelta: 10,
      petFoodDelta: 2,
      createdAt: new Date().toISOString(),
    });
  });

  it("Test 1: FEED with enough food -> deducts food once and updates Pet stats", async () => {
    const balBefore = await rewardRepo.getBalance(childAId);
    assert.strictEqual(balBefore.totalPetFood, 2);

    const result = await PetService.feedPet(childAId, "tx_feed_test_1", 1);
    assert.strictEqual(result.isNew, true);
    assert.strictEqual(result.foodRemaining, 1);
    assert.strictEqual(result.pet.stats.hunger > 50, true);
    assert.strictEqual(result.reaction.emotion, "HAPPY");
    assert.strictEqual(result.reaction.animation, "EAT");

    const balAfter = await rewardRepo.getBalance(childAId);
    assert.strictEqual(balAfter.totalPetFood, 1);
  });

  it("Test 2: FEED without enough food -> throws Insufficient balance and zero mutations", async () => {
    // Child B has 0 food
    await assert.rejects(
      async () => {
        await PetService.feedPet(childBId, "tx_feed_broke", 1);
      },
      /Insufficient PetFood balance/
    );

    const pet = await petRepo.findByChildId(childBId);
    // Pet version and stats remain unchanged from initial
    assert.strictEqual(pet?.stats.hunger, 60);
  });

  it("Test 3: Duplicate interactionId on FEED -> returns cached result with zero duplicate food deduction", async () => {
    const key = "tx_feed_idempotent_key_1";

    const r1 = await PetService.feedPet(childAId, key, 1);
    assert.strictEqual(r1.isNew, true);
    assert.strictEqual(r1.foodRemaining, 1);

    const r2 = await PetService.feedPet(childAId, key, 1);
    assert.strictEqual(r2.isNew, false);
    assert.strictEqual(r2.foodRemaining, 1);

    const bal = await rewardRepo.getBalance(childAId);
    assert.strictEqual(bal.totalPetFood, 1); // Not deducted twice
  });

  it("Test 4: Two concurrent FEED requests -> serialized atomicity prevents negative balance", async () => {
    // Child A has 2 food. We launch 3 concurrent feed requests of 1 food each.
    const results = await Promise.allSettled([
      PetService.feedPet(childAId, "tx_conc_feed_1", 1),
      PetService.feedPet(childAId, "tx_conc_feed_2", 1),
      PetService.feedPet(childAId, "tx_conc_feed_3", 1),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    assert.strictEqual(fulfilled.length, 2);
    assert.strictEqual(rejected.length, 1);

    const bal = await rewardRepo.getBalance(childAId);
    assert.strictEqual(bal.totalPetFood, 0); // Never negative
  });

  it("Test 5: Transaction failure before commit -> leaves food balance and Pet state unchanged", async () => {
    petRepo.failureHook = (stage) => {
      if (stage === "BEFORE_FEED_COMMIT") {
        throw new Error("Simulated Datastore Failure Before Feed Commit");
      }
    };

    await assert.rejects(
      async () => {
        await PetService.feedPet(childAId, "tx_fail_feed", 1);
      },
      /Simulated Datastore Failure/
    );

    petRepo.failureHook = undefined;

    const bal = await rewardRepo.getBalance(childAId);
    assert.strictEqual(bal.totalPetFood, 2); // Unchanged
  });

  it("Test 6: Pet growth cannot be farmed through feeding alone (requires Learning XP + Bond)", () => {
    // High food / XP but low bond -> stage stays baby
    const stageLowBond = GrowthPolicy.calculateGrowthStage(1000, 10);
    assert.strictEqual(stageLowBond, "baby");

    // High bond but low XP -> stage stays baby
    const stageLowXp = GrowthPolicy.calculateGrowthStage(50, 95);
    assert.strictEqual(stageLowXp, "baby");

    // Both thresholds met for Young (XP 200+, Bond 25+)
    const stageYoung = GrowthPolicy.calculateGrowthStage(250, 30);
    assert.strictEqual(stageYoung, "young");

    // Both thresholds met for Wise Sloth (XP 3000+, Bond 90+)
    const stageWise = GrowthPolicy.calculateGrowthStage(3500, 95);
    assert.strictEqual(stageWise, "wise_sloth");
  });

  it("Test 7: Bond policy caps non-learning interaction gains (anti-spam protection)", () => {
    const feedBond = BondPolicy.getFeedBondGain();
    const petBond = BondPolicy.getPetBondGain();
    const learningBond = BondPolicy.getLearningBondGain("unit_completed");

    assert.strictEqual(feedBond, 2);
    assert.strictEqual(petBond, 1);
    assert.strictEqual(learningBond, 10); // Learning provides significantly higher bond
  });

  it("Test 8: Missed days natural decay respects safe lower bound (never starves or dies)", () => {
    // 100 hours (over 4 days) without food
    const hungerAfter4Days = HungerPolicy.calculateNaturalDecay(80, 100);
    assert.strictEqual(hungerAfter4Days, 20); // Clamped at SAFE_MIN_HUNGER (20)

    // 1000 hours without food
    const hungerAfter40Days = HungerPolicy.calculateNaturalDecay(80, 1000);
    assert.strictEqual(hungerAfter40Days, 20); // Still 20, never 0 or dead
  });

  it("Test 9: Petting interaction provides joyful emotional feedback without creating currency rewards", async () => {
    const res = await PetService.interact(childAId, "PET", "int_pet_heart_1");
    assert.strictEqual(res.isNew, true);
    assert.strictEqual(res.reaction.emotion, "HAPPY");
    assert.strictEqual(res.reaction.animation, "HAPPY_BOUNCE");
    assert.strictEqual(res.pet.stats.happiness >= 80, true);

    const bal = await rewardRepo.getBalance(childAId);
    assert.strictEqual(bal.totalPetFood, 2); // No virtual currency farmed
  });

  it("Test 10: Learning MotivationEvent triggers positive emotional reaction and strengthens bond", async () => {
    const event: MotivationEvent = {
      id: "motevt_learning_101",
      childId: childAId,
      rewardTransactionId: "tx_101",
      eventType: "lesson_completed",
      occurredAt: new Date().toISOString(),
      payload: {
        starsDelta: 3,
        xpDelta: 50,
        petFoodDelta: 1,
        isWeaknessRemediated: true,
        levelTransition: {
          previousLevel: 1,
          newLevel: 1,
          isLevelUp: false,
        },
      },
      policyVersion: "1.0",
      processingState: "PENDING",
      processedProjections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { pet, reaction } = await PetService.onLearningMotivationEvent(childAId, event);
    assert.strictEqual(reaction.emotion, "PROUD");
    assert.strictEqual(reaction.animation, "CLAP");
    assert.strictEqual(pet.stats.bond > 15, true);
  });

  it("Test 11: Mistake reaction is warm and encouraging (never punitive)", () => {
    const mistakeReaction = PetReactionEngine.forMistake();
    assert.strictEqual(mistakeReaction.emotion, "ENCOURAGING");
    assert.strictEqual(mistakeReaction.animation, "ENCOURAGE_NOD");
    assert.strictEqual(mistakeReaction.speechTextVi.includes("thử lại cùng Lười"), true);
  });

  it("Test 12: Welcome Back reaction greets returning learner warmly", () => {
    const welcome = PetReactionEngine.fromInteraction("WELCOME_BACK", {
      id: "pet_1",
      childId: childAId,
      name: "Chú Lười",
      species: "sloth",
      visualVariant: "default",
      level: 1,
      xp: 100,
      stats: { hunger: 50, happiness: 70, energy: 80, bond: 20 },
      growthStage: "baby",
      equippedCosmetics: {},
      discoveredAnimations: [],
      version: 1,
      lastFedAt: new Date().toISOString(),
      lastInteractedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    assert.strictEqual(welcome.emotion, "EXCITED");
    assert.strictEqual(welcome.animation, "WAVE");
    assert.strictEqual(welcome.soundEvent, "pet.greeting");
  });
});
