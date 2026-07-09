"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle, Bot, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  estMinutes: number;
  status: "not_started" | "in_progress" | "done";
  content?: string;
  pdfUrl?: string;
}

interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  modules: CourseModule[];
}

const statusIcon = {
  done: CheckCircle2,
  in_progress: PlayCircle,
  not_started: Circle,
};

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Lesson | null>(null);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        const list: Course[] = data.courses ?? [];
        setCourses(list);
        const firstLessons = list.flatMap((c) => c.modules.flatMap((m) => m.lessons));
        setActive(firstLessons.find((l) => l.status !== "done") ?? firstLessons[0] ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading courses...</p>;
  }

  if (courses.length === 0 || !active) {
    return <p className="text-sm text-muted-foreground">No courses are published yet.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course._id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {course.modules.length === 0 && (
                <p className="text-xs text-muted-foreground">No lessons yet.</p>
              )}
              {course.modules.map((mod) => (
                <div key={mod.id}>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">{mod.title}</p>
                  <ul className="space-y-1">
                    {mod.lessons.map((lesson) => {
                      const Icon = statusIcon[lesson.status];
                      return (
                        <li key={lesson.id}>
                          <button
                            onClick={() => setActive(lesson)}
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                              active.id === lesson.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                            }`}
                          >
                            <Icon className="size-4 shrink-0" />
                            <span className="truncate">{lesson.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{active.title}</CardTitle>
            <Badge variant="outline">{active.estMinutes} min</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-[28rem] overflow-y-auto rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed whitespace-pre-line">
            {active.content ?? "Lesson content placeholder"}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/student/tutor">
              <Button variant="outline">
                <Bot className="size-4" />
                Ask the Tutor about this lesson
              </Button>
            </Link>
            {active.pdfUrl && (
              <a href={active.pdfUrl} download className={cn(buttonVariants({ variant: "outline" }))}>
                <Download className="size-4" />
                Download PDF
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
