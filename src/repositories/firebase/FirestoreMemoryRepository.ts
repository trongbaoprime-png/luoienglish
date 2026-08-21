import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { KnowledgeMastery } from "@/types/memory";
import { IMemoryRepository } from "../interfaces/IMemoryRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestoreMemoryRepository implements IMemoryRepository {
  private collectionName = "knowledgeMastery";

  public async getMastery(studentId: string, knowledgeId: string): Promise<KnowledgeMastery | null> {
    const db = FirebaseClient.getDb();
    const docId = `${studentId}_${knowledgeId}`;
    const docRef = doc(db, this.collectionName, docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as KnowledgeMastery;
  }

  public async getAllMasteryForStudent(studentId: string): Promise<KnowledgeMastery[]> {
    const db = FirebaseClient.getDb();
    const q = query(collection(db, this.collectionName), where("studentId", "==", studentId));
    const snap = await getDocs(q);
    const list: KnowledgeMastery[] = [];
    snap.forEach((d) => list.push(d.data() as KnowledgeMastery));
    return list;
  }

  public async saveMastery(mastery: KnowledgeMastery): Promise<KnowledgeMastery> {
    const db = FirebaseClient.getDb();
    const docId = `${mastery.studentId}_${mastery.knowledgeId}`;
    const docRef = doc(db, this.collectionName, docId);
    await setDoc(docRef, mastery, { merge: true });
    return mastery;
  }

  public async getDueReviewItems(studentId: string): Promise<KnowledgeMastery[]> {
    const all = await this.getAllMasteryForStudent(studentId);
    const nowTime = Date.now();
    return all.filter((m) => new Date(m.nextReviewAt).getTime() <= nowTime);
  }
}
