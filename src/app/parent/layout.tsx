import React from "react";
import { cookies } from "next/headers";
import { ParentUnlockGuard } from "@/components/auth/ParentUnlockGuard";

export const dynamic = "force-dynamic";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("parent_mode_session")?.value;

  // If no parent_mode_session cookie exists, render the server-side unlock guard
  if (!sessionCookie) {
    return <ParentUnlockGuard />;
  }

  return <>{children}</>;
}
