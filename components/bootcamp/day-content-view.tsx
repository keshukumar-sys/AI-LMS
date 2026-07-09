"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BootcampDayContent } from "@/lib/models";

function McqItem({ mcq }: { mcq: BootcampDayContent["mcqs"][number] }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="rounded-md border p-3">
      <p className="mb-2 text-sm font-medium">{mcq.question}</p>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {mcq.options.map((opt, i) => {
          const isPicked = picked === i;
          const showCorrect = picked !== null && i === mcq.correctIndex;
          const showWrong = isPicked && i !== mcq.correctIndex;
          return (
            <button
              key={i}
              onClick={() => setPicked(i)}
              disabled={picked !== null}
              className={cn(
                "flex items-center justify-between rounded-md border px-2.5 py-1.5 text-left text-sm transition-colors",
                showCorrect && "border-emerald-500 bg-emerald-500/10",
                showWrong && "border-destructive bg-destructive/10",
                !showCorrect && !showWrong && "hover:bg-muted"
              )}
            >
              {opt}
              {showCorrect && <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />}
              {showWrong && <XCircle className="size-4 shrink-0 text-destructive" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RevealItem({ question, answer, answerLabel }: { question: string; answer: string; answerLabel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md border p-3">
      <p className="text-sm font-medium">{question}</p>
      {open ? (
        <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
      ) : (
        <Button variant="ghost" size="sm" className="mt-1 h-auto px-0 py-1" onClick={() => setOpen(true)}>
          {answerLabel} <ChevronDown className="size-3.5" />
        </Button>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

export function DayContentView({ dayNumber, showTrainerNotes }: { dayNumber: 1 | 2 | 3; showTrainerNotes?: boolean }) {
  const [day, setDay] = useState<BootcampDayContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sourceOpen, setSourceOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/bootcamp/${dayNumber}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.day) setDay(data.day);
        else setError(data.error ?? "Failed to load.");
      });
  }, [dayNumber]);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!day) return <p className="text-sm text-muted-foreground">Loading curriculum...</p>;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Day {day.dayNumber}: {day.title}
          </h2>
          <Badge variant="secondary">{day.chaptersCovered}</Badge>
        </div>
      </div>

      <Section title="Learning Objectives">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {day.learningObjectives.map((o, i) => (
            <li key={i}>{o}</li>
          ))}
        </ul>
      </Section>

      <Section title="Lessons">
        <div className="space-y-3">
          {day.lessons.map((l) => (
            <div key={l.id}>
              <p className="text-sm font-medium">{l.title}</p>
              <p className="text-sm text-muted-foreground">{l.summary}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Live Demonstrations">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {day.liveDemonstrations.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </Section>
        <Section title="Practical Activities">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {day.practicalActivities.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Individual Exercise">
          <p className="text-sm">{day.individualExercise}</p>
        </Section>
        <Section title="Group Exercise">
          <p className="text-sm">{day.groupExercise}</p>
        </Section>
      </div>

      <Section title="Quick Quiz (discuss with your group or trainer)">
        <ul className="list-decimal space-y-1 pl-5 text-sm">
          {day.quickQuiz.map((q) => (
            <li key={q.id}>{q.question}</li>
          ))}
        </ul>
      </Section>

      <Section title="Multiple Choice Questions">
        {day.mcqs.map((mcq) => (
          <McqItem key={mcq.id} mcq={mcq} />
        ))}
      </Section>

      <Section title="Scenario-Based Questions">
        {day.scenarios.map((s) => (
          <RevealItem key={s.id} question={s.question} answer={s.modelAnswer} answerLabel="Show model answer" />
        ))}
      </Section>

      <Section title="Hands-On Assignment">
        <p className="text-sm">{day.handsOnAssignment}</p>
      </Section>

      {showTrainerNotes && (
        <Section title="Trainer Notes">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {day.trainerNotes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </Section>
      )}

      <Card>
        <CardHeader className="pb-3">
          <button
            onClick={() => setSourceOpen((o) => !o)}
            className="flex w-full items-center justify-between text-left"
          >
            <div>
              <CardTitle className="text-base">Source Material</CardTitle>
              <CardDescription>The original bootcamp document text behind this day&apos;s lessons.</CardDescription>
            </div>
            {sourceOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        </CardHeader>
        {sourceOpen && (
          <CardContent>
            <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap text-xs text-muted-foreground">
              {day.sourceExcerpt}
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
