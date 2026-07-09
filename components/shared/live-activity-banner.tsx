"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Vote, ListChecks, Timer, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Option {
  id: string;
  label: string;
}

interface ActiveItem {
  id: string;
  title: string;
  question: string;
  options: Option[];
  endsAt: string;
  durationSec: number;
}

type Kind = "poll" | "quiz";

export function LiveActivityBanner() {
  const [kind, setKind] = useState<Kind | null>(null);
  const [item, setItem] = useState<ActiveItem | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctness, setCorrectness] = useState<null | boolean>(null);
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(Date.now());
  const lastSeenId = useRef<string | null>(null);

  const checkActive = useCallback(async () => {
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);
        return res.ok ? await res.json() : {};
      } catch {
        return {};
      }
    };
    const [pollRes, quizRes] = await Promise.all([safeFetch("/api/polls/active"), safeFetch("/api/quizzes/active")]);

    const active: { kind: Kind; item: ActiveItem } | null = quizRes.quiz
      ? { kind: "quiz", item: quizRes.quiz }
      : pollRes.poll
      ? { kind: "poll", item: pollRes.poll }
      : null;

    if (!active) {
      setKind(null);
      setItem(null);
      lastSeenId.current = null;
      return;
    }

    if (lastSeenId.current !== active.item.id) {
      lastSeenId.current = active.item.id;
      setAnswered(false);
      setCorrectness(null);
    }
    setKind(active.kind);
    setItem(active.item);
  }, []);

  useEffect(() => {
    checkActive();
    const interval = setInterval(checkActive, 2000);
    return () => clearInterval(interval);
  }, [checkActive]);

  useEffect(() => {
    if (!item) return;
    const tick = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(tick);
  }, [item]);

  async function submit(optionId: string) {
    if (!item || !kind || submitting || answered) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/${kind === "poll" ? "polls" : "quizzes"}/${item.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      const data = await res.json();
      if (res.ok) {
        setAnswered(true);
        if (kind === "quiz") setCorrectness(!!data.correct);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!item || !kind) return null;

  const secondsLeft = Math.max(0, Math.ceil((new Date(item.endsAt).getTime() - now) / 1000));
  const timeUp = secondsLeft <= 0;

  return (
    <Card className="mb-6 border-primary/40 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            {kind === "poll" ? <Vote className="size-4 text-primary" /> : <ListChecks className="size-4 text-primary" />}
            Live {kind === "poll" ? "Poll" : "Quiz"}: {item.title}
          </CardTitle>
          <Badge variant={timeUp ? "outline" : "default"} className="gap-1">
            <Timer className="size-3.5" /> {timeUp ? "Time's up" : `${secondsLeft}s`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm font-medium">{item.question}</p>
        {answered ? (
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
            {kind === "quiz"
              ? correctness
                ? "Answer submitted - correct! +10 XP"
                : "Answer submitted - not quite, better luck next time."
              : "Answer submitted - thanks!"}
          </div>
        ) : timeUp ? (
          <p className="text-sm text-muted-foreground">Time&apos;s up - answers are closed.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {item.options.map((opt) => (
              <Button
                key={opt.id}
                variant="outline"
                className="justify-start"
                disabled={submitting}
                onClick={() => submit(opt.id)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
