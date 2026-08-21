import { NextRequest, NextResponse } from "next/server";
import {
  verifyFirebaseIdToken,
  ServerAuthError,
} from "@/services/auth/serverAuth";
import { ServerAccountSessionService } from "@/services/auth/ServerAccountSessionService";

export async function POST(req: NextRequest) {
  try {
    const verifiedToken = await verifyFirebaseIdToken(req);
    const sessionToken = ServerAccountSessionService.createAccountSession(
      verifiedToken.uid,
      verifiedToken.email,
      verifiedToken.role
    );

    const response = NextResponse.json({
      success: true,
      user: {
        uid: verifiedToken.uid,
        email: verifiedToken.email,
        role: verifiedToken.role,
      },
    });

    // Set HttpOnly, Secure, SameSite=Lax auth_session cookie for 24 hours (86400s)
    response.cookies.set("auth_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi thiết lập phiên tài khoản.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Đã đăng xuất phiên tài khoản máy chủ.",
  });

  // Clear both account session and parent mode session cookies
  response.cookies.delete("auth_session");
  response.cookies.delete("parent_mode_session");

  return response;
}
