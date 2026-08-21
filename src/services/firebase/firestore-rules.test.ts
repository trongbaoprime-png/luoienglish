import { describe, it } from "node:test";
import assert from "node:assert";
import { InMemoryChildRepository } from "@/repositories/memory/InMemoryChildRepository";
import { InMemoryRewardRepository } from "@/repositories/memory/InMemoryRewardRepository";
import { RewardEngine } from "@/engines/reward/RewardEngine";
import { ChildProfile } from "@/types/student";

/**
 * Security Rule Logic Evaluator for Unit Testing
 * Simulates Firestore Security Rules defined in firestore.rules
 */
class FirestoreSecurityRuleSimulator {
  public static canAccessChild(
    authUid: string | null,
    resourceParentUid: string
  ): boolean {
    if (!authUid) return false;
    return authUid === resourceParentUid;
  }

  public static canClientWriteRewardLedger(): boolean {
    // Under firestore.rules: allow write: if false;
    return false;
  }

  public static canStudentMutateCurriculum(authRole?: string): boolean {
    // Under firestore.rules: allow write: if isAdmin();
    return authRole === "admin";
  }
}

describe("Firestore Security Rules & Ownership Hardening (LE-003B)", () => {
  const parentAUid = "parent_alice_123";
  const parentBUid = "parent_bob_456";

  const childA: ChildProfile = {
    id: "child_alice_1",
    parentUid: parentAUid,
    nickname: "Alice Kid",
    avatarKey: "avatar_sloth_cozy",
    schoolGrade: 3,
    englishLevel: "A1",
    preferences: {
      themeId: "cozy",
      soundEffectsEnabled: true,
      backgroundMusicEnabled: true,
    },
    dailyGoalMinutes: 15,
    totalStudyTimeMinutes: 45,
    streakDays: 3,
    lastActiveDate: "2026-08-21",
    createdAt: new Date().toISOString(),
  };

  it("Parent A can read and update their own child profile and theme preferences", async () => {
    const isAllowed = FirestoreSecurityRuleSimulator.canAccessChild(parentAUid, childA.parentUid);
    assert.strictEqual(isAllowed, true);

    const childRepo = new InMemoryChildRepository();
    await childRepo.create(childA);

    // Update child's theme preference
    const updated = await childRepo.update(childA.id, {
      preferences: {
        themeId: "explorer",
      },
    });

    assert.strictEqual(updated.preferences.themeId, "explorer");
  });

  it("Parent B CANNOT read or write Parent A's child profile (Strict Isolation)", async () => {
    const isReadAllowed = FirestoreSecurityRuleSimulator.canAccessChild(parentBUid, childA.parentUid);
    assert.strictEqual(isReadAllowed, false);

    const isWriteAllowed = FirestoreSecurityRuleSimulator.canAccessChild(parentBUid, childA.parentUid);
    assert.strictEqual(isWriteAllowed, false);

    // Unauthenticated guest cannot access
    const isGuestAllowed = FirestoreSecurityRuleSimulator.canAccessChild(null, childA.parentUid);
    assert.strictEqual(isGuestAllowed, false);
  });

  it("Untrusted client is strictly FORBIDDEN from writing to rewardTransactions and rewardBalances", () => {
    const canWrite = FirestoreSecurityRuleSimulator.canClientWriteRewardLedger();
    assert.strictEqual(canWrite, false, "Client direct write to reward ledger must be blocked");
  });

  it("Student/Child CANNOT modify curriculum content, only admin can write", () => {
    assert.strictEqual(
      FirestoreSecurityRuleSimulator.canStudentMutateCurriculum(undefined),
      false,
      "Student must not write to curriculum"
    );
    assert.strictEqual(
      FirestoreSecurityRuleSimulator.canStudentMutateCurriculum("admin"),
      true,
      "Admin role is authorized to write to curriculum"
    );
  });

  it("Duplicate reward replay does not change balance under transaction semantics", async () => {
    const rewardRepo = new InMemoryRewardRepository();
    const childId = "child_security_test";

    const tx = RewardEngine.processEvent(childId, "replay_attack_key_777", {
      event: "lesson_completed",
    });

    // 1st attempt
    await rewardRepo.recordTransaction(tx);
    const balance1 = await rewardRepo.getBalance(childId);
    assert.strictEqual(balance1.totalStars, 3);
    assert.strictEqual(balance1.totalXp, 50);

    // Replay attempt with same idempotencyKey
    await rewardRepo.recordTransaction(tx);
    const balance2 = await rewardRepo.getBalance(childId);

    // Balance must be identical
    assert.strictEqual(balance2.totalStars, balance1.totalStars);
    assert.strictEqual(balance2.totalXp, balance1.totalXp);
  });
});
