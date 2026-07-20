"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Clock, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_MODELS, PROVIDER_LABELS } from "@/lib/ai/providers";
import type { AIProvider, QuestionType } from "@/lib/models";
import { QUESTION_TYPE_LABELS } from "@/lib/assessment-modules";
import { cn } from "@/lib/utils";

interface RunnerQuestion {
  _id: string;
  questionType: QuestionType;
  questionText: string;
  options?: { id: string; text: string }[];
  marks: number;
  order: number;
}

interface RunnerAnswer {
  questionId: string;
  selectedOptionId?: string;
  answerText?: string;
}

export function AttemptRunner({
  moduleId,
  moduleTitle,
  attempt,
  questions,
  savedProviders,
}: {
  moduleId: string;
  moduleTitle: string;
  attempt: { _id: string; startedAt: string; timeLimitSec: number; answers: RunnerAnswer[] };
  questions: RunnerQuestion[];
  savedProviders: AIProvider[];
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, RunnerAnswer>>(() => {
    const map: Record<string, RunnerAnswer> = {};
    for (const a of attempt.answers) map[a.questionId] = a;
    return map;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [provider, setProvider] = useState<AIProvider>(savedProviders[0] ?? "anthropic");
  const [model, setModel] = useState(DEFAULT_MODELS[savedProviders[0] ?? "anthropic"][0]);
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const deadline = useMemo(() => new Date(attempt.startedAt).getTime() + attempt.timeLimitSec * 1000, [attempt]);
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, Math.round((deadline - Date.now()) / 1000)));
  const submittedRef = useRef(false);

  const answeredCount = Object.values(answers).filter((a) => a.selectedOptionId || a.answerText?.trim()).length;
  const current = questions[currentIndex];

  const submit = useMemo(
    () => async () => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setSubmitting(true);
      try {
        const res = await fetch(`/api/assessment-attempts/${attempt._id}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider, model }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? "Could not submit the assessment.");
          submittedRef.current = false;
          setSubmitting(false);
          return;
        }
        router.push(`/student/assessments/${moduleId}/attempt/${attempt._id}/result`);
      } catch {
        toast.error("Network error while submitting.");
        submittedRef.current = false;
        setSubmitting(false);
      }
    },
    [attempt._id, moduleId, model, provider, router]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(interval);
        submit();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline, submit]);

  function saveAnswer(questionId: string, questionType: QuestionType, payload: Partial<RunnerAnswer>) {
    setAnswers((prev) => ({ ...prev, [questionId]: { ...prev[questionId], ...payload, questionId } }));

    if (debounceRef.current[questionId]) clearTimeout(debounceRef.current[questionId]);
    debounceRef.current[questionId] = setTimeout(async () => {
      try {
        await fetch(`/api/assessment-attempts/${attempt._id}/answer`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId, questionType, ...payload }),
        });
      } catch {
        // autosave failures are non-fatal; the answer is still saved at submit time via local state
      }
    }, 600);
  }

  function onProviderChange(p: AIProvider) {
    setProvider(p);
    setModel(DEFAULT_MODELS[p][0]);
  }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const timeCritical = timeLeft <= 300;

  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      <div className="order-2 space-y-3 lg:order-1">
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-5 gap-1.5 lg:grid-cols-4">
              {questions.map((q, i) => {
                const answered = !!(answers[q._id]?.selectedOptionId || answers[q._id]?.answerText?.trim());
                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-md border text-xs font-medium transition-colors",
                      i === currentIndex && "ring-2 ring-primary",
                      answered ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="order-1 space-y-4 lg:order-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{moduleTitle}</h1>
            <p className="text-xs text-muted-foreground">
              Question {currentIndex + 1} of {questions.length} &middot; {answeredCount}/{questions.length} answered
            </p>
          </div>
          <Badge variant={timeCritical ? "destructive" : "secondary"} className="gap-1.5 text-sm">
            <Clock className="size-3.5" /> {mm}:{ss}
          </Badge>
        </div>

        <Progress value={(answeredCount / questions.length) * 100} />

        {current && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline">{QUESTION_TYPE_LABELS[current.questionType]}</Badge>
                <span className="text-xs text-muted-foreground">{current.marks} marks</span>
              </div>
              <CardTitle className="whitespace-pre-wrap text-base font-medium leading-relaxed">
                {current.questionText}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {current.questionType === "mcq" && current.options ? (
                <div className="space-y-2">
                  {current.options.map((opt) => (
                    <label
                      key={opt.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm transition-colors",
                        answers[current._id]?.selectedOptionId === opt.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      <input
                        type="radio"
                        name={current._id}
                        checked={answers[current._id]?.selectedOptionId === opt.id}
                        onChange={() => saveAnswer(current._id, current.questionType, { selectedOptionId: opt.id })}
                      />
                      {opt.text}
                    </label>
                  ))}
                </div>
              ) : (
                <Textarea
                  rows={8}
                  placeholder="Write your answer..."
                  value={answers[current._id]?.answerText ?? ""}
                  onChange={(e) => saveAnswer(current._id, current.questionType, { answerText: e.target.value })}
                />
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => i - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next
            </Button>
          </div>
          <Button className="gap-1.5" onClick={() => setConfirmOpen(true)}>
            <Send className="size-4" /> Submit assessment
          </Button>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit this assessment?</DialogTitle>
            <DialogDescription>
              {answeredCount}/{questions.length} questions answered.
              {answeredCount < questions.length && ` ${questions.length - answeredCount} question(s) are unanswered and will score 0.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm font-medium">Grade scenario/practical/subjective/challenge answers using:</p>
            <div className="flex gap-2">
              <Select value={provider} onValueChange={(v) => v && onProviderChange(v as AIProvider)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PROVIDER_LABELS) as AIProvider[]).map((p) => (
                    <SelectItem key={p} value={p}>
                      {PROVIDER_LABELS[p]} {savedProviders.includes(p) ? "" : "(no key saved)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={model} onValueChange={(v) => v && setModel(v)}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_MODELS[provider].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!savedProviders.includes(provider) && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                No {PROVIDER_LABELS[provider]} key saved. Add one in Settings first, or pick a provider you&apos;ve
                already connected.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Keep working
            </Button>
            <Button onClick={submit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit for grading"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
