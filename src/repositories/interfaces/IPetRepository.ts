import { Pet } from "@/types/pet";

export interface IPetRepository {
  findByChildId(childId: string): Promise<Pet | null>;
  create(pet: Pet): Promise<Pet>;
  update(id: string, updates: Partial<Pet>): Promise<Pet>;
}
