import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireRole } from "@/lib/require-session";
import { assessmentsCol } from "@/lib/models";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (typeof body?.isPublished !== "boolean") {
    return NextResponse.json({ error: "isPublished (boolean) is required." }, { status: 400 });
  }

  const col = await assessmentsCol();
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isPublished: body.isPublished, updatedAt: new Date() } }
  );
  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Assessment not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const col = await assessmentsCol();
  await col.deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
