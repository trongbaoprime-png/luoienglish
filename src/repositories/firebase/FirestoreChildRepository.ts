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

  public async findByParentUid(parentUid: string, includeArchived = false): Promise<ChildProfile[]> {
    const q = includeArchived
      ? query(this.getCollection(), where("parentUid", "==", parentUid))
      : query(
          this.getCollection(),
          where("parentUid", "==", parentUid),
          where("isArchived", "==", false)
        );

    const querySnapshot = await getDocs(q);
    const list: ChildProfile[] = [];
    querySnapshot.forEach((d) => {
      list.push(d.data() as ChildProfile);
    });
    return list;
  }

  public async countByParentUid(parentUid: string): Promise<number> {
    const activeChildren = await this.findByParentUid(parentUid, false);
    return activeChildren.length;
  }

  public async create(child: ChildProfile): Promise<ChildProfile> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, child.id);
    const newChild: ChildProfile = {
      ...child,
      isArchived: false,
      createdAt: child.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, newChild);
    return newChild;
  }

  public async update(id: string, updates: Partial<ChildProfile>): Promise<ChildProfile> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Child not found: ${id}`);
    }

    // SEC-AUTH-007: parentUid is strictly immutable
    if (updates.parentUid && updates.parentUid !== existing.parentUid) {
      throw new Error("Vi phạm bảo mật: Không được phép thay đổi parentUid của học sinh.");
    }

    const safeUpdates = { ...updates };
    delete safeUpdates.parentUid;
    delete safeUpdates.id;

    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...safeUpdates,
      updatedAt: new Date().toISOString(),
    });

    const updated = await this.findById(id);
    if (!updated) throw new Error(`Child not found after update: ${id}`);
    return updated;
  }

  public async archive(id: string): Promise<ChildProfile> {
    return await this.update(id, { isArchived: true });
  }

  public async delete(id: string): Promise<boolean> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
    return true;
  }
}
