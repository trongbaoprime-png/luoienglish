import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert";
import { NextRequest } from "next/server";
import { GET as getPetRoute } from "@/app/api/pet/route";
import { POST as feedPetRoute } from "@/app/api/pet/feed/route";
import { POST as interactPetRoute } from "@/app/api/pet/interact/route";
import {
  setServerTokenVerifierForTesting,
  resetServerTokenVerifier,
  TestIdTokenVerifier,
} from "@/services/auth/serverAuth";
import { ServerAccountSessionService } from "@/services/auth/ServerAccountSessionService";
import { ParentModeSessionService } from "@/services/auth/ParentModeSessionService";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { InMemoryChildRepository } from "@/repositories/memory/InMemoryChildRepository";
import { InMemoryPetRepository } from "@/repositories/memory/InMemoryPetRepository";
import { InMemoryRewardRepository } from "@/repositories/memory/InMemoryRewardRepository";
import { ChildProfile } from "@/types/student";

describe("Secure Pet API Ownership Boundary & Attack Suite (LE-010B)", () => {
  const parentA = "parent_alice_123";
  const parentB = "parent_bob_456";
  const validSecret = "a_very_secure_random_test_secret_with_32_characters_min!";

  const childAId = "child_alice_pet_1";
  const childBId = "child_bob_pet_2";

  let childRepo: InMemoryChildRepository;
  let petRepo: InMemoryPetRepository;
  let rewardRepo: InMemoryRewardRepository;

  before(() => {
    setServerTokenVerifierForTesting(new TestIdTokenVerifier());
    ServerAccountSessionService.setSecretForTesting(validSecret);
    ParentModeSessionService.setSecretForTesting(validSecret);
  });

  after(() => {
    resetServerTokenVerifier();
    ServerAccountSessionService.resetSecretForTesting();
    ParentModeSessionService.resetSecretForTesting();
  });

  beforeEach(async () => {
    childRepo = new InMemoryChildRepository();
    petRepo = new InMemoryPetRepository();
    rewardRepo = new InMemoryRewardRepository();

    (RepositoryFactory as unknown as { getChildRepository: () => typeof childRepo }).getChildRepository =
      () => childRepo;
    (RepositoryFactory as unknown as { getPetRepository: () => typeof petRepo }).getPetRepository =
      () => petRepo;
    (RepositoryFactory as unknown as { getRewardRepository: () => typeof rewardRepo }).getRewardRepository =
      () => rewardRepo;

    // Seed Child A owned by Parent A
    const childA: ChildProfile = {
      id: childAId,
      parentUid: parentA,
      nickname: "Alice Kid",
      avatarKey: "avatar_sloth_cozy",
      schoolGrade: 3,
      englishLevel: "A1",
      preferences: { themeId: "cozy" },
      dailyGoalMinutes: 15,
      totalStudyTimeMinutes: 30,
      streakDays: 2,
      lastActiveDate: "2026-08-21",
      createdAt: new Date().toISOString(),
    };
    await childRepo.create(childA);

    // Seed Child B owned by Parent B
    const childB: ChildProfile = {
      id: childBId,
      parentUid: parentB,
      nickname: "Bob Kid",
      avatarKey: "avatar_sloth_explorer",
      schoolGrade: 4,
      englishLevel: "A2",
      preferences: { themeId: "explorer" },
      dailyGoalMinutes: 20,
      totalStudyTimeMinutes: 50,
      streakDays: 4,
      lastActiveDate: "2026-08-21",
      createdAt: new Date().toISOString(),
    };
    await childRepo.create(childB);

    // Seed Child A with 3 pet food
    await rewardRepo.recordTransaction({
      id: "tx_seed_alice_food",
      childId: childAId,
      idempotencyKey: "seed_alice_food_key",
      triggerEvent: "lesson_completed",
      starsDelta: 5,
      xpDelta: 100,
      coinsDelta: 20,
      petFoodDelta: 3,
      createdAt: new Date().toISOString(),
    });

    // Seed Child B with 5 pet food
    await rewardRepo.recordTransaction({
      id: "tx_seed_bob_food",
      childId: childBId,
      idempotencyKey: "seed_bob_food_key",
      triggerEvent: "lesson_completed",
      starsDelta: 5,
      xpDelta: 100,
      coinsDelta: 20,
      petFoodDelta: 5,
      createdAt: new Date().toISOString(),
    });
  });

  // =========================================================================
  // 1. Unauthenticated Gate Tests
  // =========================================================================
  it("Unauthenticated GET /api/pet -> 401 Unauthorized", async () => {
    const req = new NextRequest(`http://localhost:3000/api/pet?childId=${childAId}`);
    const res = await getPetRoute(req);
    assert.strictEqual(res.status, 401);
  });

  it("Unauthenticated POST /api/pet/feed -> 401 Unauthorized", async () => {
    const req = new NextRequest("http://localhost:3000/api/pet/feed", {
      method: "POST",
      body: JSON.stringify({
        childId: childAId,
        foodAmount: 1,
        idempotencyKey: "feed_unauth_key",
      }),
    });
    const res = await feedPetRoute(req);
    assert.strictEqual(res.status, 401);
  });

  it("Unauthenticated POST /api/pet/interact -> 401 Unauthorized", async () => {
    const req = new NextRequest("http://localhost:3000/api/pet/interact", {
      method: "POST",
      body: JSON.stringify({
        childId: childAId,
        interactionType: "PET",
        idempotencyKey: "int_unauth_key",
      }),
    });
    const res = await interactPetRoute(req);
    assert.strictEqual(res.status, 401);
  });

  // =========================================================================
  // 2. Authorized Parent A Access to Own Child A Tests
  // =========================================================================
  it("Parent A GET own Child A Pet -> 200 OK with pet state and food balance", async () => {
    const req = new NextRequest(`http://localhost:3000/api/pet?childId=${childAId}`, {
      headers: { authorization: `Bearer mock_token_${parentA}` },
    });
    const res = await getPetRoute(req);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.pet.childId, childAId);
    assert.strictEqual(data.petFoodBalance, 3);
  });

  it("Parent A POST feed own Child A Pet -> 200 OK and deducts food", async () => {
    const req = new NextRequest("http://localhost:3000/api/pet/feed", {
      method: "POST",
      headers: { authorization: `Bearer mock_token_${parentA}` },
      body: JSON.stringify({
        childId: childAId,
        foodAmount: 1,
        idempotencyKey: "feed_alice_1",
      }),
    });
    const res = await feedPetRoute(req);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.isNew, true);
    assert.strictEqual(data.foodRemaining, 2);
  });

  it("Parent A POST interact own Child A Pet -> 200 OK with emotional reaction", async () => {
    const req = new NextRequest("http://localhost:3000/api/pet/interact", {
      method: "POST",
      headers: { authorization: `Bearer mock_token_${parentA}` },
      body: JSON.stringify({
        childId: childAId,
        interactionType: "PET",
        idempotencyKey: "int_alice_1",
      }),
    });
    const res = await interactPetRoute(req);
    assert.strictEqual(res.status, 200);

    const data = await res.json();
    assert.strictEqual(data.reaction.emotion, "HAPPY");
  });

  // =========================================================================
  // 3. Cross-Tenant IDOR Attack Tests (Parent A targeting Child B)
  // =========================================================================
  it("Attack 1: Parent A GET Child B Pet -> 403 Forbidden", async () => {
    const req = new NextRequest(`http://localhost:3000/api/pet?childId=${childBId}`, {
      headers: { authorization: `Bearer mock_token_${parentA}` },
    });
    const res = await getPetRoute(req);
    assert.strictEqual(res.status, 403);
  });

  it("Attack 2: Parent A POST feed Child B Pet -> 403 Forbidden and ZERO food deduction on Child B", async () => {
    const balBefore = await rewardRepo.getBalance(childBId);
    assert.strictEqual(balBefore.totalPetFood, 5);

    const req = new NextRequest("http://localhost:3000/api/pet/feed", {
      method: "POST",
      headers: { authorization: `Bearer mock_token_${parentA}` },
      body: JSON.stringify({
        childId: childBId,
        foodAmount: 1,
        idempotencyKey: "attack_feed_bob",
      }),
    });
    const res = await feedPetRoute(req);
    assert.strictEqual(res.status, 403);

    // Child B food balance and pet MUST remain unchanged
    const balAfter = await rewardRepo.getBalance(childBId);
    assert.strictEqual(balAfter.totalPetFood, 5);

    const petB = await petRepo.findByChildId(childBId);
    assert.strictEqual(petB, null); // No pet initialized or modified
  });

  it("Attack 3: Parent A POST interact Child B Pet -> 403 Forbidden and ZERO pet mutation", async () => {
    const req = new NextRequest("http://localhost:3000/api/pet/interact", {
      method: "POST",
      headers: { authorization: `Bearer mock_token_${parentA}` },
      body: JSON.stringify({
        childId: childBId,
        interactionType: "PLAY_SHORT",
        idempotencyKey: "attack_int_bob",
      }),
    });
    const res = await interactPetRoute(req);
    assert.strictEqual(res.status, 403);

    const petB = await petRepo.findByChildId(childBId);
    assert.strictEqual(petB, null);
  });

  // =========================================================================
  // 4. Forged Non-Existent Child ID Tests
  // =========================================================================
  it("Attack 4: Forged non-existent childId GET -> 404 Not Found with ZERO orphan pet creation", async () => {
    const nonExistentId = "child_fake_999999";
    const req = new NextRequest(`http://localhost:3000/api/pet?childId=${nonExistentId}`, {
      headers: { authorization: `Bearer mock_token_${parentA}` },
    });
    const res = await getPetRoute(req);
    assert.strictEqual(res.status, 404);

    const pet = await petRepo.findByChildId(nonExistentId);
    assert.strictEqual(pet, null);
  });

  it("Attack 5: Forged non-existent childId POST feed -> 404 Not Found with ZERO mutation", async () => {
    const nonExistentId = "child_fake_999999";
    const req = new NextRequest("http://localhost:3000/api/pet/feed", {
      method: "POST",
      headers: { authorization: `Bearer mock_token_${parentA}` },
      body: JSON.stringify({
        childId: nonExistentId,
        foodAmount: 1,
        idempotencyKey: "feed_fake_key",
      }),
    });
    const res = await feedPetRoute(req);
    assert.strictEqual(res.status, 404);
  });

  // =========================================================================
  // 5. Schema & Payload Validation Tests
  // =========================================================================
  it("Missing childId parameter -> 400 Bad Request", async () => {
    const req = new NextRequest("http://localhost:3000/api/pet", {
      headers: { authorization: `Bearer mock_token_${parentA}` },
    });
    const res = await getPetRoute(req);
    assert.strictEqual(res.status, 400);
  });

  it("Invalid foodAmount (negative / non-integer) -> 400 Bad Request", async () => {
    const req = new NextRequest("http://localhost:3000/api/pet/feed", {
      method: "POST",
      headers: { authorization: `Bearer mock_token_${parentA}` },
      body: JSON.stringify({
        childId: childAId,
        foodAmount: -5,
        idempotencyKey: "feed_invalid_amount",
      }),
    });
    const res = await feedPetRoute(req);
    assert.strictEqual(res.status, 400);
  });

  it("Invalid interactionType -> 400 Bad Request with allowed list error message", async () => {
    const req = new NextRequest("http://localhost:3000/api/pet/interact", {
      method: "POST",
      headers: { authorization: `Bearer mock_token_${parentA}` },
      body: JSON.stringify({
        childId: childAId,
        interactionType: "UNAUTHORIZED_CHEAT_ACTION",
        idempotencyKey: "cheat_int_key",
      }),
    });
    const res = await interactPetRoute(req);
    assert.strictEqual(res.status, 400);

    const data = await res.json();
    assert.strictEqual(data.error.includes("Invalid interactionType"), true);
  });
});
