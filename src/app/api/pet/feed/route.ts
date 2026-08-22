import { NextRequest, NextResponse } from "next/server";
import { PetService } from "@/services/pet/PetService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, foodAmount = 1, idempotencyKey } = body;

    if (!childId || !idempotencyKey) {
      return NextResponse.json(
        { error: "Missing required fields: childId, idempotencyKey" },
        { status: 400 }
      );
    }

    const result = await PetService.feedPet(childId, idempotencyKey, foodAmount);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to feed pet";
    const status = msg.includes("Insufficient") ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
