import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { StudentProgress } from "@/types/student";
import { IProgressRepository } from "../interfaces/IProgressRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestoreProgressRepository implements IProgressRepository {
  private collectionName = "studentProgress";

  public async getProgress(childId: string, lessonId: string): Promise<StudentProgress | null> {
    const db = FirebaseClient.getDb();
    const docId = `${childId}_${lessonId}`;
    const docRef = doc(db, this.collectionName, docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as StudentProgress;
  }

  public async getAllProgressForChild(childId: string): Promise<StudentProgress[]> {
    const db = FirebaseClient.getDb();
    const q = query(collection(db, this.collectionName), where("childId", "==", childId));
    const snap = await getDocs(q);
    const list: StudentProgress[] = [];
    snap.forEach((d) => list.push(d.data() as StudentProgress));
    return list;
  }

  public async saveProgress(progress: StudentProgress): Promise<StudentProgress> {
    const db = FirebaseClient.getDb();
    const docId = `${progress.childId}_${progress.lessonId}`;
    const docRef = doc(db, this.collectionName, docId);
    await setDoc(docRef, progress, { merge: true });
    return progress;
  }
}
