import { NextRequest, NextResponse } from "next/server";
import { ParentalGateService } from "@/services/auth/ParentalGateService";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyFirebaseIdToken,
  verifyParentModeSession,
  ServerAuthError,
} from "@/services/auth/serverAuth";

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce verified server identity from Firebase ID token
    const verifiedToken = await verifyFirebaseIdToken(req);
    const parentUid = verifiedToken.uid;

    const body = await req.json().catch(() => ({}));
    const { action, pin } = body;

    const userRepo = RepositoryFactory.getUserRepository();
    const gateService = new ParentalGateService(userRepo);

    // ACTION: VERIFY PIN -> Creates & sets short-lived HttpOnly ParentModeSession cookie
    if (action === "verify") {
      if (!pin) {
        return NextResponse.json(
          { success: false, message: "Vui lòng nhập mã PIN." },
          { status: 400 }
        );
      }
      const result = await gateService.verifyPin(parentUid, pin);

      if (result.success && result.parentModeSessionToken) {
        const response = NextResponse.json(
          {
            success: true,
            isLocked: false,
            message: "Xác thực mã PIN phụ huynh thành công.",
          },
          { status: 200 }
        );

        // Set HttpOnly, Secure, SameSite=Lax cookie for 15 minutes (900 seconds)
        response.cookies.set("parent_mode_session", result.parentModeSessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 900,
        });

        return response;
      }

      return NextResponse.json(result, { status: 401 });
    }

    // ACTION: SET PIN (First setup or update)
    if (action === "set") {
      if (!pin) {
        return NextResponse.json(
          { success: false, message: "Vui lòng cung cấp mã PIN mới." },
          { status: 400 }
        );
      }

      const existingUser = await userRepo.findById(parentUid);
      if (existingUser?.isPinSet) {
        // If updating an existing PIN, require active ParentModeSession
        verifyParentModeSession(req, parentUid);
      }

      await gateService.setPin(parentUid, pin);

      return NextResponse.json({
        success: true,
        message: "Thiết lập mã PIN phụ huynh thành công.",
      });
    }

    // ACTION: RESET PIN -> Requires active Parent Mode Session (Child Mode cannot reset)
    if (action === "reset") {
      verifyParentModeSession(req, parentUid);

      await gateService.resetPin(parentUid);

      const response = NextResponse.json({
        success: true,
        message: "Xóa mã PIN thành công. Bạn có thể thiết lập mã PIN mới.",
      });

      // Clear session cookie on PIN reset
      response.cookies.delete("parent_mode_session");
      return response;
    }

    // ACTION: LOCK PARENT MODE -> Clears parent_mode_session cookie when switching to Child Mode
    if (action === "lock") {
      const response = NextResponse.json({
        success: true,
        message: "Đã khóa Chế độ Phụ Huynh.",
      });
      response.cookies.delete("parent_mode_session");
      return response;
    }

    return NextResponse.json(
      { success: false, message: "Hành động không hợp lệ." },
      { status: 400 }
    );
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const errorMsg = err instanceof Error ? err.message : "Đã xảy ra lỗi hệ thống.";
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
