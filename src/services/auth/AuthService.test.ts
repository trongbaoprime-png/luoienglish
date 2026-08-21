import { describe, it } from "node:test";
import assert from "node:assert";
import { InMemoryUserRepository } from "@/repositories/memory/InMemoryUserRepository";
import { MockAuthService } from "./MockAuthService";
import { ChildProfile } from "@/types/student";

/**
 * Route Guard Authorization Evaluator for Testing
 */
class RouteGuardEvaluator {
  public static canAccessParentRoute(auth: { uid: string; role?: string } | null): boolean {
    if (!auth) return false;
    return auth.role === "parent" || auth.role === "admin";
  }

  public static canAccessAdminRoute(auth: { uid: string; role?: string } | null): boolean {
    if (!auth) return false;
    return auth.role === "admin";
  }

  public static canAccessStudentRoute(
    auth: { uid: string; role?: string } | null,
    childSession: { parentUid: string; childId: string } | null
  ): boolean {
    if (!auth || !childSession) return false;
    return childSession.parentUid === auth.uid;
  }
}

describe("AuthService & Route Guard Authorization (LE-004)", () => {
  const parentA = { uid: "parent_alice", role: "parent" };
  const parentB = { uid: "parent_bob", role: "parent" };
  const adminUser = { uid: "admin_super", role: "admin" };

  const childA: ChildProfile = {
    id: "child_alice_1",
    parentUid: parentA.uid,
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

  it("Unauthenticated user: CANNOT access parent, student, or admin routes", () => {
    assert.strictEqual(RouteGuardEvaluator.canAccessParentRoute(null), false);
    assert.strictEqual(RouteGuardEvaluator.canAccessStudentRoute(null, null), false);
    assert.strictEqual(RouteGuardEvaluator.canAccessAdminRoute(null), false);
  });

  it("Parent A: can access parent area and own child session, but CANNOT access admin", () => {
    assert.strictEqual(RouteGuardEvaluator.canAccessParentRoute(parentA), true);
    assert.strictEqual(RouteGuardEvaluator.canAccessAdminRoute(parentA), false);

    const childSession = { parentUid: parentA.uid, childId: childA.id };
    assert.strictEqual(RouteGuardEvaluator.canAccessStudentRoute(parentA, childSession), true);
  });

  it("Parent B: CANNOT access Parent A's child session", () => {
    const childASession = { parentUid: parentA.uid, childId: childA.id };
    assert.strictEqual(RouteGuardEvaluator.canAccessStudentRoute(parentB, childASession), false);
  });

  it("Admin user: CAN access admin route", () => {
    assert.strictEqual(RouteGuardEvaluator.canAccessAdminRoute(adminUser), true);
  });

  it("AuthService: handles registration, login, profile retrieval, and logout cleanup", async () => {
    const userRepo = new InMemoryUserRepository();
    const authService = new MockAuthService(userRepo);

    // Register
    const registered = await authService.registerWithEmail("linh@luoi.com", "pass1234", "Mẹ Linh");
    assert.strictEqual(registered.email, "linh@luoi.com");
    assert.strictEqual(registered.role, "parent");

    // Current user check
    const current = await authService.getCurrentUserProfile();
    assert.strictEqual(current?.uid, registered.uid);

    // Logout
    await authService.logout();
    const afterLogout = await authService.getCurrentUserProfile();
    assert.strictEqual(afterLogout, null, "Logout must clear active in-memory user");
  });
});
