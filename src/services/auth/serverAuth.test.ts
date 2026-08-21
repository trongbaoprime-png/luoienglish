import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import crypto from "crypto";
import {
  verifyServerAccountSession,
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
import { ServerAccountSessionService } from "./ServerAccountSessionService";
import { ChildProfile } from "@/types/student";

describe("Account-Bound Parent Session & Route Guard (LE-004F)", () => {
  const parentA = "parent_alice_verified";
  const parentB = "parent_bob_verified";
  const validTestSecret = "a_very_secure_random_test_secret_with_32_characters_min!";

  before(() => {
    setServerTokenVerifierForTesting(new TestIdTokenVerifier());
    ParentModeSessionService.setSecretForTesting(validTestSecret);
    ServerAccountSessionService.setSecretForTesting(validTestSecret);
  });

  after(() => {
    resetServerTokenVerifier();
    ParentModeSessionService.resetSecretForTesting();
    ServerAccountSessionService.resetSecretForTesting();
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

  it("Attack 1: No authenticated account + valid ParentModeSession -> BLOCKED", async () => {
    const { token: sessionTokenA } = ParentModeSessionService.createSession(parentA, 1);

    // Request has NO auth_session cookie and NO authorization header
    const unauthReq = {
      headers: { get: () => null },
      cookies: { get: (name: string) => (name === "parent_mode_session" ? { value: sessionTokenA } : undefined) },
    };

    await assert.rejects(
      async () => await verifyServerAccountSession(unauthReq),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 401);
        return true;
      }
    );
  });

  it("Attack 2: Stolen Cookie: Parent B authenticated + Parent A ParentModeSession -> BLOCKED", async () => {
    const accountTokenB = ServerAccountSessionService.createAccountSession(parentB);
    const { token: sessionTokenA } = ParentModeSessionService.createSession(parentA, 1);

    const stolenReq = {
      headers: { get: () => null },
      cookies: {
        get: (name: string) => {
          if (name === "auth_session") return { value: accountTokenB };
          if (name === "parent_mode_session") return { value: sessionTokenA };
          return undefined;
        },
      },
    };

    const verifiedAccount = await verifyServerAccountSession(stolenReq);
    assert.strictEqual(verifiedAccount.uid, parentB);

    // Verifying Parent A's stolen token against Parent B's authenticated account MUST FAIL
    await assert.rejects(
      async () => await verifyParentModeSession(stolenReq, verifiedAccount.uid),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        assert.ok(err.message.includes("không thuộc về"));
        return true;
      }
    );
  });

  it("Attack 3: Expired authenticated account session + valid ParentModeSession -> BLOCKED", async () => {
    const past = Date.now() - 3600000;
    const expiredAccountData = {
      uid: parentA,
      email: "alice@luoi.com",
      role: "parent",
      createdAt: new Date(past - 100000).toISOString(),
      expiresAt: new Date(past).toISOString(),
    };
    const payload = Buffer.from(JSON.stringify(expiredAccountData)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", validTestSecret)
      .update(`account_session:${payload}`)
      .digest("base64url");
    const expiredAccountToken = `${payload}.${signature}`;

    const { token: sessionTokenA } = ParentModeSessionService.createSession(parentA, 1);

    const expiredReq = {
      headers: { get: () => null },
      cookies: {
        get: (name: string) => {
          if (name === "auth_session") return { value: expiredAccountToken };
          if (name === "parent_mode_session") return { value: sessionTokenA };
          return undefined;
        },
      },
    };

    await assert.rejects(
      async () => await verifyServerAccountSession(expiredReq),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 401);
        assert.ok(err.message.includes("hết hạn"));
        return true;
      }
    );
  });

  it("Attack 4: Valid Parent A account + fake session -> BLOCKED", async () => {
    const accountTokenA = ServerAccountSessionService.createAccountSession(parentA);
    const fakeSessionToken = "random_crafted_string.invalid_signature_here";

    const fakeReq = {
      headers: { get: () => null },
      cookies: {
        get: (name: string) => {
          if (name === "auth_session") return { value: accountTokenA };
          if (name === "parent_mode_session") return { value: fakeSessionToken };
          return undefined;
        },
      },
    };

    const verifiedAccount = await verifyServerAccountSession(fakeReq);
    await assert.rejects(
      async () => await verifyParentModeSession(fakeReq, verifiedAccount.uid),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        return true;
      }
    );
  });

  it("Attack 5: Valid Parent A account + expired session -> BLOCKED", async () => {
    const accountTokenA = ServerAccountSessionService.createAccountSession(parentA);

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

    const req = {
      headers: { get: () => null },
      cookies: {
        get: (name: string) => {
          if (name === "auth_session") return { value: accountTokenA };
          if (name === "parent_mode_session") return { value: expiredToken };
          return undefined;
        },
      },
    };

    const verifiedAccount = await verifyServerAccountSession(req);
    await assert.rejects(
      async () => await verifyParentModeSession(req, verifiedAccount.uid),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        assert.ok(err.message.includes("hết hạn"));
        return true;
      }
    );
  });

  it("Attack 6: Valid Parent A account + old securityVersion session -> BLOCKED", async () => {
    const userRepo = new InMemoryUserRepository();

    await userRepo.create({
      uid: parentA,
      email: "alice@luoi.com",
      displayName: "Alice",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: true,
      securityVersion: 2, // Security version incremented to 2
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const accountTokenA = ServerAccountSessionService.createAccountSession(parentA);
    // Old session from version 1
    const { token: sessionV1 } = ParentModeSessionService.createSession(parentA, 1);

    const req = {
      headers: { get: () => null },
      cookies: {
        get: (name: string) => {
          if (name === "auth_session") return { value: accountTokenA };
          if (name === "parent_mode_session") return { value: sessionV1 };
          return undefined;
        },
      },
    };

    const verifiedAccount = await verifyServerAccountSession(req);
    await assert.rejects(
      async () => await verifyParentModeSession(req, verifiedAccount.uid, userRepo),
      (err: unknown) => {
        assert.ok(err instanceof ServerAuthError);
        assert.strictEqual((err as ServerAuthError).statusCode, 403);
        assert.ok(err.message.includes("vô hiệu hóa") || err.message.includes("thay đổi"));
        return true;
      }
    );
  });

  it("Valid Flow: Valid Parent A account + valid matching ParentModeSession -> ALLOWED", async () => {
    const userRepo = new InMemoryUserRepository();
    await userRepo.create({
      uid: parentA,
      email: "alice@luoi.com",
      displayName: "Alice",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: true,
      securityVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const accountTokenA = ServerAccountSessionService.createAccountSession(parentA);
    const { token: sessionV1 } = ParentModeSessionService.createSession(parentA, 1);

    const req = {
      headers: { get: () => null },
      cookies: {
        get: (name: string) => {
          if (name === "auth_session") return { value: accountTokenA };
          if (name === "parent_mode_session") return { value: sessionV1 };
          return undefined;
        },
      },
    };

    const verifiedAccount = await verifyServerAccountSession(req);
    assert.strictEqual(verifiedAccount.uid, parentA);

    // Passes without throwing error
    await verifyParentModeSession(req, verifiedAccount.uid, userRepo);
  });

  it("PIN State Tests: Initial PIN setup works only for own authenticated account", async () => {
    const userRepo = new InMemoryUserRepository();
    const gateService = new ParentalGateService(userRepo);

    await userRepo.create({
      uid: parentA,
      email: "alice@luoi.com",
      displayName: "Alice",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: false,
      securityVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Parent A initializes own PIN
    await gateService.setPin(parentA, "9876");

    const profileA = await userRepo.findById(parentA);
    assert.strictEqual(profileA?.isPinSet, true);

    const verifyResult = await gateService.verifyPin(parentA, "9876");
    assert.strictEqual(verifyResult.success, true);
    assert.ok(verifyResult.parentModeSessionToken);
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
