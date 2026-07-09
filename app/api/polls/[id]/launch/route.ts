import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { pollsCol } from "@/lib/models";
import { requireRole } from "@/lib/require-session";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const polls = await pollsCol();
  const poll = await polls.findOne({ _id: new ObjectId(id) });
  if (!poll) return NextResponse.json({ error: "Poll not found." }, { status: 404 });

  // Only one poll live at a time - close any others still marked live.
  await polls.updateMany({ status: "live" }, { $set: { status: "closed" } });

  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + poll.durationSec * 1000);
  await polls.updateOne(
    { _id: poll._id },
    { $set: { status: "live", startedAt, endsAt } }
  );

  return NextResponse.json({ ok: true, startedAt, endsAt });
}
