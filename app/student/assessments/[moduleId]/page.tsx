import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ListChecks, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { assessmentAttemptsCol, apiKeysCol } from "@/lib/models";
import { getAssessmentModule, SECTION_BREAKDOWN, ASSESSMENT_TIME_LIMIT_SEC } from "@/lib/assessment-modules";
import { StartAssessmentButton } from "@/components/assessments/start-assessment-button";

export default async function AssessmentModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const moduleInfo = getAssessmentModule(moduleId);
  if (!moduleInfo) notFound();

  const session = await getSession();
  if (!session) return null;

  const [attempts, savedKeys] = await Promise.all([
    assessmentAttemptsCol().then((col) => col.find({ userId: session.userId, moduleId }).sort({ createdAt: -1 }).toArray()),
    apiKeysCol().then((col) => col.find({ userId: session.userId }).toArray()),
  ]);

  const inProgress = attempts.find((a) => a.status === "in_progress");
  const graded = attempts.filter((a) => a.status === "graded");

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/student/assessments" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> All assessments
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{moduleInfo.title}</h1>
        <p className="text-sm text-muted-foreground">{moduleInfo.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="size-4" /> Assessment structure
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <Clock className="size-3.5" /> {Math.round(ASSESSMENT_TIME_LIMIT_SEC / 60)} minute time limit · 100 marks total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {SECTION_BREAKDOWN.map((s) => (
              <li key={s.key} className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-medium">{s.marks} marks</span>
              </li>
            ))}
          </ul>
          {savedKeys.length === 0 && (
            <p className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
              Scenario, practical, subjective, and AI-challenge questions are graded by an LLM using your own API
              key. Add one in{" "}
              <Link href="/student/settings" className="underline underline-offset-2">
                Settings
              </Link>{" "}
              before submitting.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <StartAssessmentButton moduleId={moduleId} resumeAttemptId={inProgress?._id?.toString()} />
      </div>

      {graded.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="size-4" /> Past attempts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {graded.map((a) => (
              <Link
                key={a._id!.toString()}
                href={`/student/assessments/${moduleId}/attempt/${a._id!.toString()}/result`}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                <span>
                  Attempt {a.attemptNumber} &middot;{" "}
                  {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : ""}
                </span>
                <Badge variant={((a.totalScore ?? 0) >= 60) ? "default" : "secondary"}>{a.totalScore ?? 0}/100</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
