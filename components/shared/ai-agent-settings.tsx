"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyRound, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { AIProvider } from "@/lib/models";
import { PROVIDER_LABELS } from "@/lib/ai/providers";

const PROVIDERS: AIProvider[] = ["anthropic", "openai", "google"];

export function AiAgentSettings() {
  const [saved, setSaved] = useState<Set<AIProvider>>(new Set());
  const [drafts, setDrafts] = useState<Record<AIProvider, string>>({
    anthropic: "",
    openai: "",
    google: "",
  });
  const [busy, setBusy] = useState<AIProvider | null>(null);

  async function load() {
    const res = await fetch("/api/api-keys");
    const data = await res.json();
    setSaved(new Set((data.providers ?? []).map((p: { provider: AIProvider }) => p.provider)));
  }

  useEffect(() => {
    load();
  }, []);

  async function save(provider: AIProvider) {
    const apiKey = drafts[provider].trim();
    if (!apiKey) return;
    setBusy(provider);
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });
      if (res.ok) {
        toast.success(`${PROVIDER_LABELS[provider]} key saved`);
        setDrafts((d) => ({ ...d, [provider]: "" }));
        await load();
      } else {
        const data = await res.json();
        toast.error(data.error ?? "Failed to save key");
      }
    } finally {
      setBusy(null);
    }
  }

  async function remove(provider: AIProvider) {
    setBusy(provider);
    try {
      await fetch(`/api/api-keys/${provider}`, { method: "DELETE" });
      toast.success(`${PROVIDER_LABELS[provider]} key removed`);
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="size-4" /> AI Agents
        </CardTitle>
        <CardDescription>
          Paste your own API key for any provider you want to use in the AI Tutor and Prompt
          Playground. Keys are encrypted at rest and never shown again after saving.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {PROVIDERS.map((provider) => (
          <div key={provider} className="space-y-2 rounded-md border p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{PROVIDER_LABELS[provider]}</span>
              {saved.has(provider) ? (
                <Badge variant="default">Key saved</Badge>
              ) : (
                <Badge variant="outline">Not connected</Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder={saved.has(provider) ? "Enter a new key to replace it" : "Paste API key"}
                value={drafts[provider]}
                onChange={(e) => setDrafts((d) => ({ ...d, [provider]: e.target.value }))}
              />
              <Button
                size="sm"
                onClick={() => save(provider)}
                disabled={busy === provider || !drafts[provider].trim()}
              >
                Save
              </Button>
              {saved.has(provider) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => remove(provider)}
                  disabled={busy === provider}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
