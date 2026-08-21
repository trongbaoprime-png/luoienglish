import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { ChildProfile } from "@/types/student";
import { IChildRepository } from "../interfaces/IChildRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestoreChildRepository implements IChildRepository {
  private collectionName = "children";

  private getCollection() {
    const db = FirebaseClient.getDb();
    return collection(db, this.collectionName);
  }

  public async findById(id: string): Promise<ChildProfile | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as ChildProfile;
  }

  public async findByParentUid(parentUid: string): Promise<ChildProfile[]> {
    const q = query(this.getCollection(), where("parentUid", "==", parentUid));
    const querySnapshot = await getDocs(q);
    const list: ChildProfile[] = [];
    querySnapshot.forEach((d) => {
      list.push(d.data() as ChildProfile);
    });
    return list;
  }

  public async create(child: ChildProfile): Promise<ChildProfile> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, child.id);
    await setDoc(docRef, child);
    return child;
  }

  public async update(id: string, updates: Partial<ChildProfile>): Promise<ChildProfile> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, updates);
    const updated = await this.findById(id);
    if (!updated) throw new Error(`Child not found after update: ${id}`);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
    return true;
  }
}
