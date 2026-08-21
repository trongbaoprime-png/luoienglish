import { ChildProfile } from "@/types/student";
import { IChildRepository } from "../interfaces/IChildRepository";

export class InMemoryChildRepository implements IChildRepository {
  private children: Map<string, ChildProfile> = new Map([
    [
      "child_sample_1",
      {
        id: "child_sample_1",
        parentUid: "parent_sample_1",
        nickname: "Bảo Nhi",
        displayName: "Bảo Nhi",
        avatarKey: "avatar_sloth_cozy",
        schoolGrade: 3,
        englishLevel: "A1",
        interests: ["animals", "cartoons"],
        preferences: {
          themeId: "cozy",
          soundEffectsEnabled: true,
          backgroundMusicEnabled: true,
        },
        themePreference: "cozy",
        dailyGoalMinutes: 15,
        totalStudyTimeMinutes: 45,
        streakDays: 3,
        lastActiveDate: new Date().toISOString().split("T")[0]!,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  public async findById(id: string): Promise<ChildProfile | null> {
    const child = this.children.get(id);
    return child ? { ...child } : null;
  }

  public async findByParentUid(parentUid: string, includeArchived = false): Promise<ChildProfile[]> {
    return Array.from(this.children.values())
      .filter((c) => c.parentUid === parentUid && (includeArchived || !c.isArchived))
      .map((c) => ({ ...c }));
  }

  public async countByParentUid(parentUid: string): Promise<number> {
    const activeChildren = await this.findByParentUid(parentUid, false);
    return activeChildren.length;
  }

  public async create(child: ChildProfile): Promise<ChildProfile> {
    const newChild: ChildProfile = {
      ...child,
      isArchived: false,
      createdAt: child.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.children.set(child.id, newChild);
    return { ...newChild };
  }

  public async update(id: string, updates: Partial<ChildProfile>): Promise<ChildProfile> {
    const existing = this.children.get(id);
    if (!existing) {
      throw new Error(`Child not found: ${id}`);
    }

    // SEC-AUTH-007: parentUid is strictly immutable
    if (updates.parentUid && updates.parentUid !== existing.parentUid) {
      throw new Error("Vi phạm bảo mật: Không được phép thay đổi parentUid của học sinh.");
    }

    const mergedPreferences = updates.preferences
      ? { ...existing.preferences, ...updates.preferences }
      : existing.preferences;

    const updated: ChildProfile = {
      ...existing,
      ...updates,
      parentUid: existing.parentUid, // Enforce immutability
      preferences: mergedPreferences,
      themePreference: mergedPreferences?.themeId || existing.themePreference || "cozy",
      updatedAt: new Date().toISOString(),
    };

    this.children.set(id, updated);
    return { ...updated };
  }

  public async archive(id: string): Promise<ChildProfile> {
    return await this.update(id, { isArchived: true });
  }

  public async delete(id: string): Promise<boolean> {
    return this.children.delete(id);
  }
}
