import Link from "next/link";
import { ObjectId } from "mongodb";
import { Flame, PresentationIcon, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { courses, bootcampDays } from "@/lib/mock-data";
import { getSession } from "@/lib/auth";
import { usersCol } from "@/lib/models";

const continueLesson = courses[0].modules[0].lessons.find((l) => l.status === "in_progress");
const liveDay = bootcampDays.find((d) => d.status !== "done") ?? bootcampDays[0];

export default async function StudentHomePage() {
  const session = await getSession();
  const users = await usersCol();
  const user = session ? await users.findOne({ _id: new ObjectId(session.userId) }) : null;
  const fullName = session?.name ?? "Student";
  const xp = user?.xp ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {fullName.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s where you left off.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Continue learning</CardTitle>
            <CardDescription>{courses[0].title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium">{continueLesson?.title}</p>
            <Progress value={45} />
            <Link href="/student/courses">
              <Button size="sm">
                Continue <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="size-5 text-orange-500" />
              Streak &amp; XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{xp} XP</p>
            <p className="text-sm text-muted-foreground">6-day streak</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PresentationIcon className="size-5 text-primary" />
            Upcoming: Day {liveDay.dayNumber} &mdash; {liveDay.title}
          </CardTitle>
          <CardDescription>{liveDay.theme}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/student/bootcamp">
            <Button variant="outline">View Bootcamp agenda</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
