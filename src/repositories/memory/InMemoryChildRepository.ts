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
        avatarKey: "mascot.sloth.cozy.hello",
        schoolGrade: 3,
        englishLevel: "A1",
        themePreference: "cozy",
        dailyGoalMinutes: 15,
        totalStudyTimeMinutes: 45,
        streakDays: 3,
        lastActiveDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ],
  ]);

  public async findById(id: string): Promise<ChildProfile | null> {
    return this.children.get(id) || null;
  }

  public async findByParentUid(parentUid: string): Promise<ChildProfile[]> {
    return Array.from(this.children.values()).filter((c) => c.parentUid === parentUid);
  }

  public async create(child: ChildProfile): Promise<ChildProfile> {
    this.children.set(child.id, child);
    return child;
  }

  public async update(id: string, updates: Partial<ChildProfile>): Promise<ChildProfile> {
    const existing = this.children.get(id);
    if (!existing) throw new Error(`Child not found: ${id}`);
    const updated = { ...existing, ...updates };
    this.children.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    return this.children.delete(id);
  }
}
