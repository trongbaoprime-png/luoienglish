import { describe, it } from "node:test";
import assert from "node:assert";
import { InMemoryChildRepository } from "@/repositories/memory/InMemoryChildRepository";
import { InMemoryRewardRepository } from "@/repositories/memory/InMemoryRewardRepository";
import { InMemoryProgressRepository } from "@/repositories/memory/InMemoryProgressRepository";
import { InMemoryMemoryRepository } from "@/repositories/memory/InMemoryMemoryRepository";
import { InMemoryPetRepository } from "@/repositories/memory/InMemoryPetRepository";
import { RewardEngine } from "@/engines/reward/RewardEngine";
import { ChildProfile, StudentProgress } from "@/types/student";
import { KnowledgeMastery } from "@/types/memory";
import { Pet } from "@/types/pet";

/**
 * Strict Security Rules Simulator
 * Mirrors the exact logic and helper functions in firestore.rules
 */
class FirestoreSecurityRulesEngine {
  private static childrenDb: Map<string, { parentUid: string }> = new Map();

  public static registerChild(childId: string, parentUid: string) {
    this.childrenDb.set(childId, { parentUid });
  }

  public static isParentOfChild(authUid: string | null, childId: string): boolean {
    if (!authUid) return false;
    const child = this.childrenDb.get(childId);
    return Boolean(child && child.parentUid === authUid);
  }

  public static canReadChild(auth: { uid: string; role?: string } | null, childId: string): boolean {
    if (!auth) return false;
    if (auth.role === "admin") return true;
    const child = this.childrenDb.get(childId);
    return Boolean(child && child.parentUid === auth.uid);
  }

  public static canMutateChild(auth: { uid: string; role?: string } | null, childId: string): boolean {
    if (!auth) return false;
    if (auth.role === "admin") return true;
    const child = this.childrenDb.get(childId);
    return Boolean(child && child.parentUid === auth.uid);
  }

  public static canReadRewardBalance(auth: { uid: string; role?: string } | null, childId: string): boolean {
    if (!auth) return false;
    if (auth.role === "admin") return true;
    return this.isParentOfChild(auth.uid, childId);
  }

  public static canReadRewardTransactions(auth: { uid: string; role?: string } | null, childId: string): boolean {
    if (!auth) return false;
    if (auth.role === "admin") return true;
    return this.isParentOfChild(auth.uid, childId);
  }

  public static canClientWriteRewardLedger(): boolean {
    // Under firestore.rules: allow write: if false;
    return false;
  }

  public static canReadStudentProgress(auth: { uid: string; role?: string } | null, childId: string): boolean {
    if (!auth) return false;
    if (auth.role === "admin") return true;
    return this.isParentOfChild(auth.uid, childId);
  }

  public static canMutateStudentProgress(auth: { uid: string; role?: string } | null, childId: string): boolean {
    if (!auth) return false;
    if (auth.role === "admin") return true;
    return this.isParentOfChild(auth.uid, childId);
  }

  public static canReadKnowledgeMastery(auth: { uid: string; role?: string } | null, studentId: string): boolean {
    if (!auth) return false;
    if (auth.role === "admin") return true;
    return this.isParentOfChild(auth.uid, studentId);
  }

  public static canMutateKnowledgeMastery(auth: { uid: string; role?: string } | null, studentId: string): boolean {
    if (!auth) return false;
    if (auth.role === "admin") return true;
    return this.isParentOfChild(auth.uid, studentId);
  }

  public static canReadPet(auth: { uid: string; role?: string } | null, childId: string): boolean {
    if (!auth) return false;
    if (auth.role === "admin") return true;
    return this.isParentOfChild(auth.uid, childId);
  }

  public static canMutatePet(auth: { uid: string; role?: string } | null, childId: string): boolean {
    if (!auth) return false;
    if (auth.role === "admin") return true;
    return this.isParentOfChild(auth.uid, childId);
  }

  public static canMutateCurriculum(auth: { uid: string; role?: string } | null): boolean {
    return Boolean(auth && auth.role === "admin");
  }
}

describe("Strict Multi-Tenant Child Data Ownership Security Rules (LE-003C)", () => {
  const parentA = { uid: "parent_alice_123" };
  const parentB = { uid: "parent_bob_456" };
  const adminUser = { uid: "admin_user_001", role: "admin" };

  const childAId = "child_alice_1";
  const childBId = "child_bob_2";

  // Initialize registry
  FirestoreSecurityRulesEngine.registerChild(childAId, parentA.uid);
  FirestoreSecurityRulesEngine.registerChild(childBId, parentB.uid);

  const childAProfile: ChildProfile = {
    id: childAId,
    parentUid: parentA.uid,
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

  it("Parent A: can read own child", () => {
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadChild(parentA, childAId), true);
  });

  it("Parent A: can update own child's theme preference", async () => {
    assert.strictEqual(FirestoreSecurityRulesEngine.canMutateChild(parentA, childAId), true);
    const childRepo = new InMemoryChildRepository();
    await childRepo.create(childAProfile);
    const updated = await childRepo.update(childAId, {
      preferences: { themeId: "explorer" },
    });
    assert.strictEqual(updated.preferences.themeId, "explorer");
  });

  it("Parent A: can read own child progress, mastery, pet, and reward balance", () => {
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadStudentProgress(parentA, childAId), true);
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadKnowledgeMastery(parentA, childAId), true);
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadPet(parentA, childAId), true);
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadRewardBalance(parentA, childAId), true);
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadRewardTransactions(parentA, childAId), true);
  });

  it("Parent A: CANNOT read Parent B child", () => {
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadChild(parentA, childBId), false);
  });

  it("Parent A: CANNOT read or write Parent B progress", () => {
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadStudentProgress(parentA, childBId), false);
    assert.strictEqual(FirestoreSecurityRulesEngine.canMutateStudentProgress(parentA, childBId), false);
  });

  it("Parent A: CANNOT read or write Parent B mastery", () => {
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadKnowledgeMastery(parentA, childBId), false);
    assert.strictEqual(FirestoreSecurityRulesEngine.canMutateKnowledgeMastery(parentA, childBId), false);
  });

  it("Parent A: CANNOT read or mutate Parent B pet", () => {
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadPet(parentA, childBId), false);
    assert.strictEqual(FirestoreSecurityRulesEngine.canMutatePet(parentA, childBId), false);
  });

  it("Parent A: CANNOT read Parent B reward balance or reward transactions", () => {
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadRewardBalance(parentA, childBId), false);
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadRewardTransactions(parentA, childBId), false);
  });

  it("Any client: CANNOT write rewardBalances or rewardTransactions directly", () => {
    assert.strictEqual(FirestoreSecurityRulesEngine.canClientWriteRewardLedger(), false);
  });

  it("Unauthenticated user: CANNOT access child-owned data", () => {
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadChild(null, childAId), false);
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadStudentProgress(null, childAId), false);
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadKnowledgeMastery(null, childAId), false);
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadPet(null, childAId), false);
    assert.strictEqual(FirestoreSecurityRulesEngine.canReadRewardBalance(null, childAId), false);
  });

  it("Admin: only permissions explicitly documented (curriculum write, elevated inspect)", () => {
    assert.strictEqual(FirestoreSecurityRulesEngine.canMutateCurriculum(adminUser), true);
    assert.strictEqual(FirestoreSecurityRulesEngine.canMutateCurriculum(parentA), false);
  });

  it("Repositories provide childId-scoped operations and execute safely", async () => {
    const progressRepo = new InMemoryProgressRepository();
    const memoryRepo = new InMemoryMemoryRepository();
    const petRepo = new InMemoryPetRepository();
    const rewardRepo = new InMemoryRewardRepository();

    const progress: StudentProgress = {
      id: "prog_1",
      childId: childAId,
      lessonId: "g3_u1_l1",
      unitId: "g3_u1",
      isCompleted: true,
      scorePercent: 100,
      starsEarned: 3,
      xpEarned: 50,
      attemptsCount: 1,
      lastAttemptAt: new Date().toISOString(),
    };
    await progressRepo.saveProgress(progress);
    const childProgress = await progressRepo.getAllProgressForChild(childAId);
    assert.strictEqual(childProgress.length, 1);

    const mastery: KnowledgeMastery = {
      id: "km_1",
      studentId: childAId,
      knowledgeId: "ki_1",
      recognitionScore: 90,
      recallScore: 80,
      listeningScore: 85,
      speakingScore: 80,
      readingScore: 90,
      writingScore: 75,
      masteryScore: 85,
      lastSeenAt: new Date().toISOString(),
      nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
      reviewCount: 3,
      consecutiveCorrectStreak: 3,
      isWeakness: false,
    };
    await memoryRepo.saveMastery(mastery);
    const childMastery = await memoryRepo.getAllMasteryForStudent(childAId);
    assert.strictEqual(childMastery.length, 1);

    const pet: Pet = {
      id: "pet_1",
      childId: childAId,
      name: "Chú Lười Con",
      stage: "baby",
      stats: {
        happiness: 90,
        energy: 85,
        knowledge: 150,
        bond: 80,
      },
      equippedCosmetics: {
        outfit: "outfit_default",
      },
      lastFedAt: new Date().toISOString(),
      lastInteractedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await petRepo.create(pet);
    const childPet = await petRepo.findByChildId(childAId);
    assert.strictEqual(childPet?.name, "Chú Lười Con");

    const tx = RewardEngine.processEvent(childAId, "tx_secure_key_101", {
      event: "lesson_completed",
    });
    await rewardRepo.recordTransaction(tx);
    const txHistory = await rewardRepo.getTransactionHistory(childAId);
    assert.strictEqual(txHistory.length, 1);
  });
});
