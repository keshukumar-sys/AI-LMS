import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, MessagesSquare, PresentationIcon } from "lucide-react";
import { analyticsOverview, activityFeed } from "@/lib/mock-data";

const kpis = [
  { label: "Active Students", value: analyticsOverview.activeStudents, icon: Users },
  { label: "Quiz Attempts", value: analyticsOverview.quizAttempts, icon: ClipboardList },
  { label: "Tutor Messages", value: analyticsOverview.tutorMessages, icon: MessagesSquare },
  { label: "Bootcamp Signups", value: analyticsOverview.bootcampSignups, icon: PresentationIcon },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Snapshot of platform activity across courses, the AI Tutor, and the Bootcamp.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-3xl font-semibold">{kpi.value}</p>
              </div>
              <kpi.icon className="size-8 text-primary/60" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {activityFeed.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                <span>{item.text}</span>
                <span className="text-muted-foreground">{item.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
