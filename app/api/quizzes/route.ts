import { NextResponse } from "next/server";
import { quizzesCol } from "@/lib/models";
import { requireRole } from "@/lib/require-session";

export async function GET() {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const quizzes = await quizzesCol();
  const list = await quizzes.find({}).sort({ createdAt: -1 }).limit(50).toArray();
  return NextResponse.json({ quizzes: list });
}

export async function POST(req: Request) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const body = await req.json().catch(() => null);
  const title = (body?.title ?? "").trim();
  const question = (body?.question ?? "").trim();
  const optionLabels: string[] = Array.isArray(body?.options) ? body.options : [];
  const correctIndex = Number(body?.correctIndex);
  const dayNumber = body?.dayNumber;
  const durationSec = Number(body?.durationSec) || 20;

  const cleanOptions = optionLabels.map((l) => l.trim()).filter(Boolean);
  if (!title || !question || cleanOptions.length < 2) {
    return NextResponse.json(
      { error: "Title, question, and at least 2 options are required." },
      { status: 400 }
    );
  }
  if (!(correctIndex >= 0 && correctIndex < cleanOptions.length)) {
    return NextResponse.json({ error: "A valid correct option must be selected." }, { status: 400 });
  }

  const options = cleanOptions.map((label, i) => ({ id: `opt-${i}`, label }));
  const correctOptionId = options[correctIndex].id;

  const quizzes = await quizzesCol();
  const result = await quizzes.insertOne({
    title,
    question,
    options,
    correctOptionId,
    dayNumber: [1, 2, 3].includes(dayNumber) ? dayNumber : undefined,
    status: "draft",
    durationSec,
    createdBy: guard.session.userId,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true, id: result.insertedId.toString() });
}
