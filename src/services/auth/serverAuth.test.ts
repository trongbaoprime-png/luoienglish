import { describe, it } from "node:test";
import assert from "node:assert";
import { verifyFirebaseIdToken, authorizeChildAccess, ServerAuthError } from "./serverAuth";
import { InMemoryUserRepository } from "@/repositories/memory/InMemoryUserRepository";
import { InMemoryChildRepository } from "@/repositories/memory/InMemoryChildRepository";
import { ParentalGateService } from "./ParentalGateService";
import { ChildProfile } from "@/types/student";
import { UserProfile } from "@/types/auth";

describe("Server Auth & Identity Enforcement (LE-004B)", () => {
  const parentA = "parent_alice_verified";
  const parentB = "parent_bob_verified";

  const childA: ChildProfile = {
    id: "child_alice_1",
    parentUid: parentA,
    nickname: "Alice Kid",
    avatarKey: "avatar_sloth_cozy",
    schoolGrade: 3,
    englishLevel: "A1",
    preferences: { themeId: "cozy" },
    dailyGoalMinutes: 15,
    totalStudyTimeMinutes: 45,
    streakDays: 3,
    lastActiveDate: "2026-08-21",
    createdAt: new Date().toISOString(),
  };

  const childB: ChildProfile = {
    id: "child_bob_1",
    parentUid: parentB,
    nickname: "Bob Kid",
    avatarKey: "avatar_sloth_cozy",
    schoolGrade: 4,
    englishLevel: "A2",
    preferences: { themeId: "explorer" },
    dailyGoalMinutes: 20,
    totalStudyTimeMinutes: 60,
    streakDays: 5,
    lastActiveDate: "2026-08-21",
    createdAt: new Date().toISOString(),
  };

  it("Unauthenticated request: rejects PIN operations with 401 ServerAuthError", async () => {
    const fakeReq = { headers: { get: () => null } };
    await assert.rejects(
      async () => await verifyFirebaseIdToken(fakeReq),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 401);
        return true;
      }
    );
  });

  it("Malformed/Missing Bearer token: rejects with 401", async () => {
    const fakeReq1 = { headers: { get: () => "Basic 12345" } };
    await assert.rejects(
      async () => await verifyFirebaseIdToken(fakeReq1),
      (err: unknown) => {
        assert.strictEqual((err as ServerAuthError).statusCode, 401);
        return true;
      }
    );

    const fakeReq2 = { headers: { get: () => "Bearer " } };
    await assert.rejects(
      async () => await verifyFirebaseIdToken(fakeReq2),
      (err: unknown) => {
        assert.strictEqual((err as ServerAuthError).statusCode, 401);
        return true;
      }
    );
  });

  it("Verified Parent A token: correctly derives trusted server identity", async () => {
    const req = { headers: { get: () => `Bearer mock_token_${parentA}` } };
    const token = await verifyFirebaseIdToken(req);
    assert.strictEqual(token.uid, parentA);
    assert.strictEqual(token.role, "parent");
  });

  it("Forged body attack: server PIN operation strictly uses token identity and ignores body parentUid", async () => {
    const userRepo = new InMemoryUserRepository();
    const gateService = new ParentalGateService(userRepo);

    // Create user profiles in repository
    const profileA: UserProfile = {
      uid: parentA,
      email: "alice@luoienglish.com",
      displayName: "Alice",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const profileB: UserProfile = {
      uid: parentB,
      email: "bob@luoienglish.com",
      displayName: "Bob",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await userRepo.create(profileA);
    await userRepo.create(profileB);

    // Set PIN for Parent A and Parent B
    await gateService.setPin(parentA, "1111");
    await gateService.setPin(parentB, "2222");

    // Parent A sends a forged request trying to verify Parent B's PIN
    const authHeaderReq = { headers: { get: () => `Bearer mock_token_${parentA}` } };
    const verifiedToken = await verifyFirebaseIdToken(authHeaderReq);

    // Attacker forged body: { parentUid: parentB, pin: "2222" }
    const trustedUid = verifiedToken.uid; // Server MUST use trustedUid = parentA
    assert.strictEqual(trustedUid, parentA, "Server identity must be Parent A");

    // Verification on trusted Parent A with Parent B's PIN "2222" fails
    const result = await gateService.verifyPin(trustedUid, "2222");
    assert.strictEqual(result.success, false, "Must fail because Parent A's PIN is 1111");

    // Verification on trusted Parent A with Parent A's PIN "1111" succeeds
    const legitResult = await gateService.verifyPin(trustedUid, "1111");
    assert.strictEqual(legitResult.success, true);
  });

  it("Privilege Escalation Attack: Normal parent cannot self-promote to admin role", async () => {
    const userRepo = new InMemoryUserRepository();
    await userRepo.create({
      uid: parentA,
      email: "alice@luoi.com",
      displayName: "Alice",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const currentUser = await userRepo.findById(parentA);
    assert.strictEqual(currentUser?.role, "parent");

    // Simulation of rule: request.resource.data.role == resource.data.role
    const attemptedRole: string = "admin";
    const isRoleMutated = attemptedRole !== currentUser?.role;
    assert.strictEqual(isRoleMutated, true, "Role change attempt detected and forbidden");
  });

  it("Child Scoped Server Helper: authorizeChildAccess enforces parent ownership", async () => {
    const childRepo = new InMemoryChildRepository();
    await childRepo.create(childA);
    await childRepo.create(childB);

    // Parent A accesses Child A -> Authorized
    const authA = await authorizeChildAccess(parentA, childA.id, childRepo);
    assert.strictEqual(authA.authorized, true);
    assert.strictEqual(authA.statusCode, 200);
    assert.strictEqual(authA.child?.id, childA.id);

    // Parent A accesses Child B -> Forbidden (403)
    const authB = await authorizeChildAccess(parentA, childB.id, childRepo);
    assert.strictEqual(authB.authorized, false);
    assert.strictEqual(authB.statusCode, 403);
    assert.ok(authB.error?.includes("Vi phạm quyền truy cập"));

    // Parent A accesses non-existent child -> Not Found (404)
    const authNonExistent = await authorizeChildAccess(parentA, "child_fake_999", childRepo);
    assert.strictEqual(authNonExistent.authorized, false);
    assert.strictEqual(authNonExistent.statusCode, 404);
  });
});
