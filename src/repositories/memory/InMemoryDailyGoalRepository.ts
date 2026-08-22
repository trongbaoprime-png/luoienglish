import { ChildDailyGoals } from "@/types/dailyGoal";
import { IDailyGoalRepository } from "../interfaces/IDailyGoalRepository";

export class InMemoryDailyGoalRepository implements IDailyGoalRepository {
  private dailyGoals: Map<string, ChildDailyGoals> = new Map();
  private processedProjections: Set<string> = new Set();

  private makeKey(childId: string, dateStr: string): string {
    return `${childId}_${dateStr}`;
  }

  public async getDailyGoals(childId: string, dateStr: string): Promise<ChildDailyGoals | null> {
    const key = this.makeKey(childId, dateStr);
    return this.dailyGoals.get(key) || null;
  }

  public async saveDailyGoals(goals: ChildDailyGoals): Promise<ChildDailyGoals> {
    const key = this.makeKey(goals.childId, goals.dateStr);
    this.dailyGoals.set(key, { ...goals });
    return { ...goals };
  }

  public async isProjectionProcessed(childId: string, projectionKey: string): Promise<boolean> {
    return this.processedProjections.has(`${childId}_${projectionKey}`);
  }

  public async recordProcessedProjection(childId: string, projectionKey: string): Promise<void> {
    this.processedProjections.add(`${childId}_${projectionKey}`);
  }
}
