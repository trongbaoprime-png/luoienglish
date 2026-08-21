import { NextRequest, NextResponse } from "next/server";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";
import { LearningSession } from "@/types/learning";

/**
 * POST /api/learning/session/start
 * Authoritatively starts or resumes a server-side learning session.
 */
export async function POST(req: NextRequest) {
  try {
    const verifiedAccount = await verifyServerAccountSession(req);
    const parentUid = verifiedAccount.uid;

    const body = await req.json().catch(() => ({}));
    const { childId, lessonId } = body as { childId: string; lessonId: string };

    if (!childId || !lessonId) {
      return NextResponse.json(
        { success: false, message: "Thiếu childId hoặc lessonId." },
        { status: 400 }
      );
    }

    // 1. Authorize Child Ownership
    const childRepo = RepositoryFactory.getChildRepository();
    const authResult = await authorizeChildAccess(parentUid, childId, childRepo);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.statusCode }
      );
    }

    // 2. Verify Lesson Exists
    const curriculumRepo = RepositoryFactory.getCurriculumRepository();
    const lesson = await curriculumRepo.getLesson(lessonId);
    if (!lesson) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy bài học '${lessonId}'.` },
        { status: 404 }
      );
    }

    // 3. Check for existing in_progress session or create new authoritative session
    const sessionRepo = RepositoryFactory.getLearningSessionRepository();
    const existingSession = await sessionRepo.getActiveSession(childId, lessonId);

    if (existingSession) {
      return NextResponse.json({
        success: true,
        message: "Khôi phục phiên học đang diễn ra thành công.",
        data: { session: existingSession },
      });
    }

    const now = new Date().toISOString();
    const newSession: LearningSession = {
      id: `ls_${childId}_${lessonId}_${Date.now()}`,
      childId,
      lessonId,
      status: "in_progress",
      currentActivityIndex: 0,
      completedActivityIds: [],
      evidences: [],
      totalStarsEarned: 0,
      totalXpEarned: 0,
      totalPetFoodEarned: 0,
      heartsRemaining: 5,
      maxHearts: 5,
      startedAt: now,
      updatedAt: now,
      version: 1,
    };

    const created = await sessionRepo.createSession(newSession);

    return NextResponse.json({
      success: true,
      message: "Khởi tạo phiên học mới thành công.",
      data: { session: created },
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi khởi tạo phiên học.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
