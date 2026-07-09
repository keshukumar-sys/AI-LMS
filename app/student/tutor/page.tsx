"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, User, Send, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_MODELS, PROVIDER_LABELS } from "@/lib/ai/providers";
import type { AIProvider } from "@/lib/models";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT =
  "You are a friendly, encouraging AI tutor for a 3-day AI Bootcamp (AI Fundamentals, Generative AI & LLMs, and AI Applications & Ethics). Keep answers short, concrete, and beginner-friendly. Never solve live assessment questions directly - guide the student toward the answer instead.";

export default function StudentTutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! Ask me anything about the bootcamp material - AI fundamentals, LLMs, prompt engineering, ethics, or anything else.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<AIProvider>("anthropic");
  const [model, setModel] = useState(DEFAULT_MODELS.anthropic[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function onProviderChange(p: AIProvider) {
    setProvider(p);
    setModel(DEFAULT_MODELS[p][0]);
  }

  async function send() {
    if (!input.trim() || streaming) return;
    setError(null);
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: input };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          model,
          systemPrompt: SYSTEM_PROMPT,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong talking to the AI provider.");
        return;
      }
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", content: data.reply }]);
    } catch {
      setError("Network error reaching the AI provider.");
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Tutor</h1>
          <CardDescription>Chat with the bootcamp tutor, powered by your own AI agent.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={provider} onValueChange={(v) => v && onProviderChange(v as AIProvider)}>
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
          <Select value={model} onValueChange={(v) => v && setModel(v)}>
            <SelectTrigger className="w-48">
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
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardHeader className="border-b py-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bot className="size-4 text-primary" /> Tutor &middot; {PROVIDER_LABELS[provider]}
          </CardTitle>
        </CardHeader>
        <CardContent ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto py-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4 text-primary" />}
              </div>
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {streaming && (
            <div className="flex gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
                <Bot className="size-4 text-primary" />
              </div>
              <div className="max-w-[80%] rounded-lg bg-muted px-3 py-2 text-sm">
                <span className="animate-pulse">&hellip;</span>
              </div>
            </div>
          )}
        </CardContent>
        {error && (
          <div className="flex items-start gap-2 border-t bg-destructive/5 px-3 py-2 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              {error}{" "}
              <Link href="/student/settings" className="underline underline-offset-2">
                Go to Settings
              </Link>
            </span>
          </div>
        )}
        <div className="flex items-end gap-2 border-t p-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask the tutor anything about this lesson..."
            rows={1}
            className="resize-none"
          />
          <Button onClick={send} disabled={streaming || !input.trim()}>
            <Send className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
