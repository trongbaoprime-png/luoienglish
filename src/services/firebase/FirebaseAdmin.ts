import { initializeApp, getApps, App, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

export class FirebaseAdmin {
  private static app: App | null = null;
  private static db: Firestore | null = null;

  public static isConfigured(): boolean {
    return Boolean(
      process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
    );
  }

  public static getApp(): App {
    if (!this.app) {
      const apps = getApps();
      if (apps.length > 0 && apps[0]) {
        this.app = apps[0];
        return this.app;
      }

      if (this.isConfigured()) {
        const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n");
        this.app = initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey,
          }),
        });
      } else {
        throw new Error(
          "Firebase Admin SDK is not configured. Missing server-side credentials."
        );
      }
    }
    return this.app;
  }

  public static getFirestore(): Firestore {
    if (!this.db) {
      const app = this.getApp();
      this.db = getFirestore(app);
    }
    return this.db;
  }

  public static getAdminStatus(): { isReady: boolean; message: string } {
    if (this.isConfigured()) {
      return { isReady: true, message: "Firebase Admin SDK is configured." };
    }
    return {
      isReady: false,
      message: "Firebase Admin SDK running in offline/mock environment.",
    };
  }
}
