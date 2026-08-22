import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { ChildAchievementProgress } from "@/types/achievement";
import { IAchievementRepository } from "../interfaces/IAchievementRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestoreAchievementRepository implements IAchievementRepository {
  private collectionName = "childAchievements";

  private makeDocId(childId: string, achievementId: string): string {
    return `${childId}_${achievementId}`;
  }

  public async getAchievements(childId: string): Promise<ChildAchievementProgress[]> {
    const db = FirebaseClient.getDb();
    const q = query(collection(db, this.collectionName), where("childId", "==", childId));
    const snap = await getDocs(q);
    const list: ChildAchievementProgress[] = [];
    snap.forEach((d) => list.push(d.data() as ChildAchievementProgress));
    return list;
  }

  public async getAchievement(
    childId: string,
    achievementId: string
  ): Promise<ChildAchievementProgress | null> {
    const db = FirebaseClient.getDb();
    const docId = this.makeDocId(childId, achievementId);
    const snap = await getDoc(doc(db, this.collectionName, docId));
    if (!snap.exists()) return null;
    return snap.data() as ChildAchievementProgress;
  }

  public async saveAchievement(
    progress: ChildAchievementProgress
  ): Promise<ChildAchievementProgress> {
    const db = FirebaseClient.getDb();
    const docId = this.makeDocId(progress.childId, progress.achievementId);
    await setDoc(doc(db, this.collectionName, docId), progress, { merge: true });
    return progress;
  }
}
