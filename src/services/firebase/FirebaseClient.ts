/**
 * Firebase Client Adapter Wrapper
 * Safe initialization with fallback for environments without live Firebase credentials.
 */

export interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export class FirebaseClient {
  private static isConfigured(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    );
  }

  public static getStatus(): { isReady: boolean; message: string } {
    if (this.isConfigured()) {
      return { isReady: true, message: "Firebase client configured." };
    }
    return {
      isReady: false,
      message: "Running with in-memory adapter (Firebase credentials not set).",
    };
  }
}
