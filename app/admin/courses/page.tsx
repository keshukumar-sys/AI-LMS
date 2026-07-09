"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CourseLesson {
  id: string;
  title: string;
  estMinutes: number;
  status: "not_started" | "in_progress" | "done";
}

interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  modules: CourseModule[];
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishNow, setPublishNow] = useState(false);

  async function loadCourses() {
    setLoading(true);
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.courses ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setPublishNow(false);
    setError(null);
  }

  async function createCourse() {
    setError(null);
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          isPublished: publishNow,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create course.");
        return;
      }
      toast.success(publishNow ? "Course created and published" : "Course created as a draft");
      setOpen(false);
      resetForm();
      await loadCourses();
    } finally {
      setCreating(false);
    }
  }

  async function togglePublish(course: Course) {
    const res = await fetch(`/api/courses/${course._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !course.isPublished }),
    });
    if (res.ok) {
      toast.success(course.isPublished ? "Unpublished" : "Published");
      await loadCourses();
    }
  }

  async function removeCourse(id: string) {
    const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Course deleted");
      await loadCourses();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
          <p className="text-sm text-muted-foreground">
            Course &rarr; Modules &rarr; Lessons. Seed curriculum mirrors the bootcamp.
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) resetForm();
          }}
        >
          <DialogTrigger render={<Button />}>
            <Plus className="size-4" />
            New Course
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New course</DialogTitle>
              <DialogDescription>Give it a title and description, then publish whenever it's ready.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Prompt Engineering 201" />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What students will learn in this course."
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Publish now</p>
                  <p className="text-sm text-muted-foreground">
                    Published courses are visible to students immediately. Leave off to save as a draft.
                  </p>
                </div>
                <Switch checked={publishNow} onCheckedChange={setPublishNow} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button onClick={createCourse} disabled={creating}>
                {creating ? "Creating..." : publishNow ? "Create & publish" : "Create draft"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No courses yet - create one to get started.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{course.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={course.isPublished ? "default" : "secondary"}>
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => togglePublish(course)}>
                      {course.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => removeCourse(course._id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {course.modules.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No modules yet.</p>
                ) : (
                  <Accordion>
                    {course.modules.map((mod) => (
                      <AccordionItem key={mod.id} value={mod.id}>
                        <AccordionTrigger className="text-sm">{mod.title}</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {mod.lessons.map((lesson) => (
                              <li key={lesson.id} className="flex items-center justify-between text-sm">
                                <span>{lesson.title}</span>
                                <span className="flex items-center gap-3 text-muted-foreground">
                                  <span className="flex items-center gap-1 text-xs">
                                    <Clock className="size-3" />
                                    {lesson.estMinutes}m
                                  </span>
                                  <Badge
                                    variant={
                                      lesson.status === "done"
                                        ? "default"
                                        : lesson.status === "in_progress"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {lesson.status.replace("_", " ")}
                                  </Badge>
                                </span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
