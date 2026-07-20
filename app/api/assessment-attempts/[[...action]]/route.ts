import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import {
  assessmentAttemptsCol,
  questionsCol,
  progressCol,
  apiKeysCol,
  type AIProvider,
  type AttemptAnswer,
  type QuestionDoc,
  type QuestionType,
} from "@/lib/models";
import { decryptSecret } from "@/lib/crypto";
import { evaluateAnswer } from "@/lib/ai/evaluate";
import { awardXp } from "@/lib/xp";
import { ASSESSMENT_TIME_LIMIT_SEC, getAssessmentModule } from "@/lib/assessment-modules";

const AI_GRADED_TYPES: QuestionType[] = ["scenario", "practical", "subjective", "ai_challenge"];

function serializeAttempt(a: Record<string, unknown> & { _id: ObjectId }) {
  return { ...a, _id: a._id.toString() };
}

async function startAttempt(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const moduleId = (body?.moduleId ?? "").trim();
  if (!moduleId || !getAssessmentModule(moduleId)) {
    return NextResponse.json({ error: "A valid moduleId is required." }, { status: 400 });
  }

  const col = await assessmentAttemptsCol();
  const existing = await col.findOne({ userId: session.userId, moduleId, status: "in_progress" });
  if (existing) {
    return NextResponse.json({ attempt: serializeAttempt(existing) });
  }

  const priorCount = await col.countDocuments({ userId: session.userId, moduleId });
  const now = new Date();
  const result = await col.insertOne({
    userId: session.userId,
    moduleId,
    attemptNumber: priorCount + 1,
    status: "in_progress",
    startedAt: now,
    timeLimitSec: ASSESSMENT_TIME_LIMIT_SEC,
    answers: [],
    xpAwarded: 0,
    createdAt: now,
  });

  const created = await col.findOne({ _id: result.insertedId });
  return NextResponse.json({ attempt: serializeAttempt(created!) });
}

async function saveAnswer(id: string, req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const questionId = (body?.questionId ?? "").trim();
  const questionType = body?.questionType as QuestionType;
  if (!questionId || !questionType) {
    return NextResponse.json({ error: "questionId and questionType are required." }, { status: 400 });
  }

  const col = await assessmentAttemptsCol();
  const attempt = await col.findOne({ _id: new ObjectId(id) });
  if (!attempt) return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
  if (attempt.userId !== session.userId) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (attempt.status !== "in_progress") {
    return NextResponse.json({ error: "This attempt has already been submitted." }, { status: 409 });
  }

  const answer: AttemptAnswer = {
    questionId,
    questionType,
    selectedOptionId: body?.selectedOptionId ? String(body.selectedOptionId) : undefined,
    answerText: body?.answerText !== undefined ? String(body.answerText) : undefined,
    answeredAt: new Date(),
  };

  const answers = attempt.answers.filter((a) => a.questionId !== questionId);
  answers.push(answer);

  await col.updateOne({ _id: attempt._id }, { $set: { answers } });
  return NextResponse.json({ ok: true });
}

async function submitAttempt(id: string, req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const provider = (body?.provider ?? "anthropic") as AIProvider;
  const model = (body?.model ?? "").trim();

  const col = await assessmentAttemptsCol();
  const attempt = await col.findOne({ _id: new ObjectId(id) });
  if (!attempt) return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
  if (attempt.userId !== session.userId) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (attempt.status !== "in_progress") {
    return NextResponse.json({ error: "This attempt has already been submitted." }, { status: 409 });
  }

  const qCol = await questionsCol();
  const questions = await qCol.find({ moduleId: attempt.moduleId }).toArray();
  if (questions.length === 0) {
    return NextResponse.json({ error: "This module has no questions yet." }, { status: 400 });
  }

  const hasAiGraded = questions.some((q) => AI_GRADED_TYPES.includes(q.questionType));
  let apiKey = "";
  if (hasAiGraded) {
    if (!model) {
      return NextResponse.json({ error: "A model must be selected to grade this assessment." }, { status: 400 });
    }
    const keys = await apiKeysCol();
    const saved = await keys.findOne({ userId: session.userId, provider });
    if (!saved) {
      return NextResponse.json(
        { error: `Add your ${provider} API key in Settings before submitting this assessment.` },
        { status: 400 }
      );
    }
    apiKey = decryptSecret(saved);
  }

  const answersByQuestion = new Map(attempt.answers.map((a) => [a.questionId, a]));
  const gradedAnswers: AttemptAnswer[] = [];
  const sectionScores = { mcq: 0, scenario: 0, practical: 0, subjective: 0, challenge: 0 };
  const sectionKey: Record<QuestionType, keyof typeof sectionScores> = {
    mcq: "mcq",
    scenario: "scenario",
    practical: "practical",
    subjective: "subjective",
    ai_challenge: "challenge",
  };

  try {
    await Promise.all(
      questions.map(async (q: QuestionDoc) => {
        const qId = q._id!.toString();
        const given = answersByQuestion.get(qId);

        if (q.questionType === "mcq") {
          const isCorrect = !!given?.selectedOptionId && given.selectedOptionId === q.correctAnswer;
          const marksAwarded = isCorrect ? q.marks : 0;
          sectionScores.mcq += marksAwarded;
          gradedAnswers.push({
            questionId: qId,
            questionType: q.questionType,
            selectedOptionId: given?.selectedOptionId,
            isCorrect,
            marksAwarded,
            answeredAt: given?.answeredAt,
          });
          return;
        }

        const evaluation = await evaluateAnswer({
          provider,
          apiKey,
          model,
          questionText: q.questionText,
          studentAnswer: given?.answerText ?? "",
          maxMarks: q.marks,
        });
        sectionScores[sectionKey[q.questionType]] += evaluation.marksAwarded;
        gradedAnswers.push({
          questionId: qId,
          questionType: q.questionType,
          answerText: given?.answerText,
          marksAwarded: evaluation.marksAwarded,
          aiEvaluation: {
            technicalAccuracy: evaluation.technicalAccuracy,
            reasoning: evaluation.reasoning,
            practicalApplication: evaluation.practicalApplication,
            creativity: evaluation.creativity,
            ethics: evaluation.ethics,
            feedback: evaluation.feedback,
          },
          answeredAt: given?.answeredAt,
        });
      })
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "The AI provider returned an error while grading.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const totalScore =
    sectionScores.mcq + sectionScores.scenario + sectionScores.practical + sectionScores.subjective + sectionScores.challenge;

  const progress = await progressCol();
  const moduleProgress = await progress.find({ userId: session.userId, moduleId: attempt.moduleId }).toArray();
  const participationPct = moduleProgress.length
    ? moduleProgress.reduce((sum, p) => sum + p.completionPercentage, 0) / moduleProgress.length
    : 0;

  const quizPct = (sectionScores.mcq / 40) * 100;
  const assignmentsPct = ((sectionScores.scenario + sectionScores.subjective) / 40) * 100;
  const practicalPct = (sectionScores.practical / 10) * 100;
  const challengePct = (sectionScores.challenge / 10) * 100;
  const finalScore = Math.round(
    quizPct * 0.4 + assignmentsPct * 0.25 + practicalPct * 0.2 + challengePct * 0.1 + participationPct * 0.05
  );

  const now = new Date();
  await col.updateOne(
    { _id: attempt._id },
    {
      $set: {
        answers: gradedAnswers,
        status: "graded",
        submittedAt: now,
        sectionScores,
        totalScore,
        finalScore,
        xpAwarded: totalScore,
      },
    }
  );

  await awardXp(session.userId, totalScore, `assessment:${attempt.moduleId}`, {
    moduleId: attempt.moduleId,
    attemptId: attempt._id!.toString(),
  });

  const updated = await col.findOne({ _id: attempt._id });
  return NextResponse.json({ attempt: serializeAttempt(updated!) });
}

async function getAttempt(id: string) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const col = await assessmentAttemptsCol();
  const attempt = await col.findOne({ _id: new ObjectId(id) });
  if (!attempt) return NextResponse.json({ error: "Attempt not found." }, { status: 404 });
  if (attempt.userId !== session.userId) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const qCol = await questionsCol();
  const questions = await qCol.find({ moduleId: attempt.moduleId }).sort({ order: 1 }).toArray();

  return NextResponse.json({
    attempt: serializeAttempt(attempt),
    questions: questions.map((q) => ({ ...q, _id: q._id!.toString() })),
  });
}

async function listMine(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const moduleId = new URL(req.url).searchParams.get("moduleId");
  const col = await assessmentAttemptsCol();
  const query: Record<string, unknown> = { userId: session.userId };
  if (moduleId) query.moduleId = moduleId;

  const docs = await col.find(query).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ attempts: docs.map(serializeAttempt) });
}

export async function GET(req: Request, { params }: { params: Promise<{ action?: string[] }> }) {
  const { action } = await params;
  if (action && action.length === 1 && action[0] === "mine") return listMine(req);
  if (action && action.length === 1) return getAttempt(action[0]);
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

export async function POST(req: Request, { params }: { params: Promise<{ action?: string[] }> }) {
  const { action } = await params;
  if (action && action.length === 1 && action[0] === "start") return startAttempt(req);
  if (action && action.length === 2 && action[1] === "submit") return submitAttempt(action[0], req);
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ action?: string[] }> }) {
  const { action } = await params;
  if (action && action.length === 2 && action[1] === "answer") return saveAnswer(action[0], req);
  return NextResponse.json({ error: "Not found." }, { status: 404 });
}
