import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export class FirebaseClient {
  private static app: FirebaseApp | null = null;
  private static db: Firestore | null = null;
  private static auth: Auth | null = null;

  public static isConfigured(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
  }

  public static getApp(): FirebaseApp {
    if (!this.app) {
      if (!this.isConfigured()) {
        throw new Error(
          "Firebase Client is not configured. Missing NEXT_PUBLIC_FIREBASE_API_KEY or NEXT_PUBLIC_FIREBASE_PROJECT_ID."
        );
      }
      this.app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    }
    return this.app;
  }

  public static getDb(): Firestore {
    if (!this.db) {
      const app = this.getApp();
      this.db = getFirestore(app);
    }
    return this.db;
  }

  public static getAuth(): Auth {
    if (!this.auth) {
      const app = this.getApp();
      this.auth = getAuth(app);
    }
    return this.auth;
  }

  public static getStatus(): { isReady: boolean; message: string } {
    if (this.isConfigured()) {
      return { isReady: true, message: "Firebase Client SDK is fully configured and initialized." };
    }
    return {
      isReady: false,
      message: "Firebase credentials not detected. Operating in local / test adapter mode.",
    };
  }
}
