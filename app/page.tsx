import Link from "next/link";
import { Sparkles, LayoutDashboard, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="ai-bg flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mb-10 flex items-center gap-2">
        <Sparkles className="size-7 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Adaptive AI LMS Generator</h1>
      </div>
      <p className="mb-10 max-w-lg text-center text-muted-foreground">
        A live 3-day AI Bootcamp platform &mdash; lessons, live polls &amp; quizzes, and an AI
        playground backed by your own agent API key.
      </p>
      <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <GraduationCap className="mb-2 size-6 text-primary" />
            <CardTitle>Student</CardTitle>
            <CardDescription>
              Take the bootcamp, answer live polls &amp; quizzes, chat with the AI Tutor, and run
              the Prompt Playground.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Link href="/login" className="flex-1">
              <Button className="w-full">Log in</Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button className="w-full" variant="outline">
                Sign up
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <LayoutDashboard className="mb-2 size-6 text-primary" />
            <CardTitle>Admin / Trainer</CardTitle>
            <CardDescription>
              Manage the bootcamp, launch live polls &amp; quizzes, watch results in real time,
              and review students &amp; analytics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full" variant="outline">
                Admin log in
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
