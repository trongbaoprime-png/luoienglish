import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { ChildDailyGoals } from "@/types/dailyGoal";
import { IDailyGoalRepository } from "../interfaces/IDailyGoalRepository";
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
}
