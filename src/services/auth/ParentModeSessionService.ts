import crypto from "crypto";
import { ParentModeSession } from "@/types/auth";
import { ServerAuthError } from "./serverAuth";

export class ParentModeSessionService {
  private static SESSION_TTL_MS = 15 * 60 * 1000; // 15 minutes
  private static MAX_ALLOWED_TTL_MS = 16 * 60 * 1000; // 16 minutes with clock skew
  private static CLOCK_SKEW_MS = 60 * 1000; // 1 minute allowed clock skew
  private static testSecret: string | null = null;

  public static setSecretForTesting(secret: string | null) {
    this.testSecret = secret;
  }

  public static resetSecretForTesting() {
    this.testSecret = null;
  }

  /**
   * Retrieves the configured PARENT_SESSION_SECRET.
   * FAIL-CLOSED: In production and development, throws immediately if unconfigured or insecure.
   */
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
        "[ParentModeSessionService] FATAL: PARENT_SESSION_SECRET is missing or shorter than 32 characters. Failing closed.",
        500
      );
    }

    return envSecret;
  }

  /**
   * Generates a signed, short-lived ParentModeSession token
   */
  public static createSession(
    parentUid: string,
    securityVersion = 1
  ): {
    session: ParentModeSession;
    token: string;
  } {
    const secret = this.getSecret();
    const sessionId = crypto.randomBytes(16).toString("hex");
    const now = Date.now();
    const createdAt = new Date(now).toISOString();
    const expiresAt = new Date(now + this.SESSION_TTL_MS).toISOString();

    const session: ParentModeSession = {
      sessionId,
      parentUid,
      securityVersion,
      createdAt,
      expiresAt,
    };

    const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
    const signature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");

    const token = `${payload}.${signature}`;

    return { session, token };
  }

  /**
   * Verifies that the token is authentic, unexpired, schema-valid, and matches expectedParentUid & securityVersion
   */
  public static verifySession(
    token: string | undefined | null,
    expectedParentUid: string,
    expectedSecurityVersion?: number
  ): { valid: boolean; session?: ParentModeSession; reason?: string } {
    if (!token) {
      return { valid: false, reason: "Thiếu phiên mở khóa cổng phụ huynh (Parent Mode Session)." };
    }

    let secret: string;
    try {
      secret = this.getSecret();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cấu hình bảo mật phiên chưa hợp lệ.";
      return { valid: false, reason: msg };
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
      .createHmac("sha256", secret)
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
      const session = JSON.parse(decodedJson) as Partial<ParentModeSession>;

      // 1. Strict Schema Validation
      if (
        !session.sessionId ||
        typeof session.sessionId !== "string" ||
        session.sessionId.length < 16 ||
        !session.parentUid ||
        typeof session.parentUid !== "string" ||
        typeof session.securityVersion !== "number" ||
        !session.createdAt ||
        !session.expiresAt
      ) {
        return { valid: false, reason: "Cấu trúc dữ liệu phiên không hợp lệ." };
      }

      // 2. Ownership check
      if (session.parentUid !== expectedParentUid) {
        return {
          valid: false,
          reason: "Phiên mở khóa không thuộc về phụ huynh đang đăng nhập.",
        };
      }

      // 3. Stateful Invalidation Check (securityVersion match)
      if (
        expectedSecurityVersion !== undefined &&
        session.securityVersion !== expectedSecurityVersion
      ) {
        return {
          valid: false,
          reason: "Mã PIN hoặc bảo mật tài khoản đã thay đổi. Phiên làm việc trước đó đã bị vô hiệu hóa.",
        };
      }

      const now = Date.now();
      const createdAtMs = new Date(session.createdAt).getTime();
      const expiresAtMs = new Date(session.expiresAt).getTime();

      // 4. Temporal Validity & Clock Skew checks
      if (isNaN(createdAtMs) || isNaN(expiresAtMs)) {
        return { valid: false, reason: "Dấu thời gian phiên không hợp lệ." };
      }

      // Reject future-created tokens beyond allowed skew
      if (createdAtMs > now + this.CLOCK_SKEW_MS) {
        return { valid: false, reason: "Dấu thời gian tạo phiên không hợp lệ (tương lai)." };
      }

      // Reject unreasonable TTL
      if (expiresAtMs - createdAtMs > this.MAX_ALLOWED_TTL_MS) {
        return { valid: false, reason: "Thời lượng phiên vượt quá giới hạn an toàn." };
      }

      // 5. Expiry Check
      if (now > expiresAtMs) {
        return { valid: false, reason: "Phiên mở khóa cổng phụ huynh đã hết hạn." };
      }

      return { valid: true, session: session as ParentModeSession };
    } catch {
      return { valid: false, reason: "Dữ liệu phiên mở khóa bị hỏng." };
    }
  }
}
