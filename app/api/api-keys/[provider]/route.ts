import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiKeysCol, type AIProvider } from "@/lib/models";

export async function DELETE(req: Request, { params }: { params: Promise<{ provider: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { provider } = await params;
  const keys = await apiKeysCol();
  await keys.deleteOne({ userId: session.userId, provider: provider as AIProvider });
  return NextResponse.json({ ok: true });
}
