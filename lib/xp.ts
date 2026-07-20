import { ObjectId } from "mongodb";
import { usersCol, xpLedgerCol } from "@/lib/models";

function todayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isYesterday(lastActiveDate: string, today: string): boolean {
  const last = new Date(`${lastActiveDate}T00:00:00Z`);
  const yesterday = new Date(`${today}T00:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return todayKey(last) === todayKey(yesterday);
}

/**
 * Awards XP to a user, logs it to the XP ledger (used for daily/weekly leaderboard
 * windows), and updates their streak. This is the only code path that should touch
 * currentStreak/longestStreak/lastActiveDate - existing XP grants elsewhere in the
 * app ($inc on users.xp for live quizzes and lesson progress) are untouched.
 */
export async function awardXp(
  userId: string,
  amount: number,
  reason: string,
  meta?: { moduleId?: string; attemptId?: string }
): Promise<void> {
  if (amount <= 0) return;

  const users = await usersCol();
  const ledger = await xpLedgerCol();
  const now = new Date();
  const today = todayKey(now);

  const user = await users.findOne({ _id: new ObjectId(userId) });
  const lastActiveDate = user?.lastActiveDate;
  const currentStreak = user?.currentStreak ?? 0;
  const longestStreak = user?.longestStreak ?? 0;

  let nextStreak = currentStreak;
  if (lastActiveDate !== today) {
    nextStreak = lastActiveDate && isYesterday(lastActiveDate, today) ? currentStreak + 1 : 1;
  }
  const nextLongest = Math.max(longestStreak, nextStreak);

  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $inc: { xp: amount },
      $set: { currentStreak: nextStreak, longestStreak: nextLongest, lastActiveDate: today },
    }
  );

  await ledger.insertOne({
    userId,
    amount,
    reason,
    moduleId: meta?.moduleId,
    attemptId: meta?.attemptId,
    createdAt: now,
  });
}
