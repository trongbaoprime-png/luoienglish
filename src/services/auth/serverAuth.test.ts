import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import crypto from "crypto";
import {
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

describe("Server Auth & Fail-Closed Parent Session Boundary (LE-004D)", () => {
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

  it("Fail-Closed: Missing or weak PARENT_SESSION_SECRET in production fails closed", () => {
    ParentModeSessionService.setSecretForTesting(null);
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.PARENT_SESSION_SECRET;

    try {
      (process.env as { NODE_ENV: string }).NODE_ENV = "production";
      delete process.env.PARENT_SESSION_SECRET;

      assert.throws(
        () => ParentModeSessionService.createSession(parentA),
        (err: unknown) => {
          assert.ok(err instanceof ServerAuthError);
          assert.strictEqual((err as ServerAuthError).statusCode, 500);
          assert.ok(err.message.includes("PARENT_SESSION_SECRET is missing"));
          return true;
        }
      );
    } finally {
      (process.env as { NODE_ENV: string }).NODE_ENV = originalEnv;
      process.env.PARENT_SESSION_SECRET = originalSecret;
      ParentModeSessionService.setSecretForTesting(validTestSecret);
    }
  });

  it("Known old hard-coded secret attack: forged session is rejected", () => {
    const oldHardcodedSecret = "luoi_parent_mode_session_secret_fixed_key_2026";
    const session = {
      sessionId: "forged_sess_0000000001",
      parentUid: parentA,
      securityVersion: 1,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
    const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", oldHardcodedSecret)
      .update(payload)
      .digest("base64url");
    const forgedToken = `${payload}.${signature}`;

    const verification = ParentModeSessionService.verifySession(forgedToken, parentA);
    assert.strictEqual(verification.valid, false);
    assert.strictEqual(verification.reason, "Chữ ký phiên mở khóa không hợp lệ.");
  });

  it("Child Mode without parent_mode_session cookie: verifyParentModeSession throws 403", async () => {
    const fakeChildModeReq = {
      headers: { get: () => null },
      cookies: { get: () => undefined },
    };

    await assert.rejects(
      async () => await verifyParentModeSession(fakeChildModeReq, parentA),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        return true;
      }
    );
  });

  it("Expired session: verifyParentModeSession throws 403", async () => {
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

    const fakeReq = {
      headers: { get: () => null },
      cookies: { get: () => ({ value: expiredToken }) },
    };

    await assert.rejects(
      async () => await verifyParentModeSession(fakeReq, parentA),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        assert.ok(err.message.includes("hết hạn"));
        return true;
      }
    );
  });

  it("Tampered session payload or signature: throws 403", async () => {
    const { token } = ParentModeSessionService.createSession(parentA);
    const tamperedToken = token.slice(0, -5) + "abcde";

    const fakeReq = {
      headers: { get: () => null },
      cookies: { get: () => ({ value: tamperedToken }) },
    };

    await assert.rejects(
      async () => await verifyParentModeSession(fakeReq, parentA),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        return true;
      }
    );
  });

  it("Parent A session token used for Parent B account: throws 403", async () => {
    const { token: tokenA } = ParentModeSessionService.createSession(parentA);

    const fakeReq = {
      headers: { get: () => null },
      cookies: { get: () => ({ value: tokenA }) },
    };

    await assert.rejects(
      async () => await verifyParentModeSession(fakeReq, parentB),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        assert.ok(err.message.includes("không thuộc về"));
        return true;
      }
    );
  });

  it("Stateful Invalidation on PIN Change & PIN Reset: previously-issued sessions become invalid", async () => {
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

    // 1. Set initial PIN -> securityVersion = 1
    await gateService.setPin(parentA, "1111");
    const verify1 = await gateService.verifyPin(parentA, "1111");
    assert.strictEqual(verify1.success, true);
    const sessionToken1 = verify1.parentModeSessionToken!;

    // Session 1 is valid
    const req1 = {
      headers: { get: () => null },
      cookies: { get: () => ({ value: sessionToken1 }) },
    };
    await verifyParentModeSession(req1, parentA, userRepo); // Passes without error

    // 2. Parent changes PIN -> securityVersion increments to 2
    await gateService.setPin(parentA, "2222");

    // Session 1 token MUST NOW BE INVALID
    await assert.rejects(
      async () => await verifyParentModeSession(req1, parentA, userRepo),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        assert.ok(err.message.includes("vô hiệu hóa") || err.message.includes("thay đổi"));
        return true;
      }
    );

    // 3. New PIN verification creates Session 2 -> valid
    const verify2 = await gateService.verifyPin(parentA, "2222");
    const sessionToken2 = verify2.parentModeSessionToken!;
    const req2 = {
      headers: { get: () => null },
      cookies: { get: () => ({ value: sessionToken2 }) },
    };
    await verifyParentModeSession(req2, parentA, userRepo); // Passes

    // 4. Parent resets PIN -> securityVersion increments to 3
    await gateService.resetPin(parentA);

    // Session 2 token MUST NOW BE INVALID
    await assert.rejects(
      async () => await verifyParentModeSession(req2, parentA, userRepo),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        return true;
      }
    );
  });

  it("Child Scoped Server Helper: authorizeChildAccess enforces parent ownership", async () => {
    const childRepo = new InMemoryChildRepository();
    await childRepo.create(childA);
    await childRepo.create(childB);

    const authA = await authorizeChildAccess(parentA, childA.id, childRepo);
    assert.strictEqual(authA.authorized, true);
    assert.strictEqual(authA.statusCode, 200);

    const authB = await authorizeChildAccess(parentA, childB.id, childRepo);
    assert.strictEqual(authB.authorized, false);
    assert.strictEqual(authB.statusCode, 403);
  });
});
