"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Award, Zap, Workflow, BookCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const scoreHistory = [
  { attempt: "Attempt 1", score: 62 },
  { attempt: "Attempt 2", score: 71 },
  { attempt: "Attempt 3", score: 78 },
  { attempt: "Attempt 4", score: 88 },
];

const badges = [
  { label: "First Lesson", icon: BookCheck, earned: true },
  { label: "Automation Builder", icon: Workflow, earned: true },
  { label: "7-Day Streak", icon: Zap, earned: false },
  { label: "Top Scorer", icon: Award, earned: false },
];

const topicsMastered = ["AI Fundamentals basics", "Hallucination detection", "Prompt anatomy"];

export default function StudentProgressPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
        <p className="text-sm text-muted-foreground">Scores over time, topics mastered, and badges.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score trend</CardTitle>
          <CardDescription>Across your last 4 quiz attempts</CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="attempt" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Topics mastered</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {topicsMastered.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Badges</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {badges.map((b) => (
              <div
                key={b.label}
                className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center ${
                  b.earned ? "" : "opacity-40"
                }`}
              >
                <b.icon className="size-6 text-primary" />
                <span className="text-xs font-medium">{b.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
