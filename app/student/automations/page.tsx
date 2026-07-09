"use client";

import { useState } from "react";
import { PlayCircle, Clock, DollarSign, Plus, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkflowViewer } from "@/components/automation/workflow-viewer";
import { automations, type Automation } from "@/lib/mock-data";

function GalleryTab() {
  const [selected, setSelected] = useState<Automation>(automations[0]);
  const [running, setRunning] = useState(false);
  const [visibleNodeIds, setVisibleNodeIds] = useState<string[]>([]);

  function runDemo() {
    setRunning(true);
    setVisibleNodeIds([]);
    const order = selected.workflow.nodes.map((n) => n.id);
    order.forEach((id, i) => {
      setTimeout(() => {
        setVisibleNodeIds((prev) => [...prev, id]);
        if (i === order.length - 1) setRunning(false);
      }, (i + 1) * 700);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-3">
        {automations.map((a) => (
          <button
            key={a.id}
            onClick={() => {
              setSelected(a);
              setVisibleNodeIds([]);
            }}
            className={`w-full rounded-lg border p-3 text-left transition-colors ${
              a.id === selected.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{a.title}</p>
              <Badge variant="secondary" className="capitalize text-xs">
                {a.category}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Saves ~{a.roi.hoursSavedWk} hrs/week</p>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selected.title}</CardTitle>
              <CardDescription>{selected.problem}</CardDescription>
            </div>
            <Button onClick={runDemo} disabled={running}>
              <PlayCircle className="size-4" />
              {running ? "Running..." : "Run Demo"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <WorkflowViewer
            nodes={selected.workflow.nodes}
            edges={selected.workflow.edges}
            activeNodeIds={visibleNodeIds}
          />
          <div className="grid gap-3 sm:grid-cols-2">
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
          </div>
          {visibleNodeIds.length > 0 && (
            <div className="space-y-1.5 rounded-lg border bg-muted/20 p-3 text-sm">
              <p className="font-medium">Input: {selected.demoScript.input}</p>
              {Object.entries(selected.demoScript.nodeOutputs)
                .filter(([nodeId]) => visibleNodeIds.includes(nodeId))
                .map(([nodeId, output]) => (
                  <p key={nodeId} className="text-muted-foreground">
                    <span className="font-mono text-xs">{nodeId}</span> &rarr; {output}
                  </p>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RoiCalculatorTab() {
  const [tasksPerWeek, setTasksPerWeek] = useState(20);
  const [minutesPerTask, setMinutesPerTask] = useState(15);
  const [hourlyCost, setHourlyCost] = useState(25);

  const hoursPerWeek = (tasksPerWeek * minutesPerTask) / 60;
  const costPerWeek = hoursPerWeek * hourlyCost;
  const costPerMonth = costPerWeek * 4.33;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Your ROI</CardTitle>
        <CardDescription>Enter your own numbers &mdash; this is the selling moment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Tasks / week</Label>
            <Input
              type="number"
              value={tasksPerWeek}
              onChange={(e) => setTasksPerWeek(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Minutes / task</Label>
            <Input
              type="number"
              value={minutesPerTask}
              onChange={(e) => setMinutesPerTask(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Hourly cost ($)</Label>
            <Input
              type="number"
              value={hourlyCost}
              onChange={(e) => setHourlyCost(Number(e.target.value) || 0)}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-primary/5 p-4 text-center">
            <p className="text-3xl font-semibold">{hoursPerWeek.toFixed(1)}h</p>
            <p className="text-sm text-muted-foreground">saved per week</p>
          </div>
          <div className="rounded-lg border bg-primary/5 p-4 text-center">
            <p className="text-3xl font-semibold">${costPerMonth.toFixed(0)}</p>
            <p className="text-sm text-muted-foreground">saved per month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type SandboxNode = { id: string; type: "trigger" | "ai" | "action"; label: string };

function SandboxTab() {
  const [flow, setFlow] = useState<SandboxNode[]>([]);
  const [review, setReview] = useState<string | null>(null);

  function addNode(type: SandboxNode["type"], label: string) {
    setFlow((f) => [...f, { id: `${type}-${Date.now()}`, type, label }]);
    setReview(null);
  }

  function runSimulation() {
    const hasTrigger = flow.some((n) => n.type === "trigger");
    const hasAi = flow.some((n) => n.type === "ai");
    const hasAction = flow.some((n) => n.type === "action");
    if (!hasTrigger || !hasAi || !hasAction) {
      setReview("Your flow is missing a piece — a solid automation needs a Trigger, an AI step, and an Action. Add the missing block(s) and try again.");
    } else {
      setReview("Nice — this is a complete Trigger → AI → Action flow. In production this would run for real; here it's simulated. Consider adding a second AI step to also draft a follow-up message.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Node palette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addNode("trigger", "New form submitted")}>
            <Plus className="size-3.5" /> Trigger
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addNode("ai", "Summarize with AI")}>
            <Plus className="size-3.5" /> AI Step
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => addNode("action", "Send to Slack")}>
            <Plus className="size-3.5" /> Action
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Your flow</CardTitle>
            <CardDescription>Build-your-own sandbox &mdash; assemble a basic flow and get AI Tutor feedback.</CardDescription>
          </CardHeader>
          <CardContent>
            {flow.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add blocks from the palette to get started.</p>
            ) : (
              <ol className="space-y-2">
                {flow.map((n, i) => (
                  <li key={n.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                    <span>
                      {i + 1}. <Badge variant="secondary" className="mr-2 capitalize">{n.type}</Badge>
                      {n.label}
                    </span>
                    <button onClick={() => setFlow((f) => f.filter((x) => x.id !== n.id))}>
                      <X className="size-3.5 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ol>
            )}
            <Button className="mt-4" onClick={runSimulation} disabled={flow.length === 0}>
              <PlayCircle className="size-4" />
              Run simulation
            </Button>
          </CardContent>
        </Card>

        {review && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="size-4 text-primary" />
                AI Tutor review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{review}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function StudentAutomationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Automation Hub</h1>
        <p className="text-sm text-muted-foreground">
          Explore what&apos;s possible, run demos, and calculate what it&apos;s worth to you.
        </p>
      </div>

      <Tabs defaultValue="gallery">
        <TabsList>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
          <TabsTrigger value="sandbox">Build Your Own</TabsTrigger>
        </TabsList>
        <TabsContent value="gallery" className="mt-4">
          <GalleryTab />
        </TabsContent>
        <TabsContent value="roi" className="mt-4">
          <RoiCalculatorTab />
        </TabsContent>
        <TabsContent value="sandbox" className="mt-4">
          <SandboxTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
