import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { InMemoryUserRepository } from "@/repositories/memory/InMemoryUserRepository";
import { ParentalGateService } from "./ParentalGateService";
import { ParentModeSessionService } from "./ParentModeSessionService";

describe("ParentalGateService — PIN Security & Brute-Force Lockout (LE-004)", () => {
  const parentUid = "parent_test_pin_123";

  before(() => {
    ParentModeSessionService.setSecretForTesting(
      "test_parent_mode_session_secret_32_chars_long_minimum!"
    );
  });

  after(() => {
    ParentModeSessionService.resetSecretForTesting();
  });

  it("should set PIN and never store plaintext PIN in storage", async () => {
    const userRepo = new InMemoryUserRepository();
    const gateService = new ParentalGateService(userRepo);

    await userRepo.create({
      uid: parentUid,
      email: "test.parent@luoienglish.com",
      displayName: "Parent Test",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const plaintextPin = "5829";
    await gateService.setPin(parentUid, plaintextPin);

    // Verify stored record
    const stored = await userRepo.getPinRecord(parentUid);
    assert.ok(stored, "PIN record must exist");
    assert.notStrictEqual(stored.pinHash, plaintextPin, "Plaintext PIN must NEVER be stored");
    assert.ok(stored.pinHash.length > 20, "PIN hash must be a strong cryptographic digest");
    assert.ok(stored.salt.length >= 16, "Salt must be present and at least 16 hex chars");
    assert.strictEqual(stored.iterations, 100000, "Must use 100k iterations");

    // Verify UserProfile flag is updated
    const profile = await userRepo.findById(parentUid);
    assert.strictEqual(profile?.isPinSet, true);
  });

  it("should verify correct PIN successfully", async () => {
    const userRepo = new InMemoryUserRepository();
    const gateService = new ParentalGateService(userRepo);
    await userRepo.create({
      uid: parentUid,
      email: "test.parent@luoienglish.com",
      displayName: "Parent Test",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await gateService.setPin(parentUid, "1234");
    const result = await gateService.verifyPin(parentUid, "1234");
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.isLocked, false);
    assert.ok(result.parentModeSessionToken, "Must return valid ParentModeSession token");
  });

  it("should reject incorrect PIN and decrement attempts", async () => {
    const userRepo = new InMemoryUserRepository();
    const gateService = new ParentalGateService(userRepo);
    await userRepo.create({
      uid: parentUid,
      email: "test.parent@luoienglish.com",
      displayName: "Parent Test",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await gateService.setPin(parentUid, "1234");
    const result = await gateService.verifyPin(parentUid, "9999");
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.isLocked, false);
    assert.strictEqual(result.attemptsRemaining, 4);
  });

  it("should trigger temporary lockout after 5 consecutive failed attempts (Brute-Force Protection)", async () => {
    const userRepo = new InMemoryUserRepository();
    const gateService = new ParentalGateService(userRepo);
    await userRepo.create({
      uid: parentUid,
      email: "test.parent@luoienglish.com",
      displayName: "Parent Test",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await gateService.setPin(parentUid, "1234");

    // 4 failed attempts
    for (let i = 0; i < 4; i++) {
      const res = await gateService.verifyPin(parentUid, "0000");
      assert.strictEqual(res.success, false);
      assert.strictEqual(res.isLocked, false);
    }

    // 5th failed attempt triggers lockout
    const finalFail = await gateService.verifyPin(parentUid, "0000");
    assert.strictEqual(finalFail.success, false);
    assert.strictEqual(finalFail.isLocked, true);
    assert.ok(finalFail.lockedUntil);

    // Even if correct PIN is entered while locked out, it must remain locked
    const lockedAttempt = await gateService.verifyPin(parentUid, "1234");
    assert.strictEqual(lockedAttempt.success, false);
    assert.strictEqual(lockedAttempt.isLocked, true);
  });

  it("should reset PIN through authenticated parent flow", async () => {
    const userRepo = new InMemoryUserRepository();
    const gateService = new ParentalGateService(userRepo);
    await userRepo.create({
      uid: parentUid,
      email: "test.parent@luoienglish.com",
      displayName: "Parent Test",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await gateService.setPin(parentUid, "1234");
    await gateService.resetPin(parentUid);

    const profile = await userRepo.findById(parentUid);
    assert.strictEqual(profile?.isPinSet, false);

    const result = await gateService.verifyPin(parentUid, "1234");
    assert.strictEqual(result.success, false);
  });
});
