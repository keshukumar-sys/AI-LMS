"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { adminNav, studentNav } from "@/lib/nav";
import { LiveActivityBanner } from "@/components/shared/live-activity-banner";

export interface ShellProfile {
  fullName: string;
  xp?: number;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppShell({
  role,
  profile,
  children,
}: {
  role: "admin" | "student";
  profile: ShellProfile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = role === "admin" ? adminNav : studentNav;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="ai-bg flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <Sparkles className="size-5 text-primary" />
          <span className="font-semibold">Adaptive AI LMS</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active =
              item.href === `/${role}` ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="text-sm text-muted-foreground capitalize">{role} workspace</div>
          <div className="flex items-center gap-3">
            {role === "student" && typeof profile.xp === "number" && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {profile.xp} XP
              </span>
            )}
            <Avatar className="size-8">
              <AvatarFallback>{initials(profile.fullName)}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">{profile.fullName}</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {role === "student" && <LiveActivityBanner />}
          {children}
        </main>
      </div>
    </div>
  );
}
