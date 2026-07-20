import type { AIProvider } from "@/lib/models";
import { callAI } from "@/lib/ai/providers";

const EVAL_SYSTEM_PROMPT = `You are an expert AI evaluator.

Evaluate the student's answer based on:

1. Technical accuracy (30 marks)
2. Logical reasoning (25 marks)
3. Practical application (20 marks)
4. Creativity (15 marks)
5. Ethical considerations (10 marks)

Return ONLY a raw JSON object (no markdown fences, no prose before or after) in this exact format:

{
  "score": 85,
  "technical_accuracy": 26,
  "reasoning": 21,
  "practical_application": 17,
  "creativity": 12,
  "ethics": 9,
  "feedback": "Detailed feedback for the student."
}`;

export interface EvaluationResult {
  marksAwarded: number; // scaled to maxMarks
  technicalAccuracy: number;
  reasoning: number;
  practicalApplication: number;
  creativity: number;
  ethics: number;
  feedback: string;
}

function extractJsonObject(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("The AI response did not contain a JSON object.");
  }
  const parsed = JSON.parse(cleaned.slice(start, end + 1));
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("The AI response was not a JSON object.");
  }
  return parsed as Record<string, unknown>;
}

function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function evaluateAnswer(params: {
  provider: AIProvider;
  apiKey: string;
  model: string;
  questionText: string;
  studentAnswer: string;
  maxMarks: number;
}): Promise<EvaluationResult> {
  const { provider, apiKey, model, questionText, studentAnswer, maxMarks } = params;

  const reply = await callAI({
    provider,
    apiKey,
    model,
    systemPrompt: EVAL_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Question:\n${questionText}\n\nStudent's answer:\n${studentAnswer || "(no answer submitted)"}`,
      },
    ],
  });

  const parsed = extractJsonObject(reply);
  const score = Math.min(100, Math.max(0, num(parsed.score)));

  return {
    marksAwarded: Math.round((score / 100) * maxMarks),
    technicalAccuracy: num(parsed.technical_accuracy),
    reasoning: num(parsed.reasoning),
    practicalApplication: num(parsed.practical_application),
    creativity: num(parsed.creativity),
    ethics: num(parsed.ethics),
    feedback: String(parsed.feedback ?? ""),
  };
}
