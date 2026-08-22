import { NextRequest, NextResponse } from "next/server";
import { PetService } from "@/services/pet/PetService";
import { PetInteractionType } from "@/types/pet";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";

const VALID_INTERACTION_TYPES: PetInteractionType[] = [
  "FEED",
  "PET",
  "PLAY_SHORT",
  "REST",
  "WAKE",
  "WELCOME_BACK",
];

export async function POST(request: NextRequest) {
  try {
    const verifiedAccount = await verifyServerAccountSession(request);
    const parentUid = verifiedAccount.uid;

    const body = await request.json().catch(() => ({}));
    const { childId, interactionType, idempotencyKey } = body;

    if (!childId || typeof childId !== "string" || !interactionType || typeof interactionType !== "string") {
      return NextResponse.json(
        { error: "Missing required fields: childId, interactionType" },
        { status: 400 }
      );
    }

    if (!VALID_INTERACTION_TYPES.includes(interactionType as PetInteractionType)) {
      return NextResponse.json(
        {
          error: `Invalid interactionType: '${interactionType}'. Allowed values: ${VALID_INTERACTION_TYPES.join(", ")}`,
        },
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

    const result = await PetService.interact(
      childId,
      interactionType as PetInteractionType,
      idempotencyKey
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof ServerAuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    const msg = error instanceof Error ? error.message : "Failed to interact with pet";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
