import { ChildProfile } from "@/types/student";
import { IChildRepository } from "../interfaces/IChildRepository";
import { InMemoryChildRepository } from "../memory/InMemoryChildRepository";

export class FirestoreChildRepository implements IChildRepository {
  private fallback = new InMemoryChildRepository();

  public async findById(id: string): Promise<ChildProfile | null> {
    return this.fallback.findById(id);
  }

  public async findByParentUid(parentUid: string): Promise<ChildProfile[]> {
    return this.fallback.findByParentUid(parentUid);
  }

  public async create(child: ChildProfile): Promise<ChildProfile> {
    return this.fallback.create(child);
  }

  public async update(id: string, updates: Partial<ChildProfile>): Promise<ChildProfile> {
    return this.fallback.update(id, updates);
  }

  public async delete(id: string): Promise<boolean> {
    return this.fallback.delete(id);
  }
}
