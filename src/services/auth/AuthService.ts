import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { UserProfile } from "@/types/auth";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";
import { IUserRepository } from "@/repositories/interfaces/IUserRepository";

export interface IAuthService {
  registerWithEmail(email: string, pass: string, displayName: string): Promise<UserProfile>;
  loginWithEmail(email: string, pass: string): Promise<UserProfile>;
  loginWithGoogle(): Promise<UserProfile>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  getCurrentUserProfile(): Promise<UserProfile | null>;
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void;
  getIdToken(): Promise<string | null>;
}

export class FirebaseAuthService implements IAuthService {
  private userRepo: IUserRepository;

  constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  /**
   * Translates raw Firebase error codes into friendly Vietnamese messages
   */
  public static mapAuthError(error: unknown): string {
    if (!error || typeof error !== "object") {
      return "Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại.";
    }

    const err = error as { code?: string; message?: string };
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email hoặc mật khẩu không chính xác.";
      case "auth/email-already-in-use":
        return "Email này đã được đăng ký tài khoản. Vui lòng đăng nhập.";
      case "auth/weak-password":
        return "Mật khẩu quá ngắn. Vui lòng nhập tối thiểu 6 ký tự.";
      case "auth/invalid-email":
        return "Định dạng email không hợp lệ.";
      case "auth/popup-closed-by-user":
      case "auth/cancelled-popup-request":
        return "Đã hủy cửa sổ đăng nhập Google.";
      case "auth/network-request-failed":
        return "Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.";
      case "auth/too-many-requests":
        return "Quá nhiều lần thử không thành công. Vui lòng chờ ít phút.";
      default:
        return err.message || "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
    }
  }

  private async syncOrCreateUserProfile(fbUser: FirebaseUser): Promise<UserProfile> {
    const existing = await this.userRepo.findById(fbUser.uid);
    if (existing) {
      return existing;
    }

    const newUser: UserProfile = {
      uid: fbUser.uid,
      email: fbUser.email || "",
      displayName: fbUser.displayName || "Phụ huynh Lười English",
      photoURL: fbUser.photoURL || undefined,
      role: "parent",
      preferences: {
        language: "vi",
        notifications: true,
      },
      isPinSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return await this.userRepo.create(newUser);
  }

  public async registerWithEmail(
    email: string,
    pass: string,
    displayName: string
  ): Promise<UserProfile> {
    const auth = FirebaseClient.getAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const userProfile: UserProfile = {
      uid: cred.user.uid,
      email,
      displayName: displayName || "Phụ huynh",
      role: "parent",
      preferences: {
        language: "vi",
        notifications: true,
      },
      isPinSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return await this.userRepo.create(userProfile);
  }

  public async loginWithEmail(email: string, pass: string): Promise<UserProfile> {
    const auth = FirebaseClient.getAuth();
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return await this.syncOrCreateUserProfile(cred.user);
  }

  public async loginWithGoogle(): Promise<UserProfile> {
    const auth = FirebaseClient.getAuth();
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return await this.syncOrCreateUserProfile(cred.user);
  }

  public async logout(): Promise<void> {
    const auth = FirebaseClient.getAuth();
    await signOut(auth);
  }

  public async resetPassword(email: string): Promise<void> {
    const auth = FirebaseClient.getAuth();
    await sendPasswordResetEmail(auth, email);
  }

  public async getCurrentUserProfile(): Promise<UserProfile | null> {
    const auth = FirebaseClient.getAuth();
    const current = auth.currentUser;
    if (!current) return null;
    return await this.userRepo.findById(current.uid);
  }

  public onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void {
    const auth = FirebaseClient.getAuth();
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await this.syncOrCreateUserProfile(fbUser);
        callback(profile);
      } else {
        callback(null);
      }
    });
  }

  public async getIdToken(): Promise<string | null> {
    const auth = FirebaseClient.getAuth();
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  }
}
