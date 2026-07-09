"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayContentView } from "@/components/bootcamp/day-content-view";

export default function AdminBootcampDayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = use(params);
  const dayNumber = Number(day) as 1 | 2 | 3;

  return (
    <div className="space-y-4">
      <Link href="/admin/bootcamp">
        <Button variant="ghost" size="sm">
          <ChevronLeft className="size-4" /> Back to Bootcamp
        </Button>
      </Link>
      <DayContentView dayNumber={dayNumber} showTrainerNotes />
    </div>
  );
}
