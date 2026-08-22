import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  runTransaction,
} from "firebase/firestore";
import { ChildAchievementProgress } from "@/types/achievement";
import { AchievementPolicy } from "@/domain/rewards/AchievementPolicy";
import {
  ApplyAchievementProjectionParams,
  ApplyAchievementProjectionResult,
  IAchievementRepository,
} from "../interfaces/IAchievementRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestoreAchievementRepository implements IAchievementRepository {
  private collectionName = "childAchievements";
  private projectionsCollection = "achievementProjections";

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
   * Atomically reads projection marker and achievement document inside a Firestore transaction,
   * updates progress, determines unlock threshold, and commits progress + marker in ONE transaction.
   */
  public async applyProjection(
    params: ApplyAchievementProjectionParams
  ): Promise<ApplyAchievementProjectionResult> {
    const db = FirebaseClient.getDb();
    const { childId, achievementId, projectionKey, delta } = params;

    const docId = this.makeDocId(childId, achievementId);
    const achDocRef = doc(db, this.collectionName, docId);
    const markerDocRef = doc(db, this.projectionsCollection, `${childId}_${projectionKey}`);
    const def = AchievementPolicy.getAchievement(achievementId);

    return await runTransaction(db, async (transaction) => {
      // 1. Read marker
      const markerSnap = await transaction.get(markerDocRef);

      // 2. Read progress
      const achSnap = await transaction.get(achDocRef);
      const progress: ChildAchievementProgress = achSnap.exists()
        ? (achSnap.data() as ChildAchievementProgress)
        : {
            childId,
            achievementId,
            currentCount: 0,
            targetCount: def ? def.targetCount : 1,
            isUnlocked: false,
            rewardClaimed: false,
          };

      if (markerSnap.exists()) {
        return {
          applied: false,
          unlocked: false,
          definition: def,
          progress,
        };
      }

      // 3. Compute increment and unlock
      let newlyUnlocked = false;
      if (!progress.isUnlocked) {
        progress.currentCount += delta;
        if (progress.currentCount >= progress.targetCount) {
          progress.isUnlocked = true;
          progress.unlockedAt = new Date().toISOString();
          newlyUnlocked = true;
        }
      }

      // 4. Commit progress update + marker atomically
      transaction.set(achDocRef, progress, { merge: true });
      transaction.set(markerDocRef, {
        childId,
        projectionKey,
        processedAt: new Date().toISOString(),
      });

      return {
        applied: true,
        unlocked: newlyUnlocked,
        definition: def,
        progress,
      };
    });
  }
}
