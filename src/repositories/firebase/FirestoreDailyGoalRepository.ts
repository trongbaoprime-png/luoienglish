import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
} from "firebase/firestore";
import { ChildDailyGoals } from "@/types/dailyGoal";
import { DailyGoalPolicy } from "@/domain/rewards/DailyGoalPolicy";
import {
  ApplyDailyGoalProjectionParams,
  ApplyDailyGoalProjectionResult,
  IDailyGoalRepository,
} from "../interfaces/IDailyGoalRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestoreDailyGoalRepository implements IDailyGoalRepository {
  private collectionName = "childDailyGoals";
  private projectionsCollection = "dailyGoalProjections";

  private makeDocId(childId: string, dateStr: string): string {
    return `${childId}_${dateStr}`;
  }

  public async getDailyGoals(childId: string, dateStr: string): Promise<ChildDailyGoals | null> {
    const db = FirebaseClient.getDb();
    const docId = this.makeDocId(childId, dateStr);
    const snap = await getDoc(doc(db, this.collectionName, docId));
    if (!snap.exists()) return null;
    return snap.data() as ChildDailyGoals;
  }

  public async saveDailyGoals(goals: ChildDailyGoals): Promise<ChildDailyGoals> {
    const db = FirebaseClient.getDb();
    const docId = this.makeDocId(goals.childId, goals.dateStr);
    await setDoc(doc(db, this.collectionName, docId), goals, { merge: true });
    return goals;
  }

  public async isProjectionProcessed(childId: string, projectionKey: string): Promise<boolean> {
    const db = FirebaseClient.getDb();
    const docId = `${childId}_${projectionKey}`;
    const snap = await getDoc(doc(db, this.projectionsCollection, docId));
    return snap.exists();
  }

  public async recordProcessedProjection(childId: string, projectionKey: string): Promise<void> {
    const db = FirebaseClient.getDb();
    const docId = `${childId}_${projectionKey}`;
    await setDoc(doc(db, this.projectionsCollection, docId), {
      childId,
      projectionKey,
      processedAt: new Date().toISOString(),
    });
  }

  /**
   * Atomically reads projection marker and daily goals document inside a Firestore transaction,
   * updates goal counts, determines completions, and writes updated goal + marker in ONE commit.
   */
  public async applyProjection(
    params: ApplyDailyGoalProjectionParams
  ): Promise<ApplyDailyGoalProjectionResult> {
    const db = FirebaseClient.getDb();
    const { childId, dateStr, goalType, projectionKey, delta } = params;

    const docId = this.makeDocId(childId, dateStr);
    const goalDocRef = doc(db, this.collectionName, docId);
    const markerDocRef = doc(db, this.projectionsCollection, `${childId}_${projectionKey}`);

    return await runTransaction(db, async (transaction) => {
      // 1. Read projection marker
      const markerSnap = await transaction.get(markerDocRef);

      // 2. Read goal aggregate
      const goalSnap = await transaction.get(goalDocRef);
      const goals: ChildDailyGoals = goalSnap.exists()
        ? (goalSnap.data() as ChildDailyGoals)
        : DailyGoalPolicy.generateDefaultGoals(childId, dateStr);

      if (markerSnap.exists()) {
        return {
          applied: false,
          goalCompleted: false,
          allCompleted: goals.allCompleted,
          goals,
        };
      }

      // 3. Mutate target goal
      let goalCompleted = false;
      for (const goal of goals.goals) {
        if (goal.type === goalType && !goal.isCompleted) {
          goal.currentCount = Math.min(goal.targetCount, goal.currentCount + delta);
          if (goal.currentCount >= goal.targetCount) {
            goal.isCompleted = true;
            goalCompleted = true;
          }
        }
      }

      const allCompleted = goals.goals.every((g) => g.isCompleted);
      if (allCompleted && !goals.allCompleted) {
        goals.allCompleted = true;
      }

      goals.updatedAt = new Date().toISOString();

      // 4. Commit goal mutation and marker atomically
      transaction.set(goalDocRef, goals, { merge: true });
      transaction.set(markerDocRef, {
        childId,
        projectionKey,
        processedAt: new Date().toISOString(),
      });

      return {
        applied: true,
        goalCompleted,
        allCompleted: goals.allCompleted,
        goals,
      };
    });
  }
}
