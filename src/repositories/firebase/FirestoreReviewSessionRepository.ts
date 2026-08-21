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
import { IReviewSessionRepository } from "../interfaces/IReviewSessionRepository";
import { ReviewSession } from "@/types/adaptiveReview";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestoreReviewSessionRepository implements IReviewSessionRepository {
  private collectionName = "reviewSessions";

  public async createSession(session: ReviewSession): Promise<ReviewSession> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, session.id);
    await setDoc(docRef, session);
    return session;
  }

  public async getSession(sessionId: string): Promise<ReviewSession | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, sessionId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as ReviewSession;
  }

  public async saveSession(session: ReviewSession): Promise<ReviewSession> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, session.id);
    await runTransaction(db, async (t) => {
      const snap = await t.get(docRef);
      if (snap.exists()) {
        const current = snap.data() as ReviewSession;
        if (session.version <= current.version) {
          throw new Error(
            `Xung đột phiên ôn tập (Stale write): Phiên bản hiện tại là ${current.version}, nhận được ${session.version}.`
          );
        }
      }
      t.set(docRef, session);
    });
    return session;
  }

  public async getActiveSession(childId: string): Promise<ReviewSession | null> {
    const db = FirebaseClient.getDb();
    const q = query(
      collection(db, this.collectionName),
      where("childId", "==", childId),
      where("status", "==", "in_progress"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0]!.data() as ReviewSession;
  }
}
