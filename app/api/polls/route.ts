import { NextResponse } from "next/server";
import { pollsCol } from "@/lib/models";
import { requireRole } from "@/lib/require-session";

export async function GET() {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const polls = await pollsCol();
  const list = await polls.find({}).sort({ createdAt: -1 }).limit(50).toArray();
  return NextResponse.json({ polls: list });
}

export async function POST(req: Request) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const body = await req.json().catch(() => null);
  const title = (body?.title ?? "").trim();
  const question = (body?.question ?? "").trim();
  const optionLabels: string[] = Array.isArray(body?.options) ? body.options : [];
  const dayNumber = body?.dayNumber;
  const durationSec = Number(body?.durationSec) || 20;

  if (!title || !question || optionLabels.filter((o) => o.trim()).length < 2) {
    return NextResponse.json(
      { error: "Title, question, and at least 2 options are required." },
      { status: 400 }
    );
  }

  const options = optionLabels
    .map((label, i) => ({ id: `opt-${i}`, label: label.trim() }))
    .filter((o) => o.label);

  const polls = await pollsCol();
  const result = await polls.insertOne({
    title,
    question,
    options,
    dayNumber: [1, 2, 3].includes(dayNumber) ? dayNumber : undefined,
    status: "draft",
    durationSec,
    createdBy: guard.session.userId,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true, id: result.insertedId.toString() });
}
