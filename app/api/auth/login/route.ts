import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { usersCol } from "@/lib/models";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = (body?.email ?? "").trim().toLowerCase();
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const users = await usersCol();
  const user = await users.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await users.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });

  const token = await createSessionToken({
    userId: user._id!.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true, role: user.role });
}
