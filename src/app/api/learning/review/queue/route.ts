import { NextRequest, NextResponse } from "next/server";
import { verifyServerAccountSession, ServerAuthError } from "@/services/auth/serverAuth";
import { DailyReviewService } from "@/services/adaptive/DailyReviewService";

export async function POST(req: NextRequest) {
  try {
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;

    const body = await req.json().catch(() => ({}));
    const { childId } = body as { childId: string };

    if (!childId) {
      return NextResponse.json(
        { success: false, message: "Thiếu childId hợp lệ." },
        { status: 400 }
      );
    }

    const queue = await DailyReviewService.getDailyReviewQueue(parentUid, childId);

    return NextResponse.json({
      success: true,
      data: { queue },
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi tạo danh sách ôn tập.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
