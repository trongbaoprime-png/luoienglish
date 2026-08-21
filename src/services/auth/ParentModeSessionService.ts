import crypto from "crypto";
import { ParentModeSession } from "@/types/auth";

export class ParentModeSessionService {
  private static SESSION_TTL_MS = 15 * 60 * 1000; // 15 minutes
  private static SECRET_KEY =
    process.env.PARENT_SESSION_SECRET || "luoi_parent_mode_session_secret_fixed_key_2026";

  /**
   * Generates a signed, short-lived ParentModeSession token
   */
  public static createSession(parentUid: string): {
    session: ParentModeSession;
    token: string;
  } {
    const sessionId = crypto.randomBytes(16).toString("hex");
    const now = Date.now();
    const createdAt = new Date(now).toISOString();
    const expiresAt = new Date(now + this.SESSION_TTL_MS).toISOString();

    const session: ParentModeSession = {
      sessionId,
      parentUid,
      createdAt,
      expiresAt,
    };

    const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", this.SECRET_KEY)
      .update(payload)
      .digest("base64url");

    const token = `${payload}.${signature}`;

    return { session, token };
  }

  /**
   * Verifies that the token is authentic, unexpired, and strictly belongs to expectedParentUid
   */
  public static verifySession(
    token: string | undefined | null,
    expectedParentUid: string
  ): { valid: boolean; session?: ParentModeSession; reason?: string } {
    if (!token) {
      return { valid: false, reason: "Thiếu phiên mở khóa cổng phụ huynh (Parent Mode Session)." };
    }

    const parts = token.split(".");
    if (parts.length !== 2) {
      return { valid: false, reason: "Định dạng phiên không hợp lệ." };
    }

    const [payload, signature] = parts;
    if (!payload || !signature) {
      return { valid: false, reason: "Định dạng phiên không hợp lệ." };
    }

    const expectedSignature = crypto
      .createHmac("sha256", this.SECRET_KEY)
      .update(payload)
      .digest("base64url");

    // Constant-time signature verification
    const sigA = Buffer.from(signature);
    const sigB = Buffer.from(expectedSignature);
    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      return { valid: false, reason: "Chữ ký phiên mở khóa không hợp lệ." };
    }

    try {
      const decodedJson = Buffer.from(payload, "base64url").toString("utf8");
      const session = JSON.parse(decodedJson) as ParentModeSession;

      // Check ownership
      if (session.parentUid !== expectedParentUid) {
        return {
          valid: false,
          reason: "Phiên mở khóa không thuộc về phụ huynh đang đăng nhập.",
        };
      }

      // Check expiry
      const now = Date.now();
      const expiresAtMs = new Date(session.expiresAt).getTime();
      if (now > expiresAtMs) {
        return { valid: false, reason: "Phiên mở khóa cổng phụ huynh đã hết hạn." };
      }

      return { valid: true, session };
    } catch {
      return { valid: false, reason: "Dữ liệu phiên mở khóa bị hỏng." };
    }
  }
}
