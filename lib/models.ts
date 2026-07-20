import type { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { LessonBlock } from "@/lib/curriculum/blocks";

// ---------- Users ----------

export type Role = "admin" | "student";

export interface UserDoc {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  xp: number;
  createdAt: Date;
  lastLoginAt?: Date;
  currentStreak?: number;
  longestStreak?: number;
  lastActiveDate?: string; // "YYYY-MM-DD", drives streak calculation
}

// ---------- Courses (self-paced catalog, admin-authored) ----------

export interface CourseLessonDoc {
  id: string;
  title: string;
  estMinutes: number;
  status: "not_started" | "in_progress" | "done";
  content?: string;
  pdfUrl?: string;
  contentBlocks?: LessonBlock[];
}

export interface CourseModuleDoc {
  id: string;
  title: string;
  lessons: CourseLessonDoc[];
}

export interface CourseDoc {
  _id?: ObjectId;
  slug?: string;
  title: string;
  description: string;
  isPublished: boolean;
  modules: CourseModuleDoc[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- Bootcamp content (seeded from the 3-day curriculum + source chapters) ----------

export interface BootcampQuizQuestion {
  id: string;
  question: string;
}

export interface BootcampMCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number; // 0-3, matches options order
}

export interface BootcampScenario {
  id: string;
  question: string;
  modelAnswer: string;
}

export interface BootcampLesson {
  id: string;
  title: string;
  summary: string;
}

export interface BootcampDayContent {
  _id?: ObjectId;
  dayNumber: 1 | 2 | 3;
  title: string;
  chaptersCovered: string;
  learningObjectives: string[];
  lessons: BootcampLesson[];
  liveDemonstrations: string[];
  practicalActivities: string[];
  individualExercise: string;
  groupExercise: string;
  quickQuiz: BootcampQuizQuestion[];
  mcqs: BootcampMCQ[];
  scenarios: BootcampScenario[];
  handsOnAssignment: string;
  trainerNotes: string[];
  sourceExcerpt: string; // raw text pulled from the original bootcamp PDF/docx chapter(s)
}

// ---------- Live Polls ----------

export type LiveStatus = "draft" | "live" | "closed";

export interface PollOption {
  id: string;
  label: string;
}

export interface PollDoc {
  _id?: ObjectId;
  title: string;
  question: string;
  options: PollOption[];
  dayNumber?: 1 | 2 | 3;
  status: LiveStatus;
  durationSec: number; // answer window, default 20
  startedAt?: Date;
  endsAt?: Date;
  createdBy: string; // admin user id
  createdAt: Date;
}

export interface PollResponseDoc {
  _id?: ObjectId;
  pollId: ObjectId;
  studentId: string;
  studentName: string;
  optionId: string;
  answeredAt: Date;
}

// ---------- Live Quizzes (single-question, scored, same launch model as polls) ----------

export interface QuizDoc {
  _id?: ObjectId;
  title: string;
  question: string;
  options: PollOption[];
  correctOptionId: string;
  dayNumber?: 1 | 2 | 3;
  status: LiveStatus;
  durationSec: number;
  startedAt?: Date;
  endsAt?: Date;
  createdBy: string;
  createdAt: Date;
}

export interface QuizResponseDoc {
  _id?: ObjectId;
  quizId: ObjectId;
  studentId: string;
  studentName: string;
  optionId: string;
  correct: boolean;
  answeredAt: Date;
}

// ---------- Assessments & quizzes (admin-authored, real Mongo-backed) ----------

export type QuestionKind = "mcq" | "multi" | "short_answer" | "prompt_task";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface AssessmentQuestion {
  id: string;
  kind: QuestionKind;
  body: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  topicTag: string;
  difficulty: Difficulty;
}

export interface AssessmentDoc {
  _id?: ObjectId;
  title: string;
  type: "quiz" | "assessment";
  instructions: string;
  timeLimitMin: number | null;
  isPublished: boolean;
  questions: AssessmentQuestion[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- Encrypted per-user AI provider API keys ----------

export type AIProvider = "anthropic" | "openai" | "google";

export interface ApiKeyDoc {
  _id?: ObjectId;
  userId: string;
  provider: AIProvider;
  iv: string;
  tag: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- Per-lesson progress (multi-user) ----------

export type LessonStatus = "not_started" | "in_progress" | "done";

export interface ProgressDoc {
  _id?: ObjectId;
  userId: string;
  courseId: string;
  moduleId: string;
  lessonId: string;
  status: LessonStatus;
  completionPercentage: number; // 0-100
  quizScore?: number; // 0-100, this lesson's embedded quiz, last attempt
  xpAwarded: number; // total XP already granted for this lesson (idempotency guard)
  updatedAt: Date;
  completedAt?: Date;
}

// ---------- Module assessments (question bank, MongoDB-backed) ----------

export type QuestionType = "mcq" | "scenario" | "practical" | "subjective" | "ai_challenge";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionDoc {
  _id?: ObjectId;
  moduleId: string; // matches curriculum module ids, e.g. "m1-ai-foundations"
  questionType: QuestionType;
  questionText: string;
  options?: QuestionOption[]; // mcq only
  correctAnswer?: string; // mcq only - a QuestionOption.id
  marks: number;
  order: number;
  createdAt: Date;
}

export type AttemptStatus = "in_progress" | "submitted" | "graded";

export interface AttemptAiEvaluation {
  technicalAccuracy: number;
  reasoning: number;
  practicalApplication: number;
  creativity: number;
  ethics: number;
  feedback: string;
}

export interface AttemptAnswer {
  questionId: string;
  questionType: QuestionType;
  selectedOptionId?: string;
  answerText?: string;
  isCorrect?: boolean;
  marksAwarded?: number;
  aiEvaluation?: AttemptAiEvaluation;
  answeredAt?: Date;
}

export interface AssessmentSectionScores {
  mcq: number;
  scenario: number;
  practical: number;
  subjective: number;
  challenge: number;
}

export interface AssessmentAttemptDoc {
  _id?: ObjectId;
  userId: string;
  moduleId: string;
  attemptNumber: number;
  status: AttemptStatus;
  startedAt: Date;
  submittedAt?: Date;
  timeLimitSec: number;
  answers: AttemptAnswer[];
  sectionScores?: AssessmentSectionScores;
  totalScore?: number; // 0-100, straight rubric sum
  finalScore?: number; // 0-100, weighted per the course scoring formula
  xpAwarded: number;
  createdAt: Date;
}

export interface XpLedgerDoc {
  _id?: ObjectId;
  userId: string;
  amount: number;
  reason: string;
  moduleId?: string;
  attemptId?: string;
  createdAt: Date;
}

// ---------- AI Practitioner Program registrations ----------

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface RegistrationDoc {
  _id?: ObjectId;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  experienceLevel: ExperienceLevel;
  currentRole: string;
  reasonForJoining: string;
  submittedAt: Date;
}

// ---------- Collection accessors ----------

export async function usersCol() {
  const db = await getDb();
  return db.collection<UserDoc>("users");
}

export async function bootcampContentCol() {
  const db = await getDb();
  return db.collection<BootcampDayContent>("bootcampContent");
}

export async function pollsCol() {
  const db = await getDb();
  return db.collection<PollDoc>("polls");
}

export async function pollResponsesCol() {
  const db = await getDb();
  return db.collection<PollResponseDoc>("pollResponses");
}

export async function quizzesCol() {
  const db = await getDb();
  return db.collection<QuizDoc>("quizzes");
}

export async function quizResponsesCol() {
  const db = await getDb();
  return db.collection<QuizResponseDoc>("quizResponses");
}

export async function coursesCol() {
  const db = await getDb();
  return db.collection<CourseDoc>("courses");
}

export async function assessmentsCol() {
  const db = await getDb();
  return db.collection<AssessmentDoc>("assessments");
}

export async function apiKeysCol() {
  const db = await getDb();
  return db.collection<ApiKeyDoc>("apiKeys");
}

export async function progressCol() {
  const db = await getDb();
  return db.collection<ProgressDoc>("progress");
}

export async function registrationsCol() {
  const db = await getDb();
  return db.collection<RegistrationDoc>("registrations");
}

export async function questionsCol() {
  const db = await getDb();
  return db.collection<QuestionDoc>("questions");
}

export async function assessmentAttemptsCol() {
  const db = await getDb();
  return db.collection<AssessmentAttemptDoc>("assessmentAttempts");
}

export async function xpLedgerCol() {
  const db = await getDb();
  return db.collection<XpLedgerDoc>("xpLedger");
}
