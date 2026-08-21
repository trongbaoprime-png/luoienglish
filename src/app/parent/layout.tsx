import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ParentUnlockGuard } from "@/components/auth/ParentUnlockGuard";
import { ParentModeSessionService } from "@/services/auth/ParentModeSessionService";
import { ServerAccountSessionService } from "@/services/auth/ServerAccountSessionService";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";

export const dynamic = "force-dynamic";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accountCookie = cookieStore.get("auth_session")?.value;
  const parentSessionCookie = cookieStore.get("parent_mode_session")?.value;

  // STEP 1: Verify Trusted Server Account Session
  // "Which authenticated account owns this HTTP request?"
  if (!accountCookie) {
    // If no trusted server account session exists, redirect to login
    redirect("/auth/login?redirect=/parent");
  }

  let trustedUid: string;
  try {
    const verifiedAccount = ServerAccountSessionService.verifyAccountSession(accountCookie);
    trustedUid = verifiedAccount.uid;
  } catch {
    // Expired or tampered account session -> force re-login
    redirect("/auth/login?redirect=/parent");
  }

  // STEP 2: Check Parent Mode Session
  // "Has that exact same account recently passed the parental gate?"
  if (!parentSessionCookie) {
    return <ParentUnlockGuard />;
  }

  try {
    // STEP 3: Retrieve current securityVersion from database
    const userRepo = RepositoryFactory.getUserRepository();
    const pinRecord = await userRepo.getPinRecord(trustedUid);
    const expectedSecurityVersion = pinRecord?.securityVersion;

    // STEP 4: Cryptographically verify signature, TTL, and enforce parentUid === trustedUid
    const verification = ParentModeSessionService.verifySession(
      parentSessionCookie,
      trustedUid,
      expectedSecurityVersion
    );

    if (!verification.valid) {
      return <ParentUnlockGuard />;
    }

    // STEP 5: Fully Verified (Authenticated Parent Identity + Matching Active Parent Mode Session)
    return <>{children}</>;
  } catch {
    return <ParentUnlockGuard />;
  }
}
