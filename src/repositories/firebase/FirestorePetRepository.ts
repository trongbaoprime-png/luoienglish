import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Pet } from "@/types/pet";
import { IPetRepository } from "../interfaces/IPetRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestorePetRepository implements IPetRepository {
  private collectionName = "pets";

  public async findByChildId(childId: string): Promise<Pet | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, childId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as Pet;
  }

  public async create(pet: Pet): Promise<Pet> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, pet.childId);
    await setDoc(docRef, pet);
    return pet;
  }

  public async update(id: string, updates: Partial<Pet>): Promise<Pet> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, updates);
    const updated = await this.findByChildId(id);
    if (!updated) throw new Error(`Pet not found after update: ${id}`);
    return updated;
  }
}
