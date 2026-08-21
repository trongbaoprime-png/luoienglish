import { Pet } from "@/types/pet";
import { IPetRepository } from "../interfaces/IPetRepository";
import { InMemoryPetRepository } from "../memory/InMemoryPetRepository";

export class FirestorePetRepository implements IPetRepository {
  private fallback = new InMemoryPetRepository();

  public async findByChildId(childId: string): Promise<Pet | null> {
    return this.fallback.findByChildId(childId);
  }

  public async create(pet: Pet): Promise<Pet> {
    return this.fallback.create(pet);
  }

  public async update(id: string, updates: Partial<Pet>): Promise<Pet> {
    return this.fallback.update(id, updates);
  }
}
