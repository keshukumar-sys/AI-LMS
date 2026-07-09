import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { usersCol } from "@/lib/models";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = (body?.name ?? "").trim();
  const email = (body?.email ?? "").trim().toLowerCase();
  const password = body?.password ?? "";

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const users = await usersCol();
  const existing = await users.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();
  const result = await users.insertOne({
    name,
    email,
    passwordHash,
    role: "student",
    xp: 0,
    createdAt: now,
    lastLoginAt: now,
  });

  const token = await createSessionToken({
    userId: result.insertedId.toString(),
    name,
    email,
    role: "student",
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, role: "student" });
}
