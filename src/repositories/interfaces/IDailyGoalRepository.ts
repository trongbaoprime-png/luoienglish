import { ChildDailyGoals } from "@/types/dailyGoal";

export interface IDailyGoalRepository {
  getDailyGoals(childId: string, dateStr: string): Promise<ChildDailyGoals | null>;
  saveDailyGoals(goals: ChildDailyGoals): Promise<ChildDailyGoals>;
  isProjectionProcessed(childId: string, projectionKey: string): Promise<boolean>;
  recordProcessedProjection(childId: string, projectionKey: string): Promise<void>;
}
