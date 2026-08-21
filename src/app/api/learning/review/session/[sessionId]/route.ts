import { NextRequest, NextResponse } from "next/server";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;
    const { sessionId } = await params;

    const reviewSessionRepo = RepositoryFactory.getReviewSessionRepository();
    const session = await reviewSessionRepo.getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy phiên ôn tập '${sessionId}'.` },
        { status: 404 }
      );
    }

    const childRepo = RepositoryFactory.getChildRepository();
    const authResult = await authorizeChildAccess(parentUid, session.childId, childRepo);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.statusCode }
      );
    }

    return NextResponse.json({
      success: true,
      data: { session },
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi truy vấn phiên ôn tập.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
