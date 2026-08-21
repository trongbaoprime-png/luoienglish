import crypto from "crypto";
import { VerifiedAuthToken, ServerAuthError } from "./serverAuth";

export class ServerAccountSessionService {
  private static SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
  private static testSecret: string | null = null;

  public static setSecretForTesting(secret: string | null) {
    this.testSecret = secret;
  }

  public static resetSecretForTesting() {
    this.testSecret = null;
  }

  private static getSecret(): string {
    if (this.testSecret) {
      return this.testSecret;
    }

    const envSecret = process.env.PARENT_SESSION_SECRET;
    if (!envSecret || envSecret.length < 32) {
      if (process.env.NODE_ENV === "test") {
        return "test_parent_mode_session_secret_32_chars_long_minimum!";
      }
      throw new ServerAuthError(
        "[ServerAccountSessionService] FATAL: PARENT_SESSION_SECRET is missing or shorter than 32 characters. Failing closed.",
        500
      );
    }

    return envSecret;
  }

  /**
   * Creates a signed Server Account Session token
   */
  public static createAccountSession(
    uid: string,
    email?: string,
    role: "parent" | "admin" = "parent"
  ): string {
    const secret = this.getSecret();
    const now = Date.now();
    const payloadData = {
      uid,
      email: email || `${uid}@luoienglish.com`,
      role,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + this.SESSION_TTL_MS).toISOString(),
    };

    const payload = Buffer.from(JSON.stringify(payloadData)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", secret)
      .update(`account_session:${payload}`)
      .digest("base64url");

    return `${payload}.${signature}`;
  }

  /**
   * Verifies the authenticity and expiration of a Server Account Session token
   */
  public static verifyAccountSession(token: string | undefined | null): VerifiedAuthToken {
    if (!token) {
      throw new ServerAuthError("Yêu cầu đăng nhập: Thiếu phiên tài khoản máy chủ.", 401);
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
      throw new ServerAuthError("Định dạng phiên tài khoản không hợp lệ.", 401);
    }

    const [payload, signature] = parts;
    if (!payload || !signature) {
      throw new ServerAuthError("Định dạng phiên tài khoản không hợp lệ.", 401);
    }

    const secret = this.getSecret();
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`account_session:${payload}`)
      .digest("base64url");

    const sigA = Buffer.from(signature);
    const sigB = Buffer.from(expectedSignature);
    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      throw new ServerAuthError("Chữ ký phiên tài khoản không hợp lệ.", 401);
    }

    try {
      const decodedJson = Buffer.from(payload, "base64url").toString("utf8");
      const data = JSON.parse(decodedJson) as {
        uid: string;
        email?: string;
        role: "parent" | "admin";
        expiresAt: string;
      };

      if (!data.uid || !data.expiresAt) {
        throw new ServerAuthError("Dữ liệu phiên tài khoản không đầy đủ.", 401);
      }

      const now = Date.now();
      const expiresAtMs = new Date(data.expiresAt).getTime();
      if (now > expiresAtMs) {
        throw new ServerAuthError("Phiên đăng nhập tài khoản đã hết hạn.", 401);
      }

      return {
        uid: data.uid,
        email: data.email,
        role: data.role || "parent",
      };
    } catch (err: unknown) {
      if (err instanceof ServerAuthError) throw err;
      throw new ServerAuthError("Dữ liệu phiên tài khoản bị hỏng.", 401);
    }
  }
}
