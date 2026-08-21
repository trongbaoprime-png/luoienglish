import { NextRequest, NextResponse } from "next/server";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";
import { DailyReviewService } from "@/services/adaptive/DailyReviewService";
import { ReviewActivityBuilder } from "@/domain/adaptive/ReviewActivityBuilder";
import { ReviewSession, ReviewSessionItem } from "@/types/adaptiveReview";

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

    const childRepo = RepositoryFactory.getChildRepository();
    const authResult = await authorizeChildAccess(parentUid, childId, childRepo);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.statusCode }
      );
    }

    const reviewSessionRepo = RepositoryFactory.getReviewSessionRepository();
    const existingActive = await reviewSessionRepo.getActiveSession(childId);
    if (existingActive) {
      return NextResponse.json({
        success: true,
        data: { session: existingActive },
      });
    }

    // Generate authoritative queue
    const queue = await DailyReviewService.getDailyReviewQueue(parentUid, childId);
    const curriculumRepo = RepositoryFactory.getCurriculumRepository();

    const sessionItems: ReviewSessionItem[] = [];
    const sessionId = `rev_sess_${childId}_${Date.now()}`;

    for (let i = 0; i < queue.items.length; i++) {
      const rec = queue.items[i]!;
      const kItem = await curriculumRepo.getKnowledgeItem(rec.knowledgeId);
      if (!kItem) continue;

      const variant =
        kItem.recallVariants.find((v) => v.id === rec.contextVariantId) ||
        kItem.recallVariants[0] || {
          id: `var_${kItem.id}_default`,
          contextType: rec.reviewMode,
          promptText: kItem.primaryText,
          promptTextVi: kItem.vietnameseMeaning,
          scenarioDescription: "Ôn tập kiến thức cùng Chú Lười",
          expectedResponse: kItem.primaryText,
        };

      const activity = ReviewActivityBuilder.buildActivity(
        kItem,
        variant,
        rec.targetSkill,
        rec.difficulty,
        sessionId
      );

      sessionItems.push({
        id: `rev_item_${i + 1}_${rec.knowledgeId}`,
        knowledgeId: rec.knowledgeId,
        activity,
        recommendation: rec,
        completed: false,
      });
    }

    if (sessionItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy nội dung ôn tập phù hợp." },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const newSession: ReviewSession = {
      id: sessionId,
      childId,
      items: sessionItems,
      currentActivityIndex: 0,
      completedItemIds: [],
      evidences: [],
      totalStarsEarned: 0,
      totalXpEarned: 0,
      totalPetFoodEarned: 0,
      heartsRemaining: 5,
      maxHearts: 5,
      startedAt: now,
      updatedAt: now,
      status: "in_progress",
      version: 1,
    };

    await reviewSessionRepo.createSession(newSession);

    return NextResponse.json({
      success: true,
      message: "Khởi tạo phiên ôn tập thành công.",
      data: { session: newSession },
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi khởi tạo phiên ôn tập.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
