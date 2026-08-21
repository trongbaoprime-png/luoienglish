import { NextRequest, NextResponse } from "next/server";
import { AIGateway } from "@/services/ai/AIGateway";
import { MockAIGatewayProvider } from "@/services/ai/MockAIGatewayProvider";
import { AITutorRequest } from "@/types/ai";

const aiGateway = new AIGateway(new MockAIGatewayProvider());

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AITutorRequest;

    if (!body.childId || !body.studentInputText) {
      return NextResponse.json(
        { error: "childId and studentInputText are required." },
        { status: 400 }
      );
    }

    const response = await aiGateway.getTutorHelp(body);
    return NextResponse.json({ success: true, data: response });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
