import { UserProfile } from "@/types/auth";
import { IAuthService } from "./AuthService";
import { IUserRepository } from "@/repositories/interfaces/IUserRepository";

export class MockAuthService implements IAuthService {
  private userRepo: IUserRepository;
  private currentUser: UserProfile | null = null;
  private listeners: ((user: UserProfile | null) => void)[] = [];

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  public async registerWithEmail(
    email: string,
    passwordValue: string,
    displayName: string
  ): Promise<UserProfile> {
    if (!passwordValue) {
      throw new Error("Mật khẩu không được để trống.");
    }
    const newUser: UserProfile = {
      uid: `mock_user_${Date.now()}`,
      email,
      displayName,
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.userRepo.create(newUser);
    this.currentUser = newUser;
    this.notifyListeners();
    return newUser;
  }

  public async loginWithEmail(email: string, passwordValue: string): Promise<UserProfile> {
    if (!passwordValue) {
      throw new Error("Mật khẩu không được để trống.");
    }
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("Email hoặc mật khẩu không chính xác.");
    }
    this.currentUser = user;
    this.notifyListeners();
    return user;
  }

  public async loginWithGoogle(): Promise<UserProfile> {
    const googleUser: UserProfile = {
      uid: "mock_google_parent_1",
      email: "google.parent@luoienglish.com",
      displayName: "Phụ Huynh Google",
      role: "parent",
      preferences: { language: "vi", notifications: true },
      isPinSet: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.userRepo.create(googleUser);
    this.currentUser = googleUser;
    this.notifyListeners();
    return googleUser;
  }

  public async logout(): Promise<void> {
    this.currentUser = null;
    this.notifyListeners();
  }

  public async resetPassword(email: string): Promise<void> {
    if (!email) {
      throw new Error("Email không được để trống.");
    }
    // Mock password reset successful
  }

  public async getCurrentUserProfile(): Promise<UserProfile | null> {
    return this.currentUser;
  }

  public onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  public async getIdToken(): Promise<string | null> {
    return this.currentUser ? `mock_token_${this.currentUser.uid}` : null;
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }
}
