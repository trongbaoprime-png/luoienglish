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
        avatarKey: "avatar_sloth_cozy",
        schoolGrade: 3,
        englishLevel: "A1",
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
        createdAt: new Date().toISOString(),
      },
    ],
  ]);

  public async findById(id: string): Promise<ChildProfile | null> {
    const child = this.children.get(id);
    return child ? { ...child } : null;
  }

  public async findByParentUid(parentUid: string): Promise<ChildProfile[]> {
    return Array.from(this.children.values())
      .filter((c) => c.parentUid === parentUid)
      .map((c) => ({ ...c }));
  }

  public async create(child: ChildProfile): Promise<ChildProfile> {
    this.children.set(child.id, { ...child });
    return { ...child };
  }

  public async update(id: string, updates: Partial<ChildProfile>): Promise<ChildProfile> {
    const existing = this.children.get(id);
    if (!existing) {
      throw new Error(`Child not found: ${id}`);
    }

    const mergedPreferences = updates.preferences
      ? { ...existing.preferences, ...updates.preferences }
      : existing.preferences;

    const updated: ChildProfile = {
      ...existing,
      ...updates,
      preferences: mergedPreferences,
      themePreference: mergedPreferences?.themeId || existing.themePreference || "cozy",
    };

    this.children.set(id, updated);
    return { ...updated };
  }

  public async delete(id: string): Promise<boolean> {
    return this.children.delete(id);
  }
}
