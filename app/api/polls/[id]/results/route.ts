import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { pollsCol, pollResponsesCol } from "@/lib/models";
import { requireRole } from "@/lib/require-session";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const polls = await pollsCol();
  const poll = await polls.findOne({ _id: new ObjectId(id) });
  if (!poll) return NextResponse.json({ error: "Poll not found." }, { status: 404 });

  const responses = await pollResponsesCol();
  const all = await responses.find({ pollId: poll._id! }).sort({ answeredAt: 1 }).toArray();

  const counts: Record<string, number> = {};
  for (const opt of poll.options) counts[opt.id] = 0;
  for (const r of all) counts[r.optionId] = (counts[r.optionId] ?? 0) + 1;

  const total = all.length;
  const chartData = poll.options.map((opt) => ({
    optionId: opt.id,
    label: opt.label,
    count: counts[opt.id] ?? 0,
    percent: total > 0 ? Math.round(((counts[opt.id] ?? 0) / total) * 1000) / 10 : 0,
  }));

  return NextResponse.json({
    poll: {
      id: poll._id!.toString(),
      title: poll.title,
      question: poll.question,
      status: poll.status,
      endsAt: poll.endsAt,
    },
    total,
    chartData,
    responses: all.map((r) => ({
      studentId: r.studentId,
      studentName: r.studentName,
      optionId: r.optionId,
      optionLabel: poll.options.find((o) => o.id === r.optionId)?.label ?? r.optionId,
      answeredAt: r.answeredAt,
    })),
  });
}
