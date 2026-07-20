"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trophy, Flame, ArrowLeft, Medal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface LeaderboardRow {
  rank: number;
  userId: string;
  name: string;
  xp: number;
  averageScore: number;
  completedModules: number;
  currentStreak: number;
}

type Range = "daily" | "weekly" | "overall";

function LeaderboardTable({ range }: { range: Range }) {
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/leaderboard?range=${range}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setRows(data.leaderboard ?? []);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  if (!rows) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>;
  }
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No activity in this window yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Rank</TableHead>
          <TableHead>Student</TableHead>
          <TableHead className="text-right">XP</TableHead>
          <TableHead className="text-right">Avg score</TableHead>
          <TableHead className="text-right">Modules done</TableHead>
          <TableHead className="text-right">Streak</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.userId}>
            <TableCell>
              {r.rank <= 3 ? (
                <Medal
                  className={cn(
                    "size-4",
                    r.rank === 1 && "text-amber-500",
                    r.rank === 2 && "text-slate-400",
                    r.rank === 3 && "text-orange-700"
                  )}
                />
              ) : (
                <span className="text-muted-foreground">{r.rank}</span>
              )}
            </TableCell>
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell className="text-right">{r.xp}</TableCell>
            <TableCell className="text-right">{r.averageScore}</TableCell>
            <TableCell className="text-right">{r.completedModules}</TableCell>
            <TableCell className="text-right">
              {r.currentStreak > 0 ? (
                <span className="inline-flex items-center gap-1">
                  <Flame className="size-3.5 text-orange-500" /> {r.currentStreak}
                </span>
              ) : (
                "-"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/student/assessments" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Assessments
      </Link>

      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Trophy className="size-6 text-amber-500" /> Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground">Ranked by XP from assessments, quizzes, and lessons.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rankings</CardTitle>
          <CardDescription>Daily and weekly rankings are based on XP earned in that window; overall uses lifetime XP.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overall">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="overall">Overall</TabsTrigger>
            </TabsList>
            <TabsContent value="daily">
              <LeaderboardTable range="daily" />
            </TabsContent>
            <TabsContent value="weekly">
              <LeaderboardTable range="weekly" />
            </TabsContent>
            <TabsContent value="overall">
              <LeaderboardTable range="overall" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
