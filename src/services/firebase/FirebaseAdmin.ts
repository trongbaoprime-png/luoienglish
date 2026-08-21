/**
 * Firebase Admin Adapter (Server-only)
 */

export class FirebaseAdmin {
  public static isConfigured(): boolean {
    return Boolean(
      process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    );
  }

  public static getAdminStatus(): { isReady: boolean; message: string } {
    if (this.isConfigured()) {
      return { isReady: true, message: "Firebase Admin SDK configured." };
    }
    return {
      isReady: false,
      message: "Firebase Admin running in mock/offline mode.",
    };
  }
}
