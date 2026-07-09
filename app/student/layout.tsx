import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { AppShell } from "@/components/shared/app-shell";
import { getSession } from "@/lib/auth";
import { usersCol } from "@/lib/models";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "student") redirect("/login");

  const users = await usersCol();
  const user = await users.findOne({ _id: new ObjectId(session.userId) });

  return (
    <AppShell role="student" profile={{ fullName: session.name, xp: user?.xp ?? 0 }}>
      {children}
    </AppShell>
  );
}
