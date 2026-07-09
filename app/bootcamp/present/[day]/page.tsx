"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Video,
  Vote,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bootcampDays, type SegmentKind } from "@/lib/mock-data";

const segmentIcon: Record<SegmentKind, typeof FileText> = {
  slide: FileText,
  live_demo: Video,
  activity: Vote,
  recap: RotateCcw,
};

const segmentLabel: Record<SegmentKind, string> = {
  slide: "Slide",
  live_demo: "Live Demo",
  activity: "Activity",
  recap: "Recap",
};

export default function PresenterModePage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = use(params);
  const router = useRouter();
  const bootcampDay = bootcampDays.find((d) => d.dayNumber === Number(day)) ?? bootcampDays[0];
  const [index, setIndex] = useState(0);

  const segment = bootcampDay.segments[index];
  const Icon = segmentIcon[segment.kind];
  const isLast = index === bootcampDay.segments.length - 1;
  const isFirst = index === 0;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">Day {bootcampDay.dayNumber}</Badge>
          <span className="text-sm text-zinc-400">{bootcampDay.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">
            Segment {index + 1} / {bootcampDay.segments.length}
          </span>
          <Link href="/admin/bootcamp">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-50">
              <X className="size-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 flex items-center gap-2 text-zinc-400">
          <Icon className="size-5" />
          <span className="text-sm uppercase tracking-wide">{segmentLabel[segment.kind]}</span>
        </div>
        <h1 className="mb-4 max-w-3xl text-4xl font-semibold tracking-tight">{segment.title}</h1>
        <p className="max-w-xl text-lg text-zinc-400">{segment.body}</p>

        {segment.deepLink && (
          <Link href={segment.deepLink} className="mt-8">
            <Button size="lg" variant="secondary">
              <Sparkles className="size-4" />
              Open live feature
            </Button>
          </Link>
        )}

        {segment.activityType && (
          <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-4 text-sm text-zinc-400">
            Activity type: <span className="font-medium text-zinc-200">{segment.activityType.replace(/_/g, " ")}</span>
            {" "}&mdash; results would sync live to participant screens.
          </div>
        )}
      </main>

      <footer className="flex items-center justify-between border-t border-zinc-800 px-6 py-4">
        <Button
          variant="outline"
          className="border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800"
          disabled={isFirst}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <div className="flex gap-1.5">
          {bootcampDay.segments.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              className={`size-2 rounded-full transition-colors ${
                i === index ? "bg-zinc-50" : "bg-zinc-700"
              }`}
              aria-label={`Go to segment ${i + 1}`}
            />
          ))}
        </div>
        {isLast ? (
          <Button onClick={() => router.push("/admin/bootcamp")}>Finish day</Button>
        ) : (
          <Button onClick={() => setIndex((i) => Math.min(bootcampDay.segments.length - 1, i + 1))}>
            Next
            <ChevronRight className="size-4" />
          </Button>
        )}
      </footer>
    </div>
  );
}
