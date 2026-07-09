import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { quizzesCol } from "@/lib/models";
import { requireRole } from "@/lib/require-session";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const quizzes = await quizzesCol();
  const quiz = await quizzes.findOne({ _id: new ObjectId(id) });
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });

  await quizzes.updateMany({ status: "live" }, { $set: { status: "closed" } });

  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + quiz.durationSec * 1000);
  await quizzes.updateOne({ _id: quiz._id }, { $set: { status: "live", startedAt, endsAt } });

  return NextResponse.json({ ok: true, startedAt, endsAt });
}
