import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiKeysCol, type AIProvider } from "@/lib/models";
import { encryptSecret } from "@/lib/crypto";

const VALID_PROVIDERS: AIProvider[] = ["anthropic", "openai", "google"];

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const keys = await apiKeysCol();
  const saved = await keys.find({ userId: session.userId }).toArray();
  return NextResponse.json({
    providers: saved.map((k) => ({ provider: k.provider, updatedAt: k.updatedAt })),
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const provider = body?.provider as AIProvider;
  const apiKey = (body?.apiKey ?? "").trim();

  if (!VALID_PROVIDERS.includes(provider) || !apiKey) {
    return NextResponse.json({ error: "A valid provider and API key are required." }, { status: 400 });
  }

  const encrypted = encryptSecret(apiKey);
  const keys = await apiKeysCol();
  await keys.updateOne(
    { userId: session.userId, provider },
    { $set: { ...encrypted, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}
