"use client";

import { useEffect, useState, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Vote, ListChecks, PlayCircle, StopCircle, Plus, X, Timer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Kind = "poll" | "quiz";

interface Option {
  id: string;
  label: string;
}

interface ListItem {
  _id: string;
  title: string;
  question: string;
  options: Option[];
  status: "draft" | "live" | "closed";
  correctOptionId?: string;
  dayNumber?: number;
  durationSec: number;
}

interface ResultsData {
  poll?: { id: string; title: string; question: string; status: string; endsAt?: string };
  quiz?: { id: string; title: string; question: string; status: string; endsAt?: string; correctOptionId: string };
  total: number;
  correctCount?: number;
  accuracyPercent?: number;
  chartData: { optionId: string; label: string; count: number; percent: number; isCorrect?: boolean }[];
  responses: {
    studentId: string;
    studentName: string;
    optionId: string;
    optionLabel: string;
    correct?: boolean;
    answeredAt: string;
  }[];
}

const CORRECT_COLOR = "#22c55e";
const BAR_COLOR = "#6366f1";

export default function AdminLivePage() {
  const [kind, setKind] = useState<Kind>("poll");
  const [items, setItems] = useState<ListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [now, setNow] = useState(Date.now());

  // ---- create form state ----
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [dayNumber, setDayNumber] = useState<string>("");
  const [durationSec, setDurationSec] = useState(20);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadList = useCallback(async (k: Kind) => {
    const res = await fetch(k === "poll" ? "/api/polls" : "/api/quizzes");
    const data = await res.json();
    setItems(data.polls ?? data.quizzes ?? []);
  }, []);

  useEffect(() => {
    loadList(kind);
    setSelectedId(null);
    setResults(null);
  }, [kind, loadList]);

  const loadResults = useCallback(
    async (id: string) => {
      const res = await fetch(kind === "poll" ? `/api/polls/${id}/results` : `/api/quizzes/${id}/results`);
      if (res.ok) setResults(await res.json());
    },
    [kind]
  );

  // Poll for live results + refresh the list while something might be live.
  useEffect(() => {
    if (!selectedId) return;
    loadResults(selectedId);
    const interval = setInterval(() => {
      loadResults(selectedId);
      setNow(Date.now());
    }, 1200);
    return () => clearInterval(interval);
  }, [selectedId, loadResults]);

  useEffect(() => {
    const interval = setInterval(() => loadList(kind), 4000);
    return () => clearInterval(interval);
  }, [kind, loadList]);

  function resetForm() {
    setTitle("");
    setQuestion("");
    setOptions(["", ""]);
    setCorrectIndex(0);
    setDayNumber("");
    setDurationSec(20);
    setFormError(null);
  }

  function updateOption(i: number, value: string) {
    setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)));
  }

  function addOption() {
    if (options.length < 4) setOptions((prev) => [...prev, ""]);
  }

  function removeOption(i: number) {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, idx) => idx !== i));
    if (correctIndex >= options.length - 1) setCorrectIndex(0);
  }

  async function createAndLaunch() {
    setFormError(null);
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!title.trim() || !question.trim() || cleanOptions.length < 2) {
      setFormError("Title, question, and at least 2 options are required.");
      return;
    }
    setCreating(true);
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        question: question.trim(),
        options: cleanOptions,
        durationSec,
      };
      if (dayNumber) body.dayNumber = Number(dayNumber);
      if (kind === "quiz") body.correctIndex = correctIndex;

      const createRes = await fetch(kind === "poll" ? "/api/polls" : "/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const createData = await createRes.json();
      if (!createRes.ok) {
        setFormError(createData.error ?? "Failed to create.");
        return;
      }
      const id = createData.id as string;
      const launchRes = await fetch(
        kind === "poll" ? `/api/polls/${id}/launch` : `/api/quizzes/${id}/launch`,
        { method: "POST" }
      );
      if (!launchRes.ok) {
        setFormError("Created but failed to launch.");
        return;
      }
      resetForm();
      await loadList(kind);
      setSelectedId(id);
    } finally {
      setCreating(false);
    }
  }

  async function launch(id: string) {
    await fetch(kind === "poll" ? `/api/polls/${id}/launch` : `/api/quizzes/${id}/launch`, {
      method: "POST",
    });
    await loadList(kind);
    setSelectedId(id);
  }

  async function closeNow(id: string) {
    await fetch(kind === "poll" ? `/api/polls/${id}/close` : `/api/quizzes/${id}/close`, {
      method: "POST",
    });
    await loadList(kind);
    if (selectedId === id) loadResults(id);
  }

  const selected = items.find((i) => i._id === selectedId);
  const secondsLeft =
    selected?.status === "live" && results?.poll?.endsAt
      ? Math.max(0, Math.ceil((new Date(results.poll.endsAt).getTime() - now) / 1000))
      : selected?.status === "live" && results?.quiz?.endsAt
      ? Math.max(0, Math.ceil((new Date(results.quiz.endsAt).getTime() - now) / 1000))
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Live Polls &amp; Quizzes</h1>
        <p className="text-sm text-muted-foreground">
          Launch a poll or quiz, watch answers come in live, and see the results as a chart.
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant={kind === "poll" ? "default" : "outline"} size="sm" onClick={() => setKind("poll")}>
          <Vote className="size-4" /> Polls
        </Button>
        <Button variant={kind === "quiz" ? "default" : "outline"} size="sm" onClick={() => setKind("quiz")}>
          <ListChecks className="size-4" /> Quizzes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Create + History */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                New {kind === "poll" ? "Poll" : "Quiz"}
              </CardTitle>
              <CardDescription>Students get a {durationSec}s window to answer once launched.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Day 1 Poll" />
              </div>
              <div className="space-y-1.5">
                <Label>Question</Label>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Where could AI help you most?"
                />
              </div>
              <div className="space-y-2">
                <Label>Options {kind === "quiz" && "(select the correct one)"}</Label>
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {kind === "quiz" && (
                      <button
                        type="button"
                        onClick={() => setCorrectIndex(i)}
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs",
                          correctIndex === i
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-muted-foreground/30 text-transparent"
                        )}
                        title="Mark as correct answer"
                      >
                        ✓
                      </button>
                    )}
                    <Input
                      value={opt}
                      onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
                {options.length < 4 && (
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    <Plus className="size-3.5" /> Add option
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Day (optional)</Label>
                  <Input
                    value={dayNumber}
                    onChange={(e) => setDayNumber(e.target.value)}
                    placeholder="1, 2, or 3"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Answer window (sec)</Label>
                  <Input
                    type="number"
                    min={5}
                    max={120}
                    value={durationSec}
                    onChange={(e) => setDurationSec(Number(e.target.value) || 20)}
                  />
                </div>
              </div>
              {formError && <p className="text-sm text-destructive">{formError}</p>}
              <Button className="w-full" onClick={createAndLaunch} disabled={creating}>
                <PlayCircle className="size-4" />
                {creating ? "Launching..." : `Create & Launch ${kind === "poll" ? "Poll" : "Quiz"}`}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">History</CardTitle>
              <CardDescription>Click one to view results, or relaunch it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.length === 0 && (
                <p className="text-sm text-muted-foreground">No {kind}s created yet.</p>
              )}
              {items.map((item) => (
                <div
                  key={item._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(item._id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(item._id);
                    }
                  }}
                  className={cn(
                    "w-full cursor-pointer rounded-md border p-3 text-left text-sm transition-colors",
                    selectedId === item._id ? "border-primary bg-primary/5" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{item.title}</span>
                    <Badge
                      variant={
                        item.status === "live" ? "default" : item.status === "closed" ? "outline" : "secondary"
                      }
                      className="capitalize"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.question}</p>
                  {item.status !== "live" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        launch(item._id);
                      }}
                    >
                      <PlayCircle className="size-3.5" /> {item.status === "draft" ? "Launch" : "Relaunch"}
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Live results */}
        <div className="lg:col-span-3">
          {!selected || !results ? (
            <Card className="flex h-full min-h-72 items-center justify-center">
              <CardContent className="pt-6 text-center text-sm text-muted-foreground">
                Select a {kind} from the history list to see live results.
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{selected.title}</CardTitle>
                    <CardDescription>{selected.question}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {selected.status === "live" && secondsLeft !== null && (
                      <Badge variant="default" className="gap-1">
                        <Timer className="size-3.5" /> {secondsLeft}s left
                      </Badge>
                    )}
                    <Badge
                      variant={selected.status === "live" ? "default" : "outline"}
                      className="capitalize"
                    >
                      {selected.status}
                    </Badge>
                    {selected.status === "live" && (
                      <Button size="sm" variant="destructive" onClick={() => closeNow(selected._id)}>
                        <StopCircle className="size-3.5" /> Close now
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    <strong className="text-foreground">{results.total}</strong> answered
                  </span>
                  {kind === "quiz" && (
                    <span>
                      <strong className="text-foreground">{results.accuracyPercent ?? 0}%</strong> correct
                    </span>
                  )}
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.chartData} layout="vertical" margin={{ left: 16, right: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="label" width={120} tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value, _name, props: { payload?: { percent?: number } }) => [
                          `${value} (${props.payload?.percent ?? 0}%)`,
                          "Answers",
                        ]}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {results.chartData.map((d) => (
                          <Cell key={d.optionId} fill={d.isCorrect ? CORRECT_COLOR : BAR_COLOR} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium">Who answered what</h3>
                  <div className="max-h-64 overflow-y-auto rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-muted/60 text-xs text-muted-foreground">
                        <tr>
                          <th className="p-2 text-left">Student</th>
                          <th className="p-2 text-left">Answer</th>
                          {kind === "quiz" && <th className="p-2 text-left">Result</th>}
                          <th className="p-2 text-left">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.responses.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-3 text-center text-muted-foreground">
                              No answers yet.
                            </td>
                          </tr>
                        )}
                        {results.responses.map((r) => (
                          <tr key={r.studentId} className="border-t">
                            <td className="p-2">{r.studentName}</td>
                            <td className="p-2">{r.optionLabel}</td>
                            {kind === "quiz" && (
                              <td className="p-2">
                                <Badge variant={r.correct ? "default" : "outline"}>
                                  {r.correct ? "Correct" : "Incorrect"}
                                </Badge>
                              </td>
                            )}
                            <td className="p-2 text-muted-foreground">
                              {new Date(r.answeredAt).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
