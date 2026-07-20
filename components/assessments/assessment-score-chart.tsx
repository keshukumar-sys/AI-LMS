"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";

export function AssessmentScoreChart({ data }: { data: { label: string; value: number; max: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
        <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }}
          formatter={(v, _n, item) => [`${v} / ${item.payload.max}`, "Score"]}
        />
        <Bar dataKey="value" fill="var(--chart-3)" radius={[4, 4, 0, 0]} maxBarSize={48}>
          <LabelList dataKey="value" position="top" fill="var(--muted-foreground)" fontSize={11} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
