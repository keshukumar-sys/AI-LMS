import type { AIProvider } from "@/lib/models";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AICallParams {
  provider: AIProvider;
  apiKey: string;
  model: string;
  systemPrompt?: string;
  messages: ChatTurn[];
}

export const PROVIDER_LABELS: Record<AIProvider, string> = {
  anthropic: "Anthropic (Claude)",
  openai: "OpenAI (GPT)",
  google: "Google (Gemini)",
};

export const DEFAULT_MODELS: Record<AIProvider, string[]> = {
  anthropic: ["claude-sonnet-5", "claude-haiku-4-5-20251001", "claude-opus-4-8"],
  openai: ["gpt-5.1", "gpt-5.1-mini", "gpt-4.1"],
  google: ["gemini-3-pro", "gemini-3-flash"],
};

export async function callAI({ provider, apiKey, model, systemPrompt, messages }: AICallParams): Promise<string> {
  if (provider === "anthropic") {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });
    const res = await client.messages.create({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const block = res.content.find((b) => b.type === "text");
    return block?.text ?? "";
  }

  if (provider === "openai") {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });
    const res = await client.chat.completions.create({
      model,
      messages: [
        ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });
    return res.choices[0]?.message?.content ?? "";
  }

  if (provider === "google") {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const client = new GoogleGenerativeAI(apiKey);
    const genModel = client.getGenerativeModel({ model, systemInstruction: systemPrompt });
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));
    const chat = genModel.startChat({ history });
    const last = messages[messages.length - 1];
    const res = await chat.sendMessage(last?.content ?? "");
    return res.response.text();
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
