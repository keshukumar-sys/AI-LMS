"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlayCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StartAssessmentButton({
  moduleId,
  resumeAttemptId,
}: {
  moduleId: string;
  resumeAttemptId?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (resumeAttemptId) {
    return (
      <Button className="gap-1.5" onClick={() => router.push(`/student/assessments/${moduleId}/attempt/${resumeAttemptId}`)}>
        <PlayCircle className="size-4" /> Continue assessment
      </Button>
    );
  }

  async function start() {
    setBusy(true);
    try {
      const res = await fetch("/api/assessment-attempts/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not start the assessment.");
        return;
      }
      router.push(`/student/assessments/${moduleId}/attempt/${data.attempt._id}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button className="gap-1.5" onClick={start} disabled={busy}>
      <RotateCcw className="size-4" /> {busy ? "Starting..." : "Start assessment"}
    </Button>
  );
}
