import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { apiKeysCol, type AIProvider } from "@/lib/models";
import { decryptSecret } from "@/lib/crypto";
import { callAI, type ChatTurn } from "@/lib/ai/providers";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const provider = body?.provider as AIProvider;
  const model = (body?.model ?? "").trim();
  const systemPrompt = body?.systemPrompt as string | undefined;
  const messages = body?.messages as ChatTurn[] | undefined;

  if (!provider || !model || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "provider, model, and messages are required." }, { status: 400 });
  }

  const keys = await apiKeysCol();
  const saved = await keys.findOne({ userId: session.userId, provider });
  if (!saved) {
    return NextResponse.json(
      { error: `No ${provider} API key saved yet. Add one in Settings first.` },
      { status: 400 }
    );
  }

  const apiKey = decryptSecret(saved);

  try {
    const reply = await callAI({ provider, apiKey, model, systemPrompt, messages });
    return NextResponse.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "The AI provider returned an error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
