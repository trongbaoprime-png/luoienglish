import { UserProfile, PinRecord } from "@/types/auth";
import { IUserRepository } from "../interfaces/IUserRepository";

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, UserProfile> = new Map([
    [
      "parent_sample_1",
      {
        uid: "parent_sample_1",
        email: "parent@luoienglish.com",
        displayName: "Bố Mẹ Bé Bảo Nhi",
        role: "parent",
        preferences: {
          language: "vi",
          notifications: true,
        },
        isPinSet: false, // Clean default: no hard-coded default PIN
        securityVersion: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    [
      "admin_sample_1",
      {
        uid: "admin_sample_1",
        email: "admin@luoienglish.com",
        displayName: "Admin Content Factory",
        role: "admin",
        preferences: {
          language: "vi",
          notifications: true,
        },
        isPinSet: false,
        securityVersion: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  ]);

  private pinRecords: Map<string, PinRecord> = new Map();

  public async findById(uid: string): Promise<UserProfile | null> {
    const user = this.users.get(uid);
    return user ? { ...user } : null;
  }

  public async findByEmail(email: string): Promise<UserProfile | null> {
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u };
      }
    }
    return null;
  }

  public async create(user: UserProfile): Promise<UserProfile> {
    this.users.set(user.uid, { ...user });
    return { ...user };
  }

  public async update(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const existing = this.users.get(uid);
    if (!existing) {
      throw new Error(`User not found: ${uid}`);
    }

    const updated: UserProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.users.set(uid, updated);
    return { ...updated };
  }

  public async getPinRecord(uid: string): Promise<PinRecord | null> {
    const rec = this.pinRecords.get(uid);
    return rec ? { ...rec } : null;
  }

  public async savePinRecord(record: PinRecord): Promise<void> {
    this.pinRecords.set(record.parentUid, { ...record });
  }

  public async clearPinRecord(uid: string): Promise<void> {
    this.pinRecords.delete(uid);
  }
}
