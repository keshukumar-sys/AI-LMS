import Link from "next/link";
import { Trophy, ClipboardCheck, ArrowRight, PlayCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { assessmentAttemptsCol } from "@/lib/models";
import { ASSESSMENT_MODULES } from "@/lib/assessment-modules";

export default async function StudentAssessmentsPage() {
  const session = await getSession();
  if (!session) return null;

  const col = await assessmentAttemptsCol();
  const attempts = await col.find({ userId: session.userId }).toArray();

  const byModule = new Map<string, { best?: number; inProgress: boolean; attemptCount: number }>();
  for (const a of attempts) {
    const entry = byModule.get(a.moduleId) ?? { best: undefined, inProgress: false, attemptCount: 0 };
    entry.attemptCount += 1;
    if (a.status === "in_progress") entry.inProgress = true;
    if (a.status === "graded" && typeof a.totalScore === "number") {
      entry.best = entry.best === undefined ? a.totalScore : Math.max(entry.best, a.totalScore);
    }
    byModule.set(a.moduleId, entry);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Assessments</h1>
          <p className="text-sm text-muted-foreground">
            8 module assessments — MCQs, scenarios, a practical task, subjective questions, and an
            AI-evaluated challenge. 100 marks each.
          </p>
        </div>
        <Link href="/student/leaderboard">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Trophy className="size-3.5 text-amber-500" />
            Leaderboard
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ASSESSMENT_MODULES.map((m, i) => {
          const stats = byModule.get(m.moduleId);
          return (
            <Card key={m.moduleId} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs">
                    Module {i + 1}
                  </Badge>
                  {stats?.best !== undefined ? (
                    <Badge variant="default">{stats.best}/100</Badge>
                  ) : stats?.inProgress ? (
                    <Badge variant="secondary">In progress</Badge>
                  ) : (
                    <Badge variant="outline">Not started</Badge>
                  )}
                </div>
                <CardTitle className="text-base">{m.title}</CardTitle>
                <CardDescription>{m.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex items-center justify-between pt-0">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ClipboardCheck className="size-3.5" />
                  28 questions · 100 marks
                </span>
                <Link href={`/student/assessments/${m.moduleId}`}>
                  <Button size="sm" className="gap-1.5">
                    {stats?.inProgress ? (
                      <>
                        <PlayCircle className="size-3.5" /> Continue
                      </>
                    ) : stats?.best !== undefined ? (
                      <>
                        Review <ArrowRight className="size-3.5" />
                      </>
                    ) : (
                      <>
                        Start <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
