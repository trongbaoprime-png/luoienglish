import { NextRequest, NextResponse } from "next/server";
import { PetService } from "@/services/pet/PetService";
import { RewardService } from "@/services/rewards/RewardService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get("childId");

    if (!childId) {
      return NextResponse.json(
        { error: "Missing required parameter: childId" },
        { status: 400 }
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
    const msg = error instanceof Error ? error.message : "Failed to fetch pet";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
