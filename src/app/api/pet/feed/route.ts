import { NextRequest, NextResponse } from "next/server";
import { PetService } from "@/services/pet/PetService";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";

export async function POST(request: NextRequest) {
  try {
    const verifiedAccount = await verifyServerAccountSession(request);
    const parentUid = verifiedAccount.uid;

    const body = await request.json().catch(() => ({}));
    const { childId, foodAmount = 1, idempotencyKey } = body;

    if (!childId || typeof childId !== "string" || !idempotencyKey || typeof idempotencyKey !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid required fields: childId, idempotencyKey" },
        { status: 400 }
      );
    }

    const amount = Number(foodAmount);
    if (isNaN(amount) || amount < 1 || !Number.isInteger(amount)) {
      return NextResponse.json(
        { error: "foodAmount must be a positive integer" },
        { status: 400 }
      );
    }

    const childRepo = RepositoryFactory.getChildRepository();
    const authResult = await authorizeChildAccess(parentUid, childId, childRepo);

    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode }
      );
    }

    const result = await PetService.feedPet(childId, idempotencyKey, amount);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof ServerAuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    const msg = error instanceof Error ? error.message : "Failed to feed pet";
    const status = msg.includes("Insufficient") ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
