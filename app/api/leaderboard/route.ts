import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { usersCol, assessmentAttemptsCol, xpLedgerCol } from "@/lib/models";

type Range = "daily" | "weekly" | "overall";

function startOfWindow(range: Range): Date | null {
  const now = new Date();
  if (range === "daily") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }
  if (range === "weekly") {
    const start = new Date(now);
    start.setUTCDate(start.getUTCDate() - 7);
    return start;
  }
  return null;
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const rangeParam = new URL(req.url).searchParams.get("range");
  const range: Range = rangeParam === "daily" || rangeParam === "weekly" ? rangeParam : "overall";

  const users = await usersCol();
  const students = await users.find({ role: "student" }).toArray();

  const attempts = await assessmentAttemptsCol();
  const gradedAttempts = await attempts.find({ status: "graded" }).toArray();

  const byUser = new Map<string, { totalScore: number; count: number; modules: Set<string> }>();
  for (const a of gradedAttempts) {
    const entry = byUser.get(a.userId) ?? { totalScore: 0, count: 0, modules: new Set<string>() };
    entry.totalScore += a.finalScore ?? a.totalScore ?? 0;
    entry.count += 1;
    entry.modules.add(a.moduleId);
    byUser.set(a.userId, entry);
  }

  let windowXp: Map<string, number> | null = null;
  const since = startOfWindow(range);
  if (since) {
    const ledger = await xpLedgerCol();
    const entries = await ledger.find({ createdAt: { $gte: since } }).toArray();
    windowXp = new Map();
    for (const e of entries) {
      windowXp.set(e.userId, (windowXp.get(e.userId) ?? 0) + e.amount);
    }
  }

  const rows = students.map((u) => {
    const userId = u._id!.toString();
    const stats = byUser.get(userId);
    const xp = windowXp ? windowXp.get(userId) ?? 0 : u.xp ?? 0;
    return {
      userId,
      name: u.name,
      xp,
      averageScore: stats ? Math.round(stats.totalScore / stats.count) : 0,
      completedModules: stats ? stats.modules.size : 0,
      currentStreak: u.currentStreak ?? 0,
    };
  });

  rows.sort((a, b) => b.xp - a.xp || b.averageScore - a.averageScore);

  const ranked = rows.slice(0, 50).map((r, i) => ({ rank: i + 1, ...r }));

  return NextResponse.json({ range, leaderboard: ranked });
}
