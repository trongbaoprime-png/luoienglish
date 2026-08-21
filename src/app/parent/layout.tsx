import React from "react";
import { cookies } from "next/headers";
import { ParentUnlockGuard } from "@/components/auth/ParentUnlockGuard";
import { ParentModeSessionService } from "@/services/auth/ParentModeSessionService";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";

export const dynamic = "force-dynamic";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("parent_mode_session")?.value;

  // 1. If no cookie is present, render the unlock guard
  if (!sessionToken) {
    return <ParentUnlockGuard />;
  }

  // 2. Extract payload to derive parentUid
  const parts = sessionToken.split(".");
  if (parts.length !== 2) {
    return <ParentUnlockGuard />;
  }

  try {
    const payloadJson = Buffer.from(parts[0] || "", "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson) as { parentUid?: string };
    const parentUid = payload.parentUid;

    if (!parentUid || typeof parentUid !== "string") {
      return <ParentUnlockGuard />;
    }

    // 3. Retrieve current stateful securityVersion from repository
    const userRepo = RepositoryFactory.getUserRepository();
    const pinRecord = await userRepo.getPinRecord(parentUid);
    const expectedSecurityVersion = pinRecord?.securityVersion;

    // 4. Cryptographically verify signature, TTL, schema, and securityVersion
    const verification = ParentModeSessionService.verifySession(
      sessionToken,
      parentUid,
      expectedSecurityVersion
    );

    if (!verification.valid) {
      return <ParentUnlockGuard />;
    }

    // 5. Authenticated & Cryptographically Unlocked: Render privileged parent layout
    return <>{children}</>;
  } catch {
    return <ParentUnlockGuard />;
  }
}
