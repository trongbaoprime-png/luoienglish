import { NextRequest, NextResponse } from "next/server";
import {
  verifyServerAccountSession,
  ServerAuthError,
} from "@/services/auth/serverAuth";
import { RawActivityResponse } from "@/types/learning";
import { ReviewAttemptTransactionService } from "@/services/adaptive/ReviewAttemptTransactionService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;
    const { sessionId } = await params;

    const body = await req.json().catch(() => ({}));
    const {
      activityId,
      rawResponse,
      expectedVersion,
      attemptId,
      hintsUsed = 0,
      responseTimeMs = 2000,
    } = body as {
      activityId: string;
      rawResponse: RawActivityResponse;
      expectedVersion?: number;
      attemptId?: string;
      hintsUsed?: number;
      responseTimeMs?: number;
    };

    if (!activityId || !rawResponse) {
      return NextResponse.json(
        { success: false, message: "Thiếu activityId hoặc rawResponse." },
        { status: 400 }
      );
    }

    const result = await ReviewAttemptTransactionService.executeAttempt({
      parentUid,
      sessionId,
      activityId,
      rawResponse,
      expectedVersion,
      attemptId,
      hintsUsed,
      responseTimeMs,
    });

    return NextResponse.json({
      success: true,
      message: result.isIdempotentReplay
        ? "Kết quả đã được ghi nhận trước đó."
        : "Đánh giá câu trả lời ôn tập thành công.",
      data: {
        evaluation: result.evaluation,
        session: result.session,
        isIdempotentReplay: result.isIdempotentReplay,
      },
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi đánh giá ôn tập.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
