"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { adminNav, studentNav } from "@/lib/nav";
import { LiveActivityBanner } from "@/components/shared/live-activity-banner";
import { AiBackgroundMotif } from "@/components/shared/ai-background-motif";

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
  const nav = role === "admin" ? adminNav : studentNav;

  return (
    <div className="ai-bg flex min-h-screen">
      <AiBackgroundMotif />
      <aside className="glass-panel relative z-10 sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
          <span className="brand-gradient flex size-8 items-center justify-center rounded-xl shadow-[0_2px_10px_-2px_rgb(79_70_229_/_0.45)]">
            <Sparkles className="size-4.5 text-white" />
          </span>
          <span className="font-heading font-semibold tracking-tight">Hands-on Practice</span>
        </div>
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          {nav.map((item) => {
            const active =
              item.href === `/${role}` ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "brand-gradient text-white shadow-[0_4px_14px_-4px_rgb(79_70_229_/_0.5)]"
                    : "text-muted-foreground hover:translate-x-0.5 hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="glass-panel sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 md:hidden">
              <span className="brand-gradient flex size-8 items-center justify-center rounded-xl shadow-[0_2px_10px_-2px_rgb(79_70_229_/_0.45)]">
                <Sparkles className="size-4.5 text-white" />
              </span>
              <span className="font-heading font-semibold tracking-tight">Hands-on Practice</span>
            </div>
            <div className="text-sm font-medium text-muted-foreground capitalize">{role} workspace</div>
          </div>
          <div className="flex items-center gap-3">
            {role === "student" && typeof profile.xp === "number" && (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800">
                <Zap className="size-3.5" />
                {profile.xp} XP
              </span>
            )}
            <div className="flex items-center gap-2">
              <Avatar className="size-8 ring-2 ring-primary/20">
                <AvatarFallback className="brand-gradient font-medium text-white">
                  {initials(profile.fullName)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{profile.fullName}</span>
            </div>
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
