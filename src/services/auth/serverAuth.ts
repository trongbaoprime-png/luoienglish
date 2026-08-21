import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { FirebaseAdmin } from "@/services/firebase/FirebaseAdmin";
import { IChildRepository } from "@/repositories/interfaces/IChildRepository";
import { ChildProfile } from "@/types/student";
import { ParentModeSessionService } from "./ParentModeSessionService";

export interface VerifiedAuthToken {
  uid: string;
  email?: string;
  role: "parent" | "admin";
}

export class ServerAuthError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = "ServerAuthError";
    this.statusCode = statusCode;
  }
}

export interface IIdTokenVerifier {
  verifyToken(idToken: string): Promise<VerifiedAuthToken>;
}

export class FirebaseIdTokenVerifier implements IIdTokenVerifier {
  public async verifyToken(idToken: string): Promise<VerifiedAuthToken> {
    // Strictly reject mock tokens in production runtime with 401
    if (idToken.startsWith("mock_token_")) {
      throw new ServerAuthError(
        "Token xác thực không hợp lệ: Không chấp nhận mock token trong môi trường vận hành thực tế.",
        401
      );
    }

    if (!FirebaseAdmin.isConfigured()) {
      throw new ServerAuthError("Dịch vụ xác thực máy chủ chưa được cấu hình.", 500);
    }

    try {
      const adminApp = FirebaseAdmin.getApp();
      const auth = getAuth(adminApp);
      const decodedToken = await auth.verifyIdToken(idToken, true);

      const role: "parent" | "admin" = decodedToken.role === "admin" ? "admin" : "parent";

      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("auth/id-token-expired")) {
        throw new ServerAuthError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", 401);
      }
      if (message.includes("auth/id-token-revoked")) {
        throw new ServerAuthError("Token đã bị thu hồi. Vui lòng đăng nhập lại.", 401);
      }
      throw new ServerAuthError("Token xác thực không hợp lệ hoặc đã bị chỉnh sửa.", 401);
    }
  }
}

/**
 * Test ID Token Verifier for isolated automated unit tests only
 */
export class TestIdTokenVerifier implements IIdTokenVerifier {
  public async verifyToken(idToken: string): Promise<VerifiedAuthToken> {
    if (idToken.startsWith("mock_token_")) {
      const mockUid = idToken.replace("mock_token_", "");
      const role: "parent" | "admin" = mockUid.includes("admin") ? "admin" : "parent";
      return {
        uid: mockUid,
        email: `${mockUid}@luoienglish.com`,
        role,
      };
    }
    throw new ServerAuthError("Test token không hợp lệ.", 401);
  }
}

// Default verifier used by production runtime
let defaultTokenVerifier: IIdTokenVerifier = new FirebaseIdTokenVerifier();

export function setServerTokenVerifierForTesting(verifier: IIdTokenVerifier) {
  defaultTokenVerifier = verifier;
}

export function resetServerTokenVerifier() {
  defaultTokenVerifier = new FirebaseIdTokenVerifier();
}

/**
 * Extracts and verifies Firebase ID Token from Authorization header.
 * Derives trusted server identity without trusting request body.
 */
export async function verifyFirebaseIdToken(
  req: NextRequest | { headers: { get: (name: string) => string | null } },
  customVerifier?: IIdTokenVerifier
): Promise<VerifiedAuthToken> {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ServerAuthError("Yêu cầu xác thực: Thiếu Bearer token hợp lệ.", 401);
  }

  const idToken = authHeader.split("Bearer ")[1]?.trim();
  if (!idToken) {
    throw new ServerAuthError("Token xác thực không hợp lệ.", 401);
  }

  const verifier = customVerifier || defaultTokenVerifier;
  return await verifier.verifyToken(idToken);
}

/**
 * Verifies that the request contains a valid, unexpired Parent Mode Session cookie / header
 */
export function verifyParentModeSession(
  req: NextRequest | { cookies?: { get: (name: string) => { value: string } | undefined }; headers: { get: (name: string) => string | null } },
  parentUid: string
): void {
  // Extract from cookie or custom header
  let sessionToken: string | undefined = undefined;
  
  if ("cookies" in req && req.cookies) {
    sessionToken = req.cookies.get("parent_mode_session")?.value;
  }
  
  if (!sessionToken) {
    sessionToken = req.headers.get("x-parent-mode-session") || undefined;
  }

  const result = ParentModeSessionService.verifySession(sessionToken, parentUid);
  if (!result.valid) {
    throw new ServerAuthError(
      result.reason || "Khu vực phụ huynh đang bị khóa. Vui lòng nhập mã PIN.",
      403
    );
  }
}

export interface ChildAuthorizationResult {
  authorized: boolean;
  child?: ChildProfile;
  error?: string;
  statusCode: number;
}

/**
 * Verifies that the authenticated parent owns the requested child profile
 */
export async function authorizeChildAccess(
  trustedParentUid: string,
  childId: string,
  childRepo: IChildRepository
): Promise<ChildAuthorizationResult> {
  if (!trustedParentUid || !childId) {
    return {
      authorized: false,
      statusCode: 400,
      error: "Thiếu thông tin xác thực phụ huynh hoặc mã học sinh.",
    };
  }

  const child = await childRepo.findById(childId);
  if (!child) {
    return {
      authorized: false,
      statusCode: 404,
      error: "Không tìm thấy hồ sơ học sinh yêu cầu.",
    };
  }

  if (child.parentUid !== trustedParentUid) {
    return {
      authorized: false,
      statusCode: 403,
      error: "Vi phạm quyền truy cập: Bạn không có quyền quản trị học sinh này.",
    };
  }

  return {
    authorized: true,
    statusCode: 200,
    child,
  };
}
