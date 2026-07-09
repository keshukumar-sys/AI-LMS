import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { quizzesCol, quizResponsesCol, usersCol } from "@/lib/models";
import { requireRole } from "@/lib/require-session";

const XP_PER_CORRECT_ANSWER = 10;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole("student");
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const optionId = body?.optionId as string | undefined;
  if (!optionId) return NextResponse.json({ error: "optionId is required." }, { status: 400 });

  const quizzes = await quizzesCol();
  const quiz = await quizzes.findOne({ _id: new ObjectId(id) });
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  if (quiz.status !== "live") {
    return NextResponse.json({ error: "This quiz is no longer accepting answers." }, { status: 410 });
  }
  if (quiz.endsAt && quiz.endsAt.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Time's up - the 20 second window has closed." }, { status: 410 });
  }
  if (!quiz.options.some((o) => o.id === optionId)) {
    return NextResponse.json({ error: "Invalid option." }, { status: 400 });
  }

  const responses = await quizResponsesCol();
  const existing = await responses.findOne({ quizId: quiz._id!, studentId: guard.session.userId });
  if (existing) {
    return NextResponse.json({ error: "You already answered this quiz." }, { status: 409 });
  }

  const correct = optionId === quiz.correctOptionId;

  try {
    await responses.insertOne({
      quizId: quiz._id!,
      studentId: guard.session.userId,
      studentName: guard.session.name,
      optionId,
      correct,
      answeredAt: new Date(),
    });
  } catch {
    return NextResponse.json({ error: "You already answered this quiz." }, { status: 409 });
  }

  if (correct) {
    const users = await usersCol();
    await users.updateOne(
      { _id: new ObjectId(guard.session.userId) },
      { $inc: { xp: XP_PER_CORRECT_ANSWER } }
    );
  }

  return NextResponse.json({ ok: true, correct, xpAwarded: correct ? XP_PER_CORRECT_ANSWER : 0 });
}
