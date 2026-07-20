import Link from "next/link";
import { ObjectId } from "mongodb";
import { Award, Zap, Trophy, BookCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { coursesCol, progressCol, usersCol } from "@/lib/models";
import { ModuleCompletionChart, QuizScoreChart } from "@/components/progress/progress-charts";

export default async function StudentProgressPage() {
  const session = await getSession();
  if (!session) return null;

  const [course, progressDocs, userDoc] = await Promise.all([
    coursesCol().then((col) => col.findOne({ isPublished: true })),
    progressCol().then((col) => col.find({ userId: session.userId }).toArray()),
    usersCol().then((col) => col.findOne({ _id: new ObjectId(session.userId) })),
  ]);

  const progressByLesson = new Map(progressDocs.map((p) => [p.lessonId, p]));
  const modules = course?.modules ?? [];
  const allLessons = modules.flatMap((m) => m.lessons);

  const doneCount = allLessons.filter((l) => progressByLesson.get(l.id)?.status === "done").length;
  const overallPct = allLessons.length > 0 ? Math.round((doneCount / allLessons.length) * 100) : 0;

  const moduleCompletion = modules.map((m) => {
    const done = m.lessons.filter((l) => progressByLesson.get(l.id)?.status === "done").length;
    return { label: m.title, value: m.lessons.length > 0 ? Math.round((done / m.lessons.length) * 100) : 0 };
  });

  const quizScores = allLessons
    .map((l) => ({ label: l.title.length > 18 ? `${l.title.slice(0, 18)}…` : l.title, value: progressByLesson.get(l.id)?.quizScore }))
    .filter((q): q is { label: string; value: number } => typeof q.value === "number");

  const topicsMastered = modules.filter((m) => m.lessons.length > 0 && m.lessons.every((l) => progressByLesson.get(l.id)?.status === "done"));

  const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((s, q) => s + q.value, 0) / quizScores.length) : null;

  const badges = [
    { label: "First Lesson", icon: BookCheck, earned: doneCount > 0 },
    { label: "Module Master", icon: Trophy, earned: topicsMastered.length > 0 },
    { label: "Quiz Ace", icon: Award, earned: avgQuizScore !== null && avgQuizScore >= 90 },
    { label: "Halfway There", icon: Zap, earned: overallPct >= 50 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Progress</h1>
          <p className="text-sm text-muted-foreground">Your curriculum completion, quiz scores, and badges.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 text-sm">
            <Zap className="size-3.5 text-amber-500" />
            {userDoc?.xp ?? 0} XP total
          </Badge>
          <Link href="/student/leaderboard">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Trophy className="size-3.5 text-amber-500" />
              Leaderboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overall completion</CardTitle>
            <CardDescription>
              {doneCount}/{allLessons.length} lessons complete ({overallPct}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {moduleCompletion.length > 0 ? (
              <ModuleCompletionChart data={moduleCompletion} />
            ) : (
              <p className="text-sm text-muted-foreground">No curriculum published yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quiz scores</CardTitle>
            <CardDescription>
              {avgQuizScore !== null ? `Average score: ${avgQuizScore}%` : "Complete a lesson quiz to see your scores here."}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {quizScores.length > 0 ? (
              <QuizScoreChart data={quizScores} />
            ) : (
              <p className="text-sm text-muted-foreground">No quiz attempts yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Modules mastered</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {topicsMastered.length === 0 && (
              <p className="text-sm text-muted-foreground">Complete every lesson in a module to master it.</p>
            )}
            {topicsMastered.map((m) => (
              <Badge key={m.id} variant="secondary">
                {m.title}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Badges</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {badges.map((b) => (
              <div
                key={b.label}
                className={`flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 text-center transition-all duration-200 ${
                  b.earned ? "bg-secondary shadow-sm" : "opacity-40"
                }`}
              >
                <b.icon className={`size-6 ${b.earned ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs font-medium">{b.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
