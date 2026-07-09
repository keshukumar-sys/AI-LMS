import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { pollsCol, pollResponsesCol } from "@/lib/models";
import { requireRole } from "@/lib/require-session";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole("student");
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const optionId = body?.optionId as string | undefined;
  if (!optionId) return NextResponse.json({ error: "optionId is required." }, { status: 400 });

  const polls = await pollsCol();
  const poll = await polls.findOne({ _id: new ObjectId(id) });
  if (!poll) return NextResponse.json({ error: "Poll not found." }, { status: 404 });
  if (poll.status !== "live") {
    return NextResponse.json({ error: "This poll is no longer accepting answers." }, { status: 410 });
  }
  if (poll.endsAt && poll.endsAt.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Time's up - the 20 second window has closed." }, { status: 410 });
  }
  if (!poll.options.some((o) => o.id === optionId)) {
    return NextResponse.json({ error: "Invalid option." }, { status: 400 });
  }

  const responses = await pollResponsesCol();
  const existing = await responses.findOne({ pollId: poll._id!, studentId: guard.session.userId });
  if (existing) {
    return NextResponse.json({ error: "You already answered this poll." }, { status: 409 });
  }

  try {
    await responses.insertOne({
      pollId: poll._id!,
      studentId: guard.session.userId,
      studentName: guard.session.name,
      optionId,
      answeredAt: new Date(),
    });
  } catch {
    // Unique index (pollId, studentId) caught a race - treat as already answered.
    return NextResponse.json({ error: "You already answered this poll." }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
