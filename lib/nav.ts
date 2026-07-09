import {
  LayoutDashboard,
  Bot,
  Workflow,
  PresentationIcon,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Home,
  FlaskConical,
  ClipboardCheck,
  TrendingUp,
  Vote,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Live Polls & Quizzes", href: "/admin/live", icon: Vote },
  { label: "AI Tutor", href: "/admin/ai-tutor", icon: Bot },
  { label: "Automation Hub", href: "/admin/automations", icon: Workflow },
  { label: "Bootcamp", href: "/admin/bootcamp", icon: PresentationIcon },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const studentNav: NavItem[] = [
  { label: "Home", href: "/student", icon: Home },
  { label: "Bootcamp", href: "/student/bootcamp", icon: PresentationIcon },
  { label: "My Courses", href: "/student/courses", icon: BookOpen },
  { label: "AI Tutor", href: "/student/tutor", icon: Bot },
  { label: "Prompt Playground", href: "/student/playground", icon: FlaskConical },
  { label: "Automation Hub", href: "/student/automations", icon: Workflow },
  { label: "Assessments", href: "/student/assessments", icon: ClipboardCheck },
  { label: "Progress", href: "/student/progress", icon: TrendingUp },
  { label: "Settings", href: "/student/settings", icon: Settings },
];
