import { NextResponse } from "next/server";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export async function GET() {
  const firebaseStatus = FirebaseClient.getStatus();

  return NextResponse.json({
    status: "ok",
    product: "LƯỜI ENGLISH",
    version: "0.1.0",
    mascot: "Chú Lười (The Sloth)",
    firebase: firebaseStatus,
    timestamp: new Date().toISOString(),
  });
}
