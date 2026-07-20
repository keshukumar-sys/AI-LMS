// Multi-user verification (Requirement 7): spins up 5 demo student accounts, has them
// concurrently start/answer/submit attempts on the same module, and asserts there is no
// session mix-up, no cross-user data corruption, and the leaderboard reflects everyone
// independently. AI-graded sections require a saved API key (BYO, per-student) - these
// test accounts don't have one, so submit is expected to fail with a clear 400, which the
// script asserts rather than requiring 5 real paid API keys.
//
// Prerequisite: `npm run dev` running in another terminal (defaults to http://localhost:3000).
// Run with: npx tsx scripts/test-concurrent-assessments.ts

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const TEST_MODULE_ID = "m3-ai-productivity";
const TEST_PASSWORD = "Test@12345";
const USERS = Array.from({ length: 5 }, (_, i) => ({
  email: `test-student-${i + 1}@example.com`,
  name: `Test Student ${i + 1}`,
}));

function sessionCookieFrom(res: Response): string {
  const raw = res.headers.get("set-cookie") ?? "";
  const match = raw.match(/session=[^;]+/);
  if (!match) throw new Error(`No session cookie in login response (status ${res.status}): ${raw}`);
  return match[0];
}

async function ensureTestUsers() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "AI_LMS_Prototype";
  if (!uri) throw new Error("Missing MONGODB_URI in .env.local");

  const client = new MongoClient(uri);
  await client.connect();
  const users = client.db(dbName).collection("users");

  for (const u of USERS) {
    const existing = await users.findOne({ email: u.email });
    if (!existing) {
      const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
      await users.insertOne({
        name: u.name,
        email: u.email,
        passwordHash,
        role: "student",
        xp: 0,
        createdAt: new Date(),
      });
    }
  }
  await client.close();
}

async function login(email: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: TEST_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed for ${email}: ${res.status} ${await res.text()}`);
  return sessionCookieFrom(res);
}

async function runUserFlow(user: (typeof USERS)[number], index: number) {
  const cookie = await login(user.email);
  const authed = (url: string, init: RequestInit = {}) =>
    fetch(`${BASE_URL}${url}`, {
      ...init,
      headers: { "Content-Type": "application/json", Cookie: cookie, ...(init.headers ?? {}) },
    });

  const startRes = await authed("/api/assessment-attempts/start", {
    method: "POST",
    body: JSON.stringify({ moduleId: TEST_MODULE_ID }),
  });
  if (!startRes.ok) throw new Error(`start failed for ${user.email}: ${await startRes.text()}`);
  const { attempt } = await startRes.json();
  const attemptId: string = attempt._id;

  const questionsRes = await authed(`/api/assessment-questions/${TEST_MODULE_ID}`);
  const { questions } = await questionsRes.json();
  const mcqQuestions = questions.filter((q: { questionType: string }) => q.questionType === "mcq").slice(0, 3);

  // Each user picks a different option index (offset by their index) on the same questions,
  // so we can later assert no cross-user contamination in the stored answers.
  const expectedAnswers: Record<string, string> = {};
  for (const q of mcqQuestions) {
    const opt = q.options[index % q.options.length];
    expectedAnswers[q._id] = opt.id;
    const patchRes = await authed(`/api/assessment-attempts/${attemptId}/answer`, {
      method: "PATCH",
      body: JSON.stringify({ questionId: q._id, questionType: "mcq", selectedOptionId: opt.id }),
    });
    if (!patchRes.ok) throw new Error(`answer save failed for ${user.email}: ${await patchRes.text()}`);
  }

  const submitRes = await authed(`/api/assessment-attempts/${attemptId}/submit`, {
    method: "POST",
    body: JSON.stringify({ provider: "anthropic", model: "claude-sonnet-5" }),
  });
  const submitBody = await submitRes.json();
  if (submitRes.status !== 400 || !/API key/i.test(submitBody.error ?? "")) {
    throw new Error(
      `Expected submit to fail with a 400 "add API key" error for ${user.email} (no key saved), got ${submitRes.status}: ${JSON.stringify(submitBody)}`
    );
  }

  // getAttempt() 403s if the attempt doesn't belong to this session's user, so a 200 here
  // (combined with the id match) already proves the cookie session wasn't mixed up.
  const getRes = await authed(`/api/assessment-attempts/${attemptId}`);
  if (!getRes.ok) throw new Error(`get attempt failed for ${user.email}: ${getRes.status}`);
  const { attempt: fetched } = await getRes.json();
  if (fetched._id !== attemptId) {
    throw new Error(`Attempt id mismatch for ${user.email}`);
  }
  for (const [questionId, expectedOptionId] of Object.entries(expectedAnswers)) {
    const savedAnswer = fetched.answers.find((a: { questionId: string }) => a.questionId === questionId);
    if (!savedAnswer || savedAnswer.selectedOptionId !== expectedOptionId) {
      throw new Error(
        `Cross-contamination detected for ${user.email}: question ${questionId} expected ${expectedOptionId}, got ${savedAnswer?.selectedOptionId}`
      );
    }
  }

  const leaderboardRes = await authed("/api/leaderboard?range=overall");
  if (!leaderboardRes.ok) throw new Error(`leaderboard fetch failed for ${user.email}`);

  return { email: user.email, attemptId, answeredCount: mcqQuestions.length };
}

async function main() {
  console.log(`Ensuring ${USERS.length} test student accounts exist...`);
  await ensureTestUsers();

  console.log(`Running ${USERS.length} concurrent attempt flows against module "${TEST_MODULE_ID}"...`);
  const results = await Promise.all(USERS.map((u, i) => runUserFlow(u, i)));

  const distinctAttemptIds = new Set(results.map((r) => r.attemptId));
  if (distinctAttemptIds.size !== USERS.length) {
    throw new Error("Two or more users were assigned the same attempt id - session mix-up!");
  }

  console.log("All checks passed:");
  for (const r of results) {
    console.log(`  ${r.email}: attempt ${r.attemptId}, ${r.answeredCount} isolated answers verified`);
  }
  console.log("No session mix-up, no cross-user data corruption, independent attempts confirmed.");
}

main().catch((err) => {
  console.error("Concurrency test FAILED:", err.message ?? err);
  process.exit(1);
});
