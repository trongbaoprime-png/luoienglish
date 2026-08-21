import { UserParent } from "@/types/student";

export interface IUserRepository {
  findById(uid: string): Promise<UserParent | null>;
  create(user: UserParent): Promise<UserParent>;
  update(uid: string, updates: Partial<UserParent>): Promise<UserParent>;
}
