import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { pollsCol } from "@/lib/models";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const polls = await pollsCol();
  const live = await polls.findOne({ status: "live" });

  if (!live) return NextResponse.json({ poll: null });

  // Auto-expire once the answer window has passed.
  if (live.endsAt && live.endsAt.getTime() <= Date.now()) {
    await polls.updateOne({ _id: live._id }, { $set: { status: "closed" } });
    return NextResponse.json({ poll: null });
  }

  return NextResponse.json({
    poll: {
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
