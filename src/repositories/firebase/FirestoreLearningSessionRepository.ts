import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  runTransaction,
  query,
  where,
  limit,
} from "firebase/firestore";
import { ILearningSessionRepository } from "../interfaces/ILearningSessionRepository";
import { LearningSession } from "@/types/learning";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestoreLearningSessionRepository implements ILearningSessionRepository {
  private collectionName = "learningSessions";

  private getCollection() {
    const db = FirebaseClient.getDb();
    return collection(db, this.collectionName);
  }

  public async createSession(session: LearningSession): Promise<LearningSession> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, session.id);
    await setDoc(docRef, session);
    return session;
  }

  public async getSession(sessionId: string): Promise<LearningSession | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, sessionId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as LearningSession;
  }

  public async saveSession(session: LearningSession): Promise<LearningSession> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, session.id);
    await runTransaction(db, async (t) => {
      const snap = await t.get(docRef);
      if (snap.exists()) {
        const current = snap.data() as LearningSession;
        if (session.version <= current.version) {
          throw new Error(`Xung đột phiên học (Stale write): Phiên bản hiện tại là ${current.version}, nhận được ${session.version}.`);
        }
      }
      t.set(docRef, session);
    });
    return session;
  }

  public async getActiveSession(childId: string, lessonId: string): Promise<LearningSession | null> {
    const db = FirebaseClient.getDb();
    const q = query(
      collection(db, this.collectionName),
      where("childId", "==", childId),
      where("lessonId", "==", lessonId),
      where("status", "==", "in_progress"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0]!.data() as LearningSession;
  }
}
