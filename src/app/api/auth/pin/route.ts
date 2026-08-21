import { NextRequest, NextResponse } from "next/server";
import { ParentalGateService } from "@/services/auth/ParentalGateService";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, parentUid, pin } = body;

    if (!parentUid) {
      return NextResponse.json(
        { success: false, message: "Yêu cầu định danh phụ huynh (parentUid)." },
        { status: 400 }
      );
    }

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
    const errorMsg = err instanceof Error ? err.message : "Đã xảy ra lỗi hệ thống.";
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}
