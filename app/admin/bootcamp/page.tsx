import Link from "next/link";
import { PlayCircle, FileText, Video, Vote, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bootcampDays, type SegmentKind } from "@/lib/mock-data";

const segmentIcon: Record<SegmentKind, typeof FileText> = {
  slide: FileText,
  live_demo: Video,
  activity: Vote,
  recap: RotateCcw,
};

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  live: "default",
  draft: "secondary",
  done: "outline",
};

export default function AdminBootcampPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bootcamp</h1>
        <p className="text-sm text-muted-foreground">
          Build and control the 3-day presentation &mdash; the sales engine.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {bootcampDays.map((day) => (
          <Card key={day.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Day {day.dayNumber}: {day.title}</CardTitle>
                <Badge variant={statusVariant[day.status]} className="capitalize">
                  {day.status}
                </Badge>
              </div>
              <CardDescription>{day.theme}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="space-y-2">
                {day.segments.map((seg, i) => {
                  const Icon = segmentIcon[seg.kind];
                  return (
                    <li key={seg.id} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-xs text-muted-foreground">{i + 1}.</span>
                      <Icon className="mt-0.5 size-4 shrink-0 text-primary/70" />
                      <span>{seg.title}</span>
                    </li>
                  );
                })}
              </ol>
              <div className="flex gap-2">
                <Link href={`/bootcamp/present/${day.dayNumber}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <PlayCircle className="size-4" />
                    Launch Presenter Mode
                  </Button>
                </Link>
                <Link href={`/admin/bootcamp/${day.dayNumber}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Curriculum
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
