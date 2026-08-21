import { NextRequest, NextResponse } from "next/server";
import { RewardEngine } from "@/engines/reward/RewardEngine";
import { InMemoryRewardRepository } from "@/repositories/memory/InMemoryRewardRepository";
import { RewardTriggerEvent } from "@/types/reward";

const rewardRepo = new InMemoryRewardRepository();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { childId, idempotencyKey, event, sourceEntityId, accuracyScore } = body as {
      childId: string;
      idempotencyKey: string;
      event: RewardTriggerEvent;
      sourceEntityId?: string;
      accuracyScore?: number;
    };

    if (!childId || !idempotencyKey || !event) {
      return NextResponse.json(
        { error: "childId, idempotencyKey, and event are required." },
        { status: 400 }
      );
    }

    // Check idempotency
    const alreadyProcessed = await rewardRepo.isIdempotencyKeyProcessed(idempotencyKey);
    if (alreadyProcessed) {
      const balance = await rewardRepo.getBalance(childId);
      return NextResponse.json({
        success: true,
        message: "Transaction already processed.",
        data: { balance },
      });
    }

    // Compute and record transaction
    const tx = RewardEngine.processEvent(
      childId,
      idempotencyKey,
      { event, accuracyScore },
      sourceEntityId
    );

    await rewardRepo.recordTransaction(tx);
    const updatedBalance = await rewardRepo.getBalance(childId);

    return NextResponse.json({
      success: true,
      data: {
        transaction: tx,
        balance: updatedBalance,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
