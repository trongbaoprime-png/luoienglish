import { ChildDailyGoals, DailyGoalType } from "@/types/dailyGoal";

export interface ApplyDailyGoalProjectionParams {
  childId: string;
  dateStr: string;
  goalType: DailyGoalType;
  projectionKey: string;
  delta: number;
}

export interface ApplyDailyGoalProjectionResult {
  applied: boolean; // true if this transaction mutated the aggregate; false if marker already existed
  goalCompleted: boolean;
  allCompleted: boolean;
  goals: ChildDailyGoals;
}

export interface IDailyGoalRepository {
  getDailyGoals(childId: string, dateStr: string): Promise<ChildDailyGoals | null>;
  saveDailyGoals(goals: ChildDailyGoals): Promise<ChildDailyGoals>;
  isProjectionProcessed(childId: string, projectionKey: string): Promise<boolean>;
  recordProcessedProjection(childId: string, projectionKey: string): Promise<void>;
  applyProjection(params: ApplyDailyGoalProjectionParams): Promise<ApplyDailyGoalProjectionResult>;
}
