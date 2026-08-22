import { ChildAchievementProgress } from "@/types/achievement";
import { IAchievementRepository } from "../interfaces/IAchievementRepository";

export class InMemoryAchievementRepository implements IAchievementRepository {
  private achievements: Map<string, ChildAchievementProgress> = new Map();
  private processedProjections: Set<string> = new Set();

  private makeKey(childId: string, achievementId: string): string {
    return `${childId}_${achievementId}`;
  }

  public async getAchievements(childId: string): Promise<ChildAchievementProgress[]> {
    return Array.from(this.achievements.values()).filter((a) => a.childId === childId);
  }

  public async getAchievement(
    childId: string,
    achievementId: string
  ): Promise<ChildAchievementProgress | null> {
    const key = this.makeKey(childId, achievementId);
    return this.achievements.get(key) || null;
  }

  public async saveAchievement(
    progress: ChildAchievementProgress
  ): Promise<ChildAchievementProgress> {
    const key = this.makeKey(progress.childId, progress.achievementId);
    this.achievements.set(key, { ...progress });
    return { ...progress };
  }

  public async isProjectionProcessed(childId: string, projectionKey: string): Promise<boolean> {
    return this.processedProjections.has(`${childId}_${projectionKey}`);
  }

  public async recordProcessedProjection(childId: string, projectionKey: string): Promise<void> {
    this.processedProjections.add(`${childId}_${projectionKey}`);
  }
}
