import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireRole } from "@/lib/require-session";
import { assessmentsCol, type AssessmentQuestion, type QuestionKind, type Difficulty } from "@/lib/models";

export async function GET() {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const col = await assessmentsCol();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({
    assessments: docs.map((d) => ({ ...d, _id: d._id!.toString() })),
  });
}

export async function POST(req: Request) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const body = await req.json().catch(() => null);
  const title = (body?.title ?? "").trim();
  const type = body?.type === "assessment" ? "assessment" : "quiz";
  const instructions = (body?.instructions ?? "").trim();
  const timeLimitMin = body?.timeLimitMin ? Number(body.timeLimitMin) : null;
  const rawQuestions = Array.isArray(body?.questions) ? body.questions : [];

  if (!title || rawQuestions.length === 0) {
    return NextResponse.json({ error: "Title and at least one question are required." }, { status: 400 });
  }

  const questions: AssessmentQuestion[] = rawQuestions
    .map((q: Record<string, unknown>) => ({
      id: randomUUID(),
      kind: (q.kind as QuestionKind) ?? "mcq",
      body: String(q.body ?? "").trim(),
      options: Array.isArray(q.options) ? q.options.map(String).filter(Boolean) : undefined,
      correctAnswer: q.correctAnswer ? String(q.correctAnswer) : undefined,
      points: Number(q.points) || 1,
      topicTag: String(q.topicTag ?? "general"),
      difficulty: (q.difficulty as Difficulty) ?? "beginner",
    }))
    .filter((q: AssessmentQuestion) => q.body);

  if (questions.length === 0) {
    return NextResponse.json({ error: "Every question needs a body." }, { status: 400 });
  }

  const now = new Date();
  const col = await assessmentsCol();
  const result = await col.insertOne({
    title,
    type,
    instructions,
    timeLimitMin,
    isPublished: false,
    questions,
    createdBy: guard.session.userId,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ id: result.insertedId.toString() });
}
