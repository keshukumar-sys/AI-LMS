import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usersCol, quizResponsesCol, pollResponsesCol } from "@/lib/models";
import { leads } from "@/lib/mock-data";

const interestVariant: Record<string, "default" | "secondary" | "outline"> = {
  ready_to_buy: "default",
  interested: "secondary",
  curious: "outline",
};

function timeAgo(date: Date | undefined) {
  if (!date) return "Never";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default async function AdminStudentsPage() {
  const [users, quizResponses, pollResponses] = await Promise.all([
    usersCol().then((col) => col.find({ role: "student" }).sort({ createdAt: -1 }).toArray()),
    quizResponsesCol().then((col) => col.find({}).toArray()),
    pollResponsesCol().then((col) => col.find({}).toArray()),
  ]);

  const students = users.map((u) => {
    const studentId = u._id!.toString();
    const quizzes = quizResponses.filter((r) => r.studentId === studentId);
    const polls = pollResponses.filter((r) => r.studentId === studentId);
    const correctCount = quizzes.filter((q) => q.correct).length;
    const avgQuizScore = quizzes.length > 0 ? Math.round((correctCount / quizzes.length) * 100) : null;

    const lastResponseAt = [...quizzes, ...polls]
      .map((r) => r.answeredAt)
      .sort((a, b) => b.getTime() - a.getTime())[0];
    const lastActive =
      [u.lastLoginAt, lastResponseAt].filter(Boolean).sort((a, b) => b!.getTime() - a!.getTime())[0] ??
      u.createdAt;

    return {
      id: studentId,
      name: u.name,
      email: u.email,
      xp: u.xp,
      quizzesTaken: quizzes.length,
      avgQuizScore,
      pollsAnswered: polls.length,
      lastActive,
      joinedAt: u.createdAt,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
        <p className="text-sm text-muted-foreground">
          Enrollments, XP, live quiz &amp; poll participation, and last active time.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>XP</TableHead>
                <TableHead>Quizzes Taken</TableHead>
                <TableHead>Avg Quiz Score</TableHead>
                <TableHead>Polls Answered</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No students have signed up yet.
                  </TableCell>
                </TableRow>
              )}
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.email}</div>
                  </TableCell>
                  <TableCell>{s.xp} XP</TableCell>
                  <TableCell>{s.quizzesTaken}</TableCell>
                  <TableCell>{s.avgQuizScore !== null ? `${s.avgQuizScore}%` : "—"}</TableCell>
                  <TableCell>{s.pollsAnswered}</TableCell>
                  <TableCell className="text-muted-foreground">{timeAgo(s.lastActive)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>Bootcamp interest form submissions and in-app leads.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {leads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">
                    {lead.name} <span className="font-normal text-muted-foreground">&middot; {lead.org}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lead.useCases.length > 0 ? lead.useCases.join(", ") : "No use cases captured"}
                  </p>
                </div>
                <Badge variant={interestVariant[lead.interestLevel]} className="capitalize">
                  {lead.interestLevel.replace(/_/g, " ")}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
