"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Wand2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_MODELS, PROVIDER_LABELS } from "@/lib/ai/providers";
import type { AIProvider } from "@/lib/models";

const COACH_SYSTEM_PROMPT =
  "You are a prompt-engineering coach for an AI Bootcamp student. Given a prompt they wrote, give 2-3 sentences of specific, actionable feedback on how to improve it (role, context, format, examples), referencing what it already does well.";

interface Slot {
  provider: AIProvider;
  model: string;
  output: string;
  error: string | null;
  loading: boolean;
}

function makeSlot(provider: AIProvider): Slot {
  return { provider, model: DEFAULT_MODELS[provider][0], output: "", error: null, loading: false };
}

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState(
    'Summarize this support ticket in 3 bullet points: "I was charged twice this month for my subscription, please refund the extra charge ASAP, this is really frustrating."'
  );
  const [slotA, setSlotA] = useState<Slot>(makeSlot("anthropic"));
  const [slotB, setSlotB] = useState<Slot>(makeSlot("openai"));
  const [ran, setRan] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [coaching, setCoaching] = useState(false);

  async function runOne(slot: Slot, setSlot: (s: Slot) => void) {
    setSlot({ ...slot, loading: true, error: null, output: "" });
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: slot.provider,
          model: slot.model,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSlot({ ...slot, loading: false, error: data.error ?? "Request failed." });
        return;
      }
      setSlot({ ...slot, loading: false, output: data.reply });
    } catch {
      setSlot({ ...slot, loading: false, error: "Network error reaching the AI provider." });
    }
  }

  async function run() {
    setRan(true);
    setFeedback(null);
    await Promise.all([runOne(slotA, setSlotA), runOne(slotB, setSlotB)]);
  }

  async function coach() {
    setCoaching(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: slotA.provider,
          model: slotA.model,
          systemPrompt: COACH_SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      setFeedback(res.ok ? data.reply : (data.error ?? "Coaching request failed."));
    } catch {
      setFeedback("Network error reaching the AI provider.");
    } finally {
      setCoaching(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Prompt Playground</h1>
        <p className="text-sm text-muted-foreground">
          Write a prompt, pick models, compare outputs side-by-side, and get AI coaching. Uses the AI
          agent keys you saved in{" "}
          <Link href="/student/settings" className="underline underline-offset-2">
            Settings
          </Link>
          .
        </p>
      </div>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} />
          <div className="flex flex-wrap gap-2">
            <Button onClick={run} disabled={slotA.loading || slotB.loading}>
              <Wand2 className="size-4" />
              {slotA.loading || slotB.loading ? "Running..." : "Run on both models"}
            </Button>
            <Button variant="outline" onClick={coach} disabled={coaching}>
              <Sparkles className="size-4" />
              {coaching ? "Thinking..." : "Get AI coaching"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {ran && (
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { slot: slotA, setSlot: setSlotA },
            { slot: slotB, setSlot: setSlotB },
          ].map(({ slot, setSlot }, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Select
                    value={slot.provider}
                    onValueChange={(v) => v && setSlot(makeSlot(v as AIProvider))}
                  >
                    <SelectTrigger className="w-40">
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
                  <Select value={slot.model} onValueChange={(m) => m && setSlot({ ...slot, model: m })}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEFAULT_MODELS[slot.provider].map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {slot.loading && <p className="text-sm text-muted-foreground">Running...</p>}
                {slot.error && (
                  <div className="flex items-start gap-2 text-sm text-destructive">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <span>
                      {slot.error}{" "}
                      <Link href="/student/settings" className="underline underline-offset-2">
                        Settings
                      </Link>
                    </span>
                  </div>
                )}
                {!slot.loading && !slot.error && slot.output && (
                  <pre className="whitespace-pre-wrap text-sm">{slot.output}</pre>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {feedback && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Coaching</CardTitle>
            <CardDescription>Improve your prompt</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
