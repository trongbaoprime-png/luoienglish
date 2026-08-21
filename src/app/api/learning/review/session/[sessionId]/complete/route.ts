import { NextRequest, NextResponse } from "next/server";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";
import { RewardTransaction } from "@/types/reward";

export async function POST(
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

    if (session.status === "completed") {
      return NextResponse.json({
        success: true,
        message: "Phiên ôn tập đã được hoàn thành trước đó.",
        data: {
          session,
          starsEarned: session.totalStarsEarned,
          xpEarned: session.totalXpEarned,
          petFoodEarned: session.totalPetFoodEarned,
        },
      });
    }

    // Anti-Skip verification: check all items completed
    const requiredItemIds = session.items.map((i) => i.id);
    const completedSet = new Set(session.completedItemIds || []);
    const isAllCompleted = requiredItemIds.every((id) => completedSet.has(id));

    if (!isAllCompleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Vi phạm tính toàn vẹn: Chưa hoàn thành tất cả thử thách ôn tập trong phiên.",
        },
        { status: 400 }
      );
    }

    // Authoritative rewards from trusted server evidences
    let authoritativeStars = 0;
    let authoritativeXp = 0;
    let authoritativePetFood = 0;

    for (const item of session.items) {
      const isEvidenced = session.evidences.some(
        (e) => e.activityId === item.activity.id && e.correct
      );
      if (isEvidenced) {
        authoritativeStars += item.activity.rewardPoints.stars;
        authoritativeXp += item.activity.rewardPoints.xp;
        authoritativePetFood += item.activity.rewardPoints.petFood;
      }
    }

    // Commit rewards idempotently
    const rewardRepo = RepositoryFactory.getRewardRepository();
    const idempotencyKey = `claim_review_${session.childId}_${session.id}`;

    const rewardTx: RewardTransaction = {
      id: `tx_rev_${Date.now()}`,
      childId: session.childId,
      triggerEvent: "review_completed",
      sourceEntityId: session.id,
      starsDelta: authoritativeStars,
      xpDelta: authoritativeXp,
      coinsDelta: 0,
      petFoodDelta: authoritativePetFood,
      description: "Hoàn thành phiên ôn tập thích ứng cùng Chú Lười",
      createdAt: new Date().toISOString(),
      idempotencyKey,
    };

    await rewardRepo.recordTransaction(rewardTx);

    const now = new Date().toISOString();
    const completedSession = {
      ...session,
      status: "completed" as const,
      totalStarsEarned: authoritativeStars,
      totalXpEarned: authoritativeXp,
      totalPetFoodEarned: authoritativePetFood,
      completedAt: now,
      updatedAt: now,
      version: session.version + 1,
    };

    await reviewSessionRepo.saveSession(completedSession);

    return NextResponse.json({
      success: true,
      message: "Hoàn tất phiên ôn tập và nhận thưởng thành công.",
      data: {
        session: completedSession,
        starsEarned: authoritativeStars,
        xpEarned: authoritativeXp,
        petFoodEarned: authoritativePetFood,
      },
    });
  } catch (err: unknown) {
    if (err instanceof ServerAuthError) {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: err.statusCode }
      );
    }
    const msg = err instanceof Error ? err.message : "Lỗi hoàn thành phiên ôn tập.";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
