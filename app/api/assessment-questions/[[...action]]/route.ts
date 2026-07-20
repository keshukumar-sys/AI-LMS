import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { questionsCol } from "@/lib/models";

async function listByModule(moduleId: string) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const col = await questionsCol();
  const docs = await col.find({ moduleId }).sort({ order: 1 }).toArray();

  const questions = docs.map((d) => {
    const { correctAnswer, ...rest } = d;
    void correctAnswer; // never leak the answer key to the client pre-submit
    return { ...rest, _id: d._id!.toString() };
  });

  return NextResponse.json({ questions });
}

export async function GET(_req: Request, { params }: { params: Promise<{ action?: string[] }> }) {
  const { action } = await params;
  if (action && action.length === 1) return listByModule(action[0]);
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}
