import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import crypto from "crypto";
import {
  verifyFirebaseIdToken,
  verifyParentModeSession,
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

describe("Server Auth & Parent Mode Security Boundary (LE-004C)", () => {
  const parentA = "parent_alice_verified";
  const parentB = "parent_bob_verified";

  before(() => {
    // Inject Test verifier for unit testing environment
    setServerTokenVerifierForTesting(new TestIdTokenVerifier());
  });

  after(() => {
    resetServerTokenVerifier();
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

  it("Production token verifier strictly rejects mock_token in all cases", async () => {
    const prodVerifier = new FirebaseIdTokenVerifier();
    await assert.rejects(
      async () => await prodVerifier.verifyToken("mock_token_parentA"),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 401);
        return true;
      }
    );
    await assert.rejects(
      async () => await prodVerifier.verifyToken("mock_token_admin"),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 401);
        return true;
      }
    );
  });

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

  it("Parent Mode Session: Correct PIN verification creates short-lived signed session token", async () => {
    const userRepo = new InMemoryUserRepository();
    const gateService = new ParentalGateService(userRepo);

    await userRepo.create({
      uid: parentA,
      email: "alice@luoi.com",
      displayName: "Alice",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await gateService.setPin(parentA, "1234");
    const result = await gateService.verifyPin(parentA, "1234");

    assert.strictEqual(result.success, true);
    assert.ok(result.parentModeSessionToken, "Must issue ParentModeSession token on PIN success");

    // Verify token with ParentModeSessionService
    const verification = ParentModeSessionService.verifySession(
      result.parentModeSessionToken,
      parentA
    );
    assert.strictEqual(verification.valid, true);
    assert.strictEqual(verification.session?.parentUid, parentA);
  });

  it("Child Mode with valid Firebase parent auth CANNOT access/reset without ParentModeSession", async () => {
    // Parent A has valid Firebase Auth token, but NO parent_mode_session cookie
    const fakeChildModeReq = {
      headers: { get: (name: string) => (name.toLowerCase() === "authorization" ? `Bearer mock_token_${parentA}` : null) },
      cookies: { get: () => undefined },
    };

    // Attempting verifyParentModeSession throws 403
    assert.throws(
      () => verifyParentModeSession(fakeChildModeReq, parentA),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        assert.ok(err.message.includes("Parent Mode Session") || err.message.includes("bị khóa"));
        return true;
      }
    );
  });

  it("Parent A CANNOT use Parent B's ParentModeSession token", async () => {
    const { token: tokenB } = ParentModeSessionService.createSession(parentB);

    const fakeReqWithTokenB = {
      headers: { get: () => null },
      cookies: { get: (name: string) => (name === "parent_mode_session" ? { value: tokenB } : undefined) },
    };

    // Parent A attempts to use Parent B's token
    assert.throws(
      () => verifyParentModeSession(fakeReqWithTokenB, parentA),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        assert.ok(err.message.includes("không thuộc về"));
        return true;
      }
    );
  });

  it("Expired ParentModeSession is strictly rejected", async () => {
    // Create an already-expired session token
    const now = Date.now() - 3600000; // 1 hour ago
    const expiredSession = {
      sessionId: "expired_sess_123",
      parentUid: parentA,
      createdAt: new Date(now - 100000).toISOString(),
      expiresAt: new Date(now).toISOString(),
    };
    const payload = Buffer.from(JSON.stringify(expiredSession)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", process.env.PARENT_SESSION_SECRET || "luoi_parent_mode_session_secret_fixed_key_2026")
      .update(payload)
      .digest("base64url");
    const expiredToken = `${payload}.${signature}`;

    const fakeReq = {
      headers: { get: () => null },
      cookies: { get: () => ({ value: expiredToken }) },
    };

    assert.throws(
      () => verifyParentModeSession(fakeReq, parentA),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        assert.ok(err.message.includes("hết hạn"));
        return true;
      }
    );
  });

  it("PBKDF2 uses 100,000 iterations with version and algorithm metadata", async () => {
    const userRepo = new InMemoryUserRepository();
    const gateService = new ParentalGateService(userRepo);

    await userRepo.create({
      uid: parentA,
      email: "alice@luoi.com",
      displayName: "Alice",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await gateService.setPin(parentA, "9876");
    const record = await userRepo.getPinRecord(parentA);

    assert.ok(record);
    assert.strictEqual(record.version, 1);
    assert.strictEqual(record.algo, "pbkdf2-sha256");
    assert.strictEqual(record.iterations, 100000, "PBKDF2 iterations must be at least 100,000");
    assert.notStrictEqual(record.pinHash, "9876");
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
  });
});
