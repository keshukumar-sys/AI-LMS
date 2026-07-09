import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { bootcampContentCol } from "@/lib/models";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const dayNumber = Number(id);
  if (![1, 2, 3].includes(dayNumber)) {
    return NextResponse.json({ error: "Invalid day." }, { status: 400 });
  }

  const col = await bootcampContentCol();
  const day = await col.findOne({ dayNumber: dayNumber as 1 | 2 | 3 });
  if (!day) return NextResponse.json({ error: "Day content not found." }, { status: 404 });

  return NextResponse.json({ day });
}
