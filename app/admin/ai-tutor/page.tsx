"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sparkles, Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { tutorConfig } from "@/lib/mock-data";
import { DEFAULT_MODELS, PROVIDER_LABELS } from "@/lib/ai/providers";
import type { AIProvider } from "@/lib/models";

type QKind = "mcq" | "short_answer";
type Difficulty = "beginner" | "intermediate" | "advanced";

interface DraftQuestion {
  kind: QKind;
  body: string;
  options: string[];
  correctAnswer: string;
  points: number;
  topicTag: string;
  difficulty: Difficulty;
}

interface Assessment {
  _id: string;
  title: string;
  type: "quiz" | "assessment";
  instructions: string;
  timeLimitMin: number | null;
  isPublished: boolean;
  questions: {
    id: string;
    kind: string;
    body: string;
    topicTag: string;
    difficulty: string;
    points: number;
  }[];
}

function blankQuestion(): DraftQuestion {
  return {
    kind: "mcq",
    body: "",
    options: ["", ""],
    correctAnswer: "",
    points: 1,
    topicTag: "general",
    difficulty: "beginner",
  };
}

export default function AdminAiTutorPage() {
  const [socratic, setSocratic] = useState(tutorConfig.socraticMode);

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  const [newOpen, setNewOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"quiz" | "assessment">("quiz");
  const [instructions, setInstructions] = useState("");
  const [timeLimitMin, setTimeLimitMin] = useState("");
  const [questions, setQuestions] = useState<DraftQuestion[]>([blankQuestion()]);

  const [genOpen, setGenOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [genTopic, setGenTopic] = useState("");
  const [genCount, setGenCount] = useState(3);
  const [genDifficulty, setGenDifficulty] = useState<Difficulty>("beginner");
  const [genProvider, setGenProvider] = useState<AIProvider>("anthropic");
  const [genModel, setGenModel] = useState(DEFAULT_MODELS.anthropic[0]);

  async function loadAssessments() {
    setLoading(true);
    try {
      const res = await fetch("/api/assessments");
      const data = await res.json();
      setAssessments(data.assessments ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssessments();
  }, []);

  function resetNewForm() {
    setTitle("");
    setType("quiz");
    setInstructions("");
    setTimeLimitMin("");
    setQuestions([blankQuestion()]);
    setCreateError(null);
  }

  function updateQuestion(i: number, patch: Partial<DraftQuestion>) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    setQuestions((qs) =>
      qs.map((q, idx) =>
        idx === qIndex ? { ...q, options: q.options.map((o, i) => (i === oIndex ? value : o)) } : q
      )
    );
  }

  async function createAssessment() {
    setCreateError(null);
    if (!title.trim()) {
      setCreateError("Title is required.");
      return;
    }
    const cleaned = questions
      .filter((q) => q.body.trim())
      .map((q) => ({
        kind: q.kind,
        body: q.body.trim(),
        options: q.kind === "mcq" ? q.options.map((o) => o.trim()).filter(Boolean) : undefined,
        correctAnswer: q.correctAnswer.trim() || undefined,
        points: q.points,
        topicTag: q.topicTag.trim() || "general",
        difficulty: q.difficulty,
      }));
    if (cleaned.length === 0) {
      setCreateError("Add at least one question with a body.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          type,
          instructions: instructions.trim(),
          timeLimitMin: timeLimitMin ? Number(timeLimitMin) : null,
          questions: cleaned,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error ?? "Failed to create assessment.");
        return;
      }
      toast.success("Assessment created as a draft");
      setNewOpen(false);
      resetNewForm();
      await loadAssessments();
    } finally {
      setCreating(false);
    }
  }

  async function generateWithAi() {
    setGenError(null);
    if (!genTopic.trim()) {
      setGenError("A topic is required.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/assessments/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: genTopic.trim(),
          count: genCount,
          difficulty: genDifficulty,
          provider: genProvider,
          model: genModel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenError(data.error ?? "Failed to generate a draft.");
        return;
      }
      toast.success(`Draft with ${data.questionCount} questions created`, {
        description: "It's now in the list below, marked Draft - review and publish when ready.",
      });
      setGenOpen(false);
      setGenTopic("");
      await loadAssessments();
    } finally {
      setGenerating(false);
    }
  }

  async function togglePublish(a: Assessment) {
    const res = await fetch(`/api/assessments/${a._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !a.isPublished }),
    });
    if (res.ok) {
      toast.success(a.isPublished ? "Unpublished" : "Published");
      await loadAssessments();
    }
  }

  async function removeAssessment(id: string) {
    const res = await fetch(`/api/assessments/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Assessment deleted");
      await loadAssessments();
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Tutor</h1>
        <p className="text-sm text-muted-foreground">
          Configure the role-aware tutor and manage assessments, quizzes, and the question bank.
        </p>
      </div>

      <Tabs defaultValue="config">
        <TabsList>
          <TabsTrigger value="config">Tutor Config</TabsTrigger>
          <TabsTrigger value="assessments">Assessments &amp; Quizzes</TabsTrigger>
          <TabsTrigger value="bank">Question Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Model &amp; behavior</CardTitle>
              <CardDescription>
                One gateway routes every AI task; swapping providers is a dropdown, not a rewrite.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select defaultValue={tutorConfig.provider}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
                      <SelectItem value="openai">OpenAI (GPT)</SelectItem>
                      <SelectItem value="google">Google (Gemini)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select defaultValue={tutorConfig.model}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-sonnet-5">claude-sonnet-5</SelectItem>
                      <SelectItem value="claude-opus-4-8">claude-opus-4-8</SelectItem>
                      <SelectItem value="claude-haiku-4-5-20251001">claude-haiku-4-5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>System prompt</Label>
                <Textarea defaultValue={tutorConfig.systemPrompt} rows={4} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Socratic mode</p>
                  <p className="text-sm text-muted-foreground">
                    Tutor asks guiding questions instead of giving direct answers.
                  </p>
                </div>
                <Switch checked={socratic} onCheckedChange={setSocratic} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Guardrails</p>
                  <p className="text-sm text-muted-foreground">
                    Refuses to solve live assessment questions; per-user rate limits enforced.
                  </p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <Button onClick={() => toast.success("Tutor config saved")}>Save changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {assessments.length} assessments &middot; {assessments.filter((a) => a.isPublished).length} published
            </p>
            <div className="flex gap-2">
              <Dialog open={genOpen} onOpenChange={setGenOpen}>
                <DialogTrigger render={<Button variant="outline" size="sm" />}>
                  <Sparkles className="size-4" />
                  Generate with AI
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Generate a draft with AI</DialogTitle>
                    <DialogDescription>
                      Uses your saved provider API key from Settings. The draft is saved unpublished so you can
                      review it below first.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label>Topic / lesson</Label>
                      <Textarea
                        value={genTopic}
                        onChange={(e) => setGenTopic(e.target.value)}
                        placeholder="e.g. Tokenization and context windows"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label># Questions</Label>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          value={genCount}
                          onChange={(e) => setGenCount(Number(e.target.value) || 3)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Difficulty</Label>
                        <Select value={genDifficulty} onValueChange={(v) => v && setGenDifficulty(v as Difficulty)}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Provider</Label>
                        <Select
                          value={genProvider}
                          onValueChange={(v) => {
                            if (!v) return;
                            const p = v as AIProvider;
                            setGenProvider(p);
                            setGenModel(DEFAULT_MODELS[p][0]);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(PROVIDER_LABELS) as AIProvider[]).map((p) => (
                              <SelectItem key={p} value={p}>
                                {PROVIDER_LABELS[p]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Model</Label>
                        <Select value={genModel} onValueChange={(v) => v && setGenModel(v)}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DEFAULT_MODELS[genProvider].map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {genError && <p className="text-sm text-destructive">{genError}</p>}
                  </div>
                  <DialogFooter>
                    <Button onClick={generateWithAi} disabled={generating}>
                      {generating ? "Generating..." : "Generate draft"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={newOpen}
                onOpenChange={(open) => {
                  setNewOpen(open);
                  if (!open) resetNewForm();
                }}
              >
                <DialogTrigger render={<Button size="sm" />}>
                  <Plus className="size-4" />
                  New Assessment
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>New assessment</DialogTitle>
                    <DialogDescription>Created as a draft - publish it once you're happy with it.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Title</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Day 1 Quiz" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Type</Label>
                        <Select value={type} onValueChange={(v) => v && setType(v as "quiz" | "assessment")}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quiz">Quiz</SelectItem>
                            <SelectItem value="assessment">Assessment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Instructions</Label>
                        <Input
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="5 quick questions..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Time limit (min, optional)</Label>
                        <Input
                          type="number"
                          min={1}
                          value={timeLimitMin}
                          onChange={(e) => setTimeLimitMin(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Questions</Label>
                      {questions.map((q, qi) => (
                        <div key={qi} className="space-y-2 rounded-md border p-3">
                          <div className="flex items-center justify-between gap-2">
                            <Select value={q.kind} onValueChange={(v) => v && updateQuestion(qi, { kind: v as QKind })}>
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mcq">Multiple choice</SelectItem>
                                <SelectItem value="short_answer">Short answer</SelectItem>
                              </SelectContent>
                            </Select>
                            {questions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setQuestions((qs) => qs.filter((_, i) => i !== qi))}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </div>
                          <Input
                            value={q.body}
                            onChange={(e) => updateQuestion(qi, { body: e.target.value })}
                            placeholder="Question text"
                          />
                          {q.kind === "mcq" ? (
                            <div className="space-y-1.5">
                              {q.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => updateQuestion(qi, { correctAnswer: opt })}
                                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                                      q.correctAnswer && q.correctAnswer === opt
                                        ? "border-emerald-500 bg-emerald-500 text-white"
                                        : "border-muted-foreground/30 text-transparent"
                                    }`}
                                    title="Mark as correct answer"
                                  >
                                    ✓
                                  </button>
                                  <Input
                                    value={opt}
                                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                                    placeholder={`Option ${oi + 1}`}
                                  />
                                  {q.options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateQuestion(qi, { options: q.options.filter((_, i) => i !== oi) })
                                      }
                                      className="text-muted-foreground hover:text-destructive"
                                    >
                                      <X className="size-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              {q.options.length < 6 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuestion(qi, { options: [...q.options, ""] })}
                                >
                                  <Plus className="size-3.5" /> Add option
                                </Button>
                              )}
                            </div>
                          ) : (
                            <Input
                              value={q.correctAnswer}
                              onChange={(e) => updateQuestion(qi, { correctAnswer: e.target.value })}
                              placeholder="Model answer (optional)"
                            />
                          )}
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              type="number"
                              min={1}
                              value={q.points}
                              onChange={(e) => updateQuestion(qi, { points: Number(e.target.value) || 1 })}
                              placeholder="Points"
                            />
                            <Input
                              value={q.topicTag}
                              onChange={(e) => updateQuestion(qi, { topicTag: e.target.value })}
                              placeholder="Topic tag"
                            />
                            <Select
                              value={q.difficulty}
                              onValueChange={(v) => v && updateQuestion(qi, { difficulty: v as Difficulty })}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => setQuestions((qs) => [...qs, blankQuestion()])}>
                        <Plus className="size-3.5" /> Add question
                      </Button>
                    </div>
                    {createError && <p className="text-sm text-destructive">{createError}</p>}
                  </div>
                  <DialogFooter>
                    <Button onClick={createAssessment} disabled={creating}>
                      {creating ? "Creating..." : "Create draft"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading assessments...</p>
          ) : assessments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No assessments yet - create one manually or generate a draft with AI.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {assessments.map((a) => (
                <Card key={a._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{a.title}</CardTitle>
                      <Badge variant={a.isPublished ? "default" : "secondary"}>
                        {a.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <CardDescription>{a.instructions || "No instructions."}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{a.questions.length} questions</span>
                      <span>{a.timeLimitMin ? `${a.timeLimitMin} min` : "No limit"}</span>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {a.questions.slice(0, 3).map((q) => (
                        <li key={q.id} className="truncate">
                          &bull; {q.body}
                        </li>
                      ))}
                      {a.questions.length > 3 && <li>&hellip; {a.questions.length - 3} more</li>}
                    </ul>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => togglePublish(a)}>
                        {a.isPublished ? "Unpublish" : "Publish"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removeAssessment(a._id)}>
                        <Trash2 className="size-3.5" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bank" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {assessments.flatMap((a) => a.questions).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No questions yet - questions from every assessment you create show up here.
                </p>
              ) : (
                <ul className="divide-y">
                  {assessments.flatMap((a) => a.questions).map((q) => (
                    <li key={q.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">{q.body}</p>
                        <p className="text-xs text-muted-foreground">
                          {q.topicTag} &middot; {q.difficulty} &middot; {q.points} pt{q.points > 1 ? "s" : ""}
                        </p>
                      </div>
                      <Badge variant="outline">{q.kind}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
