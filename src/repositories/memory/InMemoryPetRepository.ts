import { Pet } from "@/types/pet";
import { IPetRepository } from "../interfaces/IPetRepository";

export class InMemoryPetRepository implements IPetRepository {
  private pets: Map<string, Pet> = new Map([
    [
      "child_sample_1",
      {
        id: "pet_sample_1",
        childId: "child_sample_1",
        name: "Lười Bông",
        stage: "baby",
        stats: {
          happiness: 85,
          energy: 90,
          knowledge: 120,
          bond: 70,
        },
        equippedCosmetics: {
          hat: "cozy_knit_cap",
        },
        lastFedAt: new Date().toISOString(),
        lastInteractedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ],
  ]);

  public async findByChildId(childId: string): Promise<Pet | null> {
    return this.pets.get(childId) || null;
  }

  public async create(pet: Pet): Promise<Pet> {
    this.pets.set(pet.childId, pet);
    return pet;
  }

  public async update(id: string, updates: Partial<Pet>): Promise<Pet> {
    for (const [childId, pet] of this.pets.entries()) {
      if (pet.id === id) {
        const updated = { ...pet, ...updates };
        this.pets.set(childId, updated);
        return updated;
      }
    }
    throw new Error(`Pet not found: ${id}`);
  }
}
