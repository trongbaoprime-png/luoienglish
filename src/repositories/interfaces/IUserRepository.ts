import { UserProfile, PinRecord } from "@/types/auth";

export interface IUserRepository {
  findById(uid: string): Promise<UserProfile | null>;
  findByEmail(email: string): Promise<UserProfile | null>;
  create(user: UserProfile): Promise<UserProfile>;
  update(uid: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  
  // Server-side PIN security methods (PIN hash is NEVER stored in UserProfile)
  getPinRecord(uid: string): Promise<PinRecord | null>;
  savePinRecord(record: PinRecord): Promise<void>;
  clearPinRecord(uid: string): Promise<void>;
}
