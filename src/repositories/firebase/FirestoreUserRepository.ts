import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { UserProfile, PinRecord } from "@/types/auth";
import { IUserRepository } from "../interfaces/IUserRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestoreUserRepository implements IUserRepository {
  private usersCol = "users";
  private securityCol = "parentSecurity";

  public async findById(uid: string): Promise<UserProfile | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.usersCol, uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  }

  public async findByEmail(email: string): Promise<UserProfile | null> {
    const db = FirebaseClient.getDb();
    const q = query(collection(db, this.usersCol), where("email", "==", email.toLowerCase()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0]?.data() as UserProfile;
  }

  public async create(user: UserProfile): Promise<UserProfile> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.usersCol, user.uid);
    await setDoc(docRef, user);
    return user;
  }

  public async update(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.usersCol, uid);
    await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
    const updated = await this.findById(uid);
    if (!updated) throw new Error(`User not found after update: ${uid}`);
    return updated;
  }

  public async getPinRecord(uid: string): Promise<PinRecord | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.securityCol, uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as PinRecord;
  }

  public async savePinRecord(record: PinRecord): Promise<void> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.securityCol, record.parentUid);
    await setDoc(docRef, record, { merge: true });
  }

  public async clearPinRecord(uid: string): Promise<void> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.securityCol, uid);
    await setDoc(docRef, { pinHash: "", salt: "", failedAttempts: 0, updatedAt: new Date().toISOString() });
  }
}
