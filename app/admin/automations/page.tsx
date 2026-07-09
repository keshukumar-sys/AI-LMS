"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Plus, Clock, DollarSign, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkflowViewer } from "@/components/automation/workflow-viewer";
import { automations } from "@/lib/mock-data";

export default function AdminAutomationsPage() {
  const [selectedId, setSelectedId] = useState(automations[0].id);
  const selected = automations.find((a) => a.id === selectedId)!;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Automation Hub</h1>
          <p className="text-sm text-muted-foreground">
            Curate showcases students explore, run, and get inspired by.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Draft showcase created", {
                description: "AI drafted a workflow, description, and ROI estimate. Review and publish.",
              })
            }
          >
            <Sparkles className="size-4" />
            Generate showcase with AI
          </Button>
          <Button>
            <Plus className="size-4" />
            New Showcase
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          {automations.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedId(a.id)}
              className={`w-full rounded-lg border p-3 text-left transition-colors ${
                a.id === selectedId ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{a.title}</p>
                <Badge variant="secondary" className="capitalize">
                  {a.category}
                </Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.problem}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selected.title}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {selected.difficulty}
                </Badge>
              </div>
              <CardDescription>{selected.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {selected.tools.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>

              <WorkflowViewer nodes={selected.workflow.nodes} edges={selected.workflow.edges} />

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  <Clock className="size-5 text-primary/70" />
                  <div>
                    <p className="text-lg font-semibold">{selected.roi.hoursSavedWk}h</p>
                    <p className="text-xs text-muted-foreground">saved / week</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  <DollarSign className="size-5 text-primary/70" />
                  <div>
                    <p className="text-lg font-semibold">${selected.roi.costSavedMo}</p>
                    <p className="text-xs text-muted-foreground">saved / month</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  <ShieldCheck className="size-5 text-primary/70" />
                  <div>
                    <p className="text-lg font-semibold">{selected.roi.errorReduction}%</p>
                    <p className="text-xs text-muted-foreground">error reduction</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Demo Script</CardTitle>
              <CardDescription>Sample input &amp; expected output for &ldquo;Run Demo&rdquo;.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Input:</span> {selected.demoScript.input}
              </p>
              {Object.entries(selected.demoScript.nodeOutputs).map(([nodeId, output]) => (
                <p key={nodeId} className="text-muted-foreground">
                  <span className="font-mono text-xs">{nodeId}</span> &rarr; {output}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
