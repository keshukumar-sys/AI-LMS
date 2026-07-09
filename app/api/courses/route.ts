import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { coursesCol } from "@/lib/models";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const col = await coursesCol();
  const filter = session.role === "admin" ? {} : { isPublished: true };
  const docs = await col.find(filter).sort({ createdAt: 1 }).toArray();

  return NextResponse.json({
    courses: docs.map((d) => ({ ...d, _id: d._id!.toString() })),
  });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  if (session.role !== "admin") return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const body = await req.json().catch(() => null);
  const title = (body?.title ?? "").trim();
  const description = (body?.description ?? "").trim();
  const isPublished = !!body?.isPublished;

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const now = new Date();
  const col = await coursesCol();
  const result = await col.insertOne({
    title,
    description,
    isPublished,
    modules: [],
    createdBy: session.userId,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ id: result.insertedId.toString() });
}
