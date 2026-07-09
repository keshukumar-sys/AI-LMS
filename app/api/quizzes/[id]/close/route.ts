import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { quizzesCol } from "@/lib/models";
import { requireRole } from "@/lib/require-session";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const quizzes = await quizzesCol();
  await quizzes.updateOne({ _id: new ObjectId(id) }, { $set: { status: "closed" } });
  return NextResponse.json({ ok: true });
}
