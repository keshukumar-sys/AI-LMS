import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { quizzesCol, quizResponsesCol } from "@/lib/models";
import { requireRole } from "@/lib/require-session";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const quizzes = await quizzesCol();
  const quiz = await quizzes.findOne({ _id: new ObjectId(id) });
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });

  const responses = await quizResponsesCol();
  const all = await responses.find({ quizId: quiz._id! }).sort({ answeredAt: 1 }).toArray();

  const counts: Record<string, number> = {};
  for (const opt of quiz.options) counts[opt.id] = 0;
  for (const r of all) counts[r.optionId] = (counts[r.optionId] ?? 0) + 1;

  const total = all.length;
  const correctCount = all.filter((r) => r.correct).length;
  const chartData = quiz.options.map((opt) => ({
    optionId: opt.id,
    label: opt.label,
    count: counts[opt.id] ?? 0,
    percent: total > 0 ? Math.round(((counts[opt.id] ?? 0) / total) * 1000) / 10 : 0,
    isCorrect: opt.id === quiz.correctOptionId,
  }));

  return NextResponse.json({
    quiz: {
      id: quiz._id!.toString(),
      title: quiz.title,
      question: quiz.question,
      status: quiz.status,
      endsAt: quiz.endsAt,
      correctOptionId: quiz.correctOptionId,
    },
    total,
    correctCount,
    accuracyPercent: total > 0 ? Math.round((correctCount / total) * 1000) / 10 : 0,
    chartData,
    responses: all.map((r) => ({
      studentId: r.studentId,
      studentName: r.studentName,
      optionId: r.optionId,
      optionLabel: quiz.options.find((o) => o.id === r.optionId)?.label ?? r.optionId,
      correct: r.correct,
      answeredAt: r.answeredAt,
    })),
  });
}
