import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { ArrowLeft, Trophy, Zap, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { assessmentAttemptsCol, questionsCol } from "@/lib/models";
import { getAssessmentModule, QUESTION_TYPE_LABELS } from "@/lib/assessment-modules";
import { AssessmentScoreChart } from "@/components/assessments/assessment-score-chart";
import { StartAssessmentButton } from "@/components/assessments/start-assessment-button";

export default async function AssessmentResultPage({
  params,
}: {
  params: Promise<{ moduleId: string; attemptId: string }>;
}) {
  const { moduleId, attemptId } = await params;
  const moduleInfo = getAssessmentModule(moduleId);
  if (!moduleInfo) notFound();

  const session = await getSession();
  if (!session) return null;

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(attemptId);
  } catch {
    notFound();
  }

  const col = await assessmentAttemptsCol();
  const attempt = await col.findOne({ _id: objectId });
  if (!attempt || attempt.moduleId !== moduleId || attempt.userId !== session.userId) notFound();
  if (attempt.status !== "graded") {
    redirect(`/student/assessments/${moduleId}/attempt/${attemptId}`);
  }

  const qCol = await questionsCol();
  const questions = await qCol.find({ moduleId }).sort({ order: 1 }).toArray();
  const answersByQuestion = new Map(attempt.answers.map((a) => [a.questionId, a]));

  const scores = attempt.sectionScores ?? { mcq: 0, scenario: 0, practical: 0, subjective: 0, challenge: 0 };
  const chartData = [
    { label: "MCQ", value: scores.mcq, max: 40 },
    { label: "Scenario", value: scores.scenario, max: 20 },
    { label: "Practical", value: scores.practical, max: 10 },
    { label: "Subjective", value: scores.subjective, max: 20 },
    { label: "Challenge", value: scores.challenge, max: 10 },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href={`/student/assessments/${moduleId}`}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> {moduleInfo.title}
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="size-6 text-amber-500" /> {attempt.totalScore ?? 0}/100
              </CardTitle>
              <CardDescription>
                Attempt {attempt.attemptNumber} &middot; Weighted final score: {attempt.finalScore ?? 0}/100
              </CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1.5 text-sm">
              <Zap className="size-3.5 text-amber-500" /> +{attempt.xpAwarded} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="h-64">
          <AssessmentScoreChart data={chartData} />
        </CardContent>
      </Card>

      <StartAssessmentButton moduleId={moduleId} />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Review</h2>
        {questions.map((q, i) => {
          const qId = q._id!.toString();
          const given = answersByQuestion.get(qId);
          const isMcq = q.questionType === "mcq";
          const correctOption = isMcq ? q.options?.find((o) => o.id === q.correctAnswer) : undefined;
          const selectedOption = isMcq ? q.options?.find((o) => o.id === given?.selectedOptionId) : undefined;

          return (
            <Card key={qId}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline">{QUESTION_TYPE_LABELS[q.questionType]}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {given?.marksAwarded ?? 0}/{q.marks} marks
                  </span>
                </div>
                <CardTitle className="whitespace-pre-wrap text-sm font-medium leading-relaxed">
                  {i + 1}. {q.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {isMcq ? (
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-1.5">
                      {given?.isCorrect ? (
                        <CheckCircle2 className="size-4 text-emerald-600" />
                      ) : (
                        <XCircle className="size-4 text-destructive" />
                      )}
                      Your answer: <span className="font-medium">{selectedOption?.text ?? "(not answered)"}</span>
                    </p>
                    {!given?.isCorrect && (
                      <p className="text-muted-foreground">
                        Correct answer: <span className="font-medium text-foreground">{correctOption?.text}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap rounded-md border bg-muted/40 p-2.5 text-muted-foreground">
                      {given?.answerText || "(not answered)"}
                    </p>
                    {given?.aiEvaluation && (
                      <div className="space-y-2 rounded-md border border-primary/20 bg-primary/5 p-2.5">
                        <div className="flex flex-wrap gap-1.5 text-xs">
                          <Badge variant="secondary">Technical accuracy {given.aiEvaluation.technicalAccuracy}/30</Badge>
                          <Badge variant="secondary">Reasoning {given.aiEvaluation.reasoning}/25</Badge>
                          <Badge variant="secondary">Practical application {given.aiEvaluation.practicalApplication}/20</Badge>
                          <Badge variant="secondary">Creativity {given.aiEvaluation.creativity}/15</Badge>
                          <Badge variant="secondary">Ethics {given.aiEvaluation.ethics}/10</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{given.aiEvaluation.feedback}</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
