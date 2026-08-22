import { NextRequest, NextResponse } from "next/server";
import { PetService } from "@/services/pet/PetService";
import { RewardService } from "@/services/rewards/RewardService";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import {
  verifyServerAccountSession,
  authorizeChildAccess,
  ServerAuthError,
} from "@/services/auth/serverAuth";

export async function GET(request: NextRequest) {
  try {
    const verifiedAccount = await verifyServerAccountSession(request);
    const parentUid = verifiedAccount.uid;

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get("childId");

    if (!childId) {
      return NextResponse.json(
        { error: "Missing required parameter: childId" },
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

    const [pet, balance] = await Promise.all([
      PetService.getOrInitPet(childId),
      RewardService.getChildBalance(childId),
    ]);

    return NextResponse.json({
      pet,
      petFoodBalance: balance.totalPetFood,
    });
  } catch (error: unknown) {
    if (error instanceof ServerAuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    const msg = error instanceof Error ? error.message : "Failed to fetch pet";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
