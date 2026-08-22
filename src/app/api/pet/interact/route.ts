import { NextRequest, NextResponse } from "next/server";
import { PetService } from "@/services/pet/PetService";
import { PetInteractionType } from "@/types/pet";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childId, interactionType, idempotencyKey } = body;

    if (!childId || !interactionType) {
      return NextResponse.json(
        { error: "Missing required fields: childId, interactionType" },
        { status: 400 }
      );
    }

    const result = await PetService.interact(
      childId,
      interactionType as PetInteractionType,
      idempotencyKey
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to interact with pet";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
