import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { quizzesCol } from "@/lib/models";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const quizzes = await quizzesCol();
  const live = await quizzes.findOne({ status: "live" });

  if (!live) return NextResponse.json({ quiz: null });

  if (live.endsAt && live.endsAt.getTime() <= Date.now()) {
    await quizzes.updateOne({ _id: live._id }, { $set: { status: "closed" } });
    return NextResponse.json({ quiz: null });
  }

  // Never send the correct answer down to students.
  return NextResponse.json({
    quiz: {
      id: live._id!.toString(),
      title: live.title,
      question: live.question,
      options: live.options,
      startedAt: live.startedAt,
      endsAt: live.endsAt,
      durationSec: live.durationSec,
    },
  });
}
