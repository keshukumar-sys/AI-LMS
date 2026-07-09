"use client";

import { useState } from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { assessments, type Assessment } from "@/lib/mock-data";

function AttemptFlow({ assessment, onExit }: { assessment: Assessment; onExit: () => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [grading, setGrading] = useState(false);

  function submit() {
    setGrading(true);
    setTimeout(() => {
      setGrading(false);
      setSubmitted(true);
    }, 1000);
  }

  const score = Math.round(70 + Math.random() * 25);

  if (submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald-600" />
            Attempt submitted
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-3xl font-semibold">{score}%</p>
          <p className="text-sm text-muted-foreground">
            AI feedback: Solid grasp of the fundamentals. Review &ldquo;tokens &amp; context windows&rdquo;
            for a stronger score on the next attempt.
          </p>
          <Button variant="outline" onClick={onExit}>
            Back to assessments
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{assessment.title}</CardTitle>
          {assessment.timeLimitMin && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="size-3" /> {assessment.timeLimitMin} min
            </Badge>
          )}
        </div>
        <CardDescription>{assessment.instructions}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {assessment.questions.map((q, i) => (
          <div key={q.id} className="space-y-2">
            <p className="text-sm font-medium">
              {i + 1}. {q.body}
            </p>
            {q.kind === "mcq" && q.options ? (
              <div className="space-y-1.5">
                {q.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <Textarea
                rows={3}
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                placeholder="Your answer..."
              />
            )}
          </div>
        ))}
        <Button onClick={submit} disabled={grading}>
          {grading ? "Grading..." : "Submit attempt"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function StudentAssessmentsPage() {
  const [active, setActive] = useState<Assessment | null>(null);

  if (active) {
    return (
      <div className="max-w-2xl">
        <AttemptFlow assessment={active} onExit={() => setActive(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assessments &amp; Quizzes</h1>
        <p className="text-sm text-muted-foreground">Attempts, timers, auto + AI grading, feedback.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {assessments.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle className="text-base">{a.title}</CardTitle>
              <CardDescription>{a.instructions}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{a.questions.length} questions</span>
              <Button size="sm" onClick={() => setActive(a)}>
                Start attempt
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
