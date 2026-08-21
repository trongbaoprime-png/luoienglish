import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import crypto from "crypto";
import {
  authorizeChildAccess,
  ServerAuthError,
  FirebaseIdTokenVerifier,
  TestIdTokenVerifier,
  setServerTokenVerifierForTesting,
  resetServerTokenVerifier,
} from "./serverAuth";
import { InMemoryUserRepository } from "@/repositories/memory/InMemoryUserRepository";
import { InMemoryChildRepository } from "@/repositories/memory/InMemoryChildRepository";
import { ParentalGateService } from "./ParentalGateService";
import { ParentModeSessionService } from "./ParentModeSessionService";
import { ChildProfile } from "@/types/student";

describe("Server Auth, Route Guard & PIN Verification Boundary (LE-004E)", () => {
  const parentA = "parent_alice_verified";
  const parentB = "parent_bob_verified";
  const validTestSecret = "a_very_secure_random_test_secret_with_32_characters_min!";

  before(() => {
    setServerTokenVerifierForTesting(new TestIdTokenVerifier());
    ParentModeSessionService.setSecretForTesting(validTestSecret);
  });

  after(() => {
    resetServerTokenVerifier();
    ParentModeSessionService.resetSecretForTesting();
  });

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

  it("Production token verifier strictly rejects mock_token with 401", async () => {
    const prodVerifier = new FirebaseIdTokenVerifier();
    await assert.rejects(
      async () => await prodVerifier.verifyToken("mock_token_parentA"),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 401);
        return true;
      }
    );
  });

  it("Route Guard Attack: No cookie -> blocked (valid: false)", () => {
    const verification = ParentModeSessionService.verifySession(undefined, parentA);
    assert.strictEqual(verification.valid, false);
    assert.ok(verification.reason?.includes("Thiếu phiên"));
  });

  it("Route Guard Attack: Random fake cookie -> blocked (signature invalid)", () => {
    const fakeToken = "random_crafted_string.invalid_signature_here";
    const verification = ParentModeSessionService.verifySession(fakeToken, parentA);
    assert.strictEqual(verification.valid, false);
    assert.strictEqual(verification.reason, "Chữ ký phiên mở khóa không hợp lệ.");
  });

  it("Route Guard Attack: Signed session for Parent B used for Parent A -> blocked", () => {
    const { token: tokenB } = ParentModeSessionService.createSession(parentB, 1);
    const verification = ParentModeSessionService.verifySession(tokenB, parentA, 1);
    assert.strictEqual(verification.valid, false);
    assert.ok(verification.reason?.includes("không thuộc về"));
  });

  it("Route Guard Attack: Expired session -> blocked", () => {
    const past = Date.now() - 3600000;
    const expiredSession = {
      sessionId: "expired_session_12345678",
      parentUid: parentA,
      securityVersion: 1,
      createdAt: new Date(past - 100000).toISOString(),
      expiresAt: new Date(past).toISOString(),
    };
    const payload = Buffer.from(JSON.stringify(expiredSession)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", validTestSecret)
      .update(payload)
      .digest("base64url");
    const expiredToken = `${payload}.${signature}`;

    const verification = ParentModeSessionService.verifySession(expiredToken, parentA, 1);
    assert.strictEqual(verification.valid, false);
    assert.ok(verification.reason?.includes("hết hạn"));
  });

  it("Route Guard Attack: Old securityVersion session -> blocked", () => {
    const { token: sessionV1 } = ParentModeSessionService.createSession(parentA, 1);

    // Parent securityVersion is now 2 (due to PIN change/reset)
    const verification = ParentModeSessionService.verifySession(sessionV1, parentA, 2);
    assert.strictEqual(verification.valid, false);
    assert.ok(verification.reason?.includes("vô hiệu hóa") || verification.reason?.includes("thay đổi"));
  });

  it("Route Guard: Valid authenticated parent + valid matching ParentModeSession -> ALLOWED", () => {
    const { token: sessionV1 } = ParentModeSessionService.createSession(parentA, 1);
    const verification = ParentModeSessionService.verifySession(sessionV1, parentA, 1);
    assert.strictEqual(verification.valid, true);
    assert.strictEqual(verification.session?.parentUid, parentA);
  });

  it("PIN State Tests: No hard-coded default PIN; 1234 does not work unless explicitly configured", async () => {
    const userRepo = new InMemoryUserRepository();
    const gateService = new ParentalGateService(userRepo);

    const newParentUid = "parent_new_onboarding_1";
    await userRepo.create({
      uid: newParentUid,
      email: "newparent@luoi.com",
      displayName: "New Parent",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: false,
      securityVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 1. Trying default "1234" fails when no PIN is set
    const defaultAttempt = await gateService.verifyPin(newParentUid, "1234");
    assert.strictEqual(defaultAttempt.success, false);
    assert.strictEqual(defaultAttempt.message, "Chưa thiết lập mã PIN phụ huynh.");

    // 2. Parent completes initial setup flow with explicit PIN (e.g. 5829)
    await gateService.setPin(newParentUid, "5829");

    // 3. Trying "1234" now fails with wrong PIN message
    const wrongAttempt = await gateService.verifyPin(newParentUid, "1234");
    assert.strictEqual(wrongAttempt.success, false);
    assert.ok(wrongAttempt.message.includes("không chính xác"));

    // 4. Entering chosen PIN 5829 succeeds
    const correctAttempt = await gateService.verifyPin(newParentUid, "5829");
    assert.strictEqual(correctAttempt.success, true);
    assert.ok(correctAttempt.parentModeSessionToken);
  });

  it("Child Scoped Server Helper: authorizeChildAccess enforces parent ownership", async () => {
    const childRepo = new InMemoryChildRepository();
    await childRepo.create(childA);

    const authA = await authorizeChildAccess(parentA, childA.id, childRepo);
    assert.strictEqual(authA.authorized, true);
    assert.strictEqual(authA.statusCode, 200);

    const authB = await authorizeChildAccess(parentB, childA.id, childRepo);
    assert.strictEqual(authB.authorized, false);
    assert.strictEqual(authB.statusCode, 403);
  });
});
