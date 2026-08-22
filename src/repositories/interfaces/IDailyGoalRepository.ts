import { ChildDailyGoals } from "@/types/dailyGoal";

export interface IDailyGoalRepository {
  getDailyGoals(childId: string, dateStr: string): Promise<ChildDailyGoals | null>;
  saveDailyGoals(goals: ChildDailyGoals): Promise<ChildDailyGoals>;
}
