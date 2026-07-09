import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "@/lib/auth";
import type { Role } from "@/lib/models";

export async function requireRole(
  role: Role
): Promise<{ session: SessionPayload } | { error: NextResponse }> {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Not authenticated." }, { status: 401 }) };
  }
  if (session.role !== role) {
    return { error: NextResponse.json({ error: "Forbidden." }, { status: 403 }) };
  }
  return { session };
}
