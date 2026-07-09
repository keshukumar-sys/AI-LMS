import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { coursesCol } from "@/lib/models";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (session.role !== "admin") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => null);

  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof body?.isPublished === "boolean") update.isPublished = body.isPublished;
  if (typeof body?.title === "string" && body.title.trim()) update.title = body.title.trim();
  if (typeof body?.description === "string") update.description = body.description.trim();

  const col = await coursesCol();
  const result = await col.updateOne({ _id: new ObjectId(id) }, { $set: update });
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (session.role !== "admin") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { id } = await params;
  const col = await coursesCol();
  await col.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
