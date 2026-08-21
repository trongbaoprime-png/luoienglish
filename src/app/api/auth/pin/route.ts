import { NextRequest, NextResponse } from "next/server";
import { ParentalGateService } from "@/services/auth/ParentalGateService";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { verifyFirebaseIdToken, ServerAuthError } from "@/services/auth/serverAuth";

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce verified server identity from Firebase ID token (Never trust client body parentUid)
    const verifiedToken = await verifyFirebaseIdToken(req);
    const parentUid = verifiedToken.uid;

    const body = await req.json().catch(() => ({}));
    const { action, pin } = body;

    const userRepo = RepositoryFactory.getUserRepository();
    const gateService = new ParentalGateService(userRepo);

    if (action === "verify") {
      if (!pin) {
        return NextResponse.json(
          { success: false, message: "Vui lòng nhập mã PIN." },
          { status: 400 }
        );
      }
      const result = await gateService.verifyPin(parentUid, pin);
      return NextResponse.json(result, { status: result.success ? 200 : 401 });
    }

    if (action === "set") {
      if (!pin) {
        return NextResponse.json(
          { success: false, message: "Vui lòng cung cấp mã PIN mới." },
          { status: 400 }
        );
      }
      await gateService.setPin(parentUid, pin);
      return NextResponse.json({
        success: true,
        message: "Thiết lập mã PIN phụ huynh thành công.",
      });
    }

    if (action === "reset") {
      await gateService.resetPin(parentUid);
      return NextResponse.json({
        success: true,
        message: "Xóa mã PIN thành công. Bạn có thể thiết lập mã PIN mới.",
      });
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
