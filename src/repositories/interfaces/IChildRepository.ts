import { ChildProfile } from "@/types/student";

export interface IChildRepository {
  findById(id: string): Promise<ChildProfile | null>;
  findByParentUid(parentUid: string): Promise<ChildProfile[]>;
  create(child: ChildProfile): Promise<ChildProfile>;
  update(id: string, updates: Partial<ChildProfile>): Promise<ChildProfile>;
  delete(id: string): Promise<boolean>;
}
