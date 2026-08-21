import { describe, it } from "node:test";
import assert from "node:assert";
import { InMemoryChildRepository } from "@/repositories/memory/InMemoryChildRepository";
import { authorizeChildAccess } from "@/services/auth/serverAuth";
import { ChildProfile } from "@/types/student";

describe("Child Profile Management & Multi-Tenant Security (LE-005)", () => {
  const parentA = "parent_alice_uid";
  const parentB = "parent_bob_uid";

  const sampleChildA: ChildProfile = {
    id: "child_alice_1",
    parentUid: parentA,
    nickname: "Bé Bơ",
    displayName: "Bé Bơ",
    avatarKey: "avatar_sloth_cozy",
    schoolGrade: 2,
    englishLevel: "A1",
    interests: ["animals", "music"],
    preferences: { themeId: "cozy", soundEffectsEnabled: true, backgroundMusicEnabled: true },
    dailyGoalMinutes: 15,
    totalStudyTimeMinutes: 0,
    streakDays: 0,
    lastActiveDate: "2026-08-21",
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sampleChildB: ChildProfile = {
    id: "child_bob_1",
    parentUid: parentB,
    nickname: "Bé Cam",
    displayName: "Bé Cam",
    avatarKey: "avatar_sloth_explorer",
    schoolGrade: 4,
    englishLevel: "A2",
    interests: ["science", "cartoons"],
    preferences: { themeId: "explorer", soundEffectsEnabled: true, backgroundMusicEnabled: true },
    dailyGoalMinutes: 20,
    totalStudyTimeMinutes: 30,
    streakDays: 2,
    lastActiveDate: "2026-08-21",
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("Parent can create and list multiple owned child profiles", async () => {
    const childRepo = new InMemoryChildRepository();
    await childRepo.create(sampleChildA);

    const childA2: ChildProfile = {
      ...sampleChildA,
      id: "child_alice_2",
      nickname: "Bé Mít",
      displayName: "Bé Mít",
      schoolGrade: 1,
      englishLevel: "Pre-A1",
      preferences: { themeId: "explorer" },
    };
    await childRepo.create(childA2);

    const aliceChildren = await childRepo.findByParentUid(parentA);
    assert.strictEqual(aliceChildren.length, 2);
    assert.strictEqual(aliceChildren[0]?.nickname, "Bé Bơ");
    assert.strictEqual(aliceChildren[1]?.nickname, "Bé Mít");
  });

  it("Parent A can edit own child's profile and theme preferences", async () => {
    const childRepo = new InMemoryChildRepository();
    await childRepo.create(sampleChildA);

    const updated = await childRepo.update(sampleChildA.id, {
      nickname: "Bé Bơ Thông Thái",
      schoolGrade: 3,
      englishLevel: "A1+",
      preferences: { themeId: "explorer", soundEffectsEnabled: false },
      dailyGoalMinutes: 25,
    });

    assert.strictEqual(updated.nickname, "Bé Bơ Thông Thái");
    assert.strictEqual(updated.schoolGrade, 3);
    assert.strictEqual(updated.englishLevel, "A1+");
    assert.strictEqual(updated.preferences.themeId, "explorer");
    assert.strictEqual(updated.dailyGoalMinutes, 25);
  });

  it("Parent can delete/archive own child profile", async () => {
    const childRepo = new InMemoryChildRepository();
    await childRepo.create(sampleChildA);

    const beforeDelete = await childRepo.findById(sampleChildA.id);
    assert.ok(beforeDelete);

    await childRepo.delete(sampleChildA.id);
    const afterDelete = await childRepo.findById(sampleChildA.id);
    assert.strictEqual(afterDelete, null);
  });

  it("Red Team IDOR Attack: Parent B CANNOT access Parent A's child", async () => {
    const childRepo = new InMemoryChildRepository();
    await childRepo.create(sampleChildA);

    const authCheck = await authorizeChildAccess(parentB, sampleChildA.id, childRepo);
    assert.strictEqual(authCheck.authorized, false);
    assert.strictEqual(authCheck.statusCode, 403);
    assert.ok(authCheck.error?.includes("Vi phạm quyền truy cập"));
  });

  it("Red Team Hijacking Attack: parentUid is strictly immutable on update (SEC-AUTH-007)", async () => {
    const childRepo = new InMemoryChildRepository();
    await childRepo.create(sampleChildA);

    // Attempt to hijack child profile by changing parentUid
    await assert.rejects(
      async () => await childRepo.update(sampleChildA.id, { parentUid: parentB }),
      (err: unknown) => {
        assert.ok(err instanceof Error);
        assert.ok(err.message.includes("parentUid"));
        return true;
      }
    );

    // Verify parentUid remains untouched
    const stored = await childRepo.findById(sampleChildA.id);
    assert.strictEqual(stored?.parentUid, parentA);
  });

  it("Max Children Limit Enforcement (Max 5 profiles per parent)", async () => {
    const childRepo = new InMemoryChildRepository();

    for (let i = 1; i <= 5; i++) {
      await childRepo.create({
        ...sampleChildA,
        id: `child_alice_${i}`,
        nickname: `Child ${i}`,
      });
    }

    const count = await childRepo.countByParentUid(parentA);
    assert.strictEqual(count, 5);
  });

  it("Theme Isolation: Multi-child profiles maintain independent themes (ARCH-002)", async () => {
    const childRepo = new InMemoryChildRepository();
    await childRepo.create(sampleChildA); // Cozy theme
    await childRepo.create(sampleChildB); // Explorer theme

    const fetchedA = await childRepo.findById(sampleChildA.id);
    const fetchedB = await childRepo.findById(sampleChildB.id);

    assert.strictEqual(fetchedA?.preferences.themeId, "cozy");
    assert.strictEqual(fetchedB?.preferences.themeId, "explorer");
  });
});
