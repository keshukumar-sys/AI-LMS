// Mock data layer for the AI Learning Platform prototype.
// Everything here stands in for Supabase + AI gateway calls until those are wired up.

import { aiFundamentalsLessons } from "@/lib/course-content/ai-fundamentals";
import { aiFrameworksLessons } from "@/lib/course-content/ai-frameworks";
import { aiAutomationLessons } from "@/lib/course-content/ai-automation";

export type Role = "admin" | "student";

export interface Profile {
  id: string;
  fullName: string;
  role: Role;
  avatarUrl: string;
  xp: number;
}

export const currentAdmin: Profile = {
  id: "admin-1",
  fullName: "Anuradha Biswas",
  role: "admin",
  avatarUrl: "",
  xp: 0,
};

export const currentStudent: Profile = {
  id: "student-1",
  fullName: "Priya Sharma",
  role: "student",
  avatarUrl: "",
  xp: 640,
};

// ---------- Curriculum ----------

export interface Lesson {
  id: string;
  title: string;
  estMinutes: number;
  status: "not_started" | "in_progress" | "done";
  content?: string;
  pdfUrl?: string;
}

export interface ModuleT {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  modules: ModuleT[];
}

export const courses: Course[] = [
  {
    id: "course-1",
    title: "AI Fundamentals",
    description: "What AI actually is, how it evolved, and the core ideas behind machine learning and deep learning.",
    isPublished: true,
    modules: [
      {
        id: "mod-1",
        title: "Bootcamp Module 1",
        lessons: aiFundamentalsLessons,
      },
    ],
  },
  {
    id: "course-2",
    title: "AI Frameworks",
    description: "Inside the LLM: tokenization, transformers, parameters, RAG, fine-tuning, and prompt engineering.",
    isPublished: true,
    modules: [
      {
        id: "mod-2",
        title: "Bootcamp Module 2",
        lessons: aiFrameworksLessons,
      },
    ],
  },
  {
    id: "course-3",
    title: "AI in the Real World",
    description: "How AI shows up across industries, and the bias, hallucination, and ethics questions it raises.",
    isPublished: true,
    modules: [
      {
        id: "mod-3",
        title: "Bootcamp Module 3",
        lessons: aiAutomationLessons,
      },
    ],
  },
  {
    id: "course-4",
    title: "Capstone",
    description: "Build and present your own AI-assisted workflow.",
    isPublished: false,
    modules: [],
  },
];

// ---------- Assessments ----------

export type QuestionKind = "mcq" | "multi" | "short_answer" | "prompt_task";

export interface Question {
  id: string;
  kind: QuestionKind;
  body: string;
  options?: string[];
  points: number;
  topicTag: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface Assessment {
  id: string;
  title: string;
  type: "quiz" | "assessment";
  instructions: string;
  timeLimitMin: number | null;
  isPublished: boolean;
  questions: Question[];
}

export const assessments: Assessment[] = [
  {
    id: "assess-1",
    title: "Day 1 Recap Quiz",
    type: "quiz",
    instructions: "5 quick questions on AI fundamentals.",
    timeLimitMin: 5,
    isPublished: true,
    questions: [
      { id: "q-1", kind: "mcq", body: "What does LLM stand for?", options: ["Large Language Model", "Linear Learning Machine", "Long Logic Model", "Live Language Module"], points: 1, topicTag: "fundamentals", difficulty: "beginner" },
      { id: "q-2", kind: "mcq", body: "Which is NOT a way models can fail?", options: ["Hallucination", "Bias", "Compiling", "Context loss"], points: 1, topicTag: "fundamentals", difficulty: "beginner" },
      { id: "q-3", kind: "short_answer", body: "In one sentence, what is a token?", points: 2, topicTag: "fundamentals", difficulty: "intermediate" },
    ],
  },
  {
    id: "assess-2",
    title: "Prompt Writing Assessment",
    type: "assessment",
    instructions: "Write a prompt that gets the model to summarize a support ticket.",
    timeLimitMin: 15,
    isPublished: true,
    questions: [
      { id: "q-4", kind: "prompt_task", body: "Write a prompt to summarize a customer support ticket into 3 bullet points.", points: 5, topicTag: "prompt-engineering", difficulty: "intermediate" },
    ],
  },
];

// ---------- AI Tutor ----------

export interface TutorConfig {
  provider: "anthropic" | "openai" | "google";
  model: string;
  systemPrompt: string;
  socraticMode: boolean;
}

export const tutorConfig: TutorConfig = {
  provider: "anthropic",
  model: "claude-sonnet-5",
  systemPrompt: "You are a friendly, encouraging AI tutor for the bootcamp. Keep answers short and concrete. Never solve live assessment questions directly.",
  socraticMode: true,
};

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const mockTutorConversation: ChatMessage[] = [
  { id: "m-1", role: "user", content: "What's the difference between a prompt and a system prompt?" },
  { id: "m-2", role: "assistant", content: "Good question. A system prompt sets the model's persistent role and rules before the conversation starts — think of it as the job description. A regular prompt is the specific task or question you send each turn. In this lesson, the tutor you're chatting with right now has a system prompt telling it to stay encouraging and on-topic." },
  { id: "m-3", role: "user", content: "So could I change your system prompt?" },
  { id: "m-4", role: "assistant", content: "Only an admin can, from Tutor Config. Try asking me something about today's lesson instead — I'm most useful there." },
];

// ---------- Automation Hub ----------

export type AutomationCategory = "marketing" | "sales" | "hr" | "support" | "data" | "productivity";

export interface WorkflowNode {
  id: string;
  type: "trigger" | "ai" | "action" | "output";
  label: string;
  x: number;
  y: number;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface Automation {
  id: string;
  title: string;
  slug: string;
  category: AutomationCategory;
  problem: string;
  description: string;
  tools: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  roi: { hoursSavedWk: number; costSavedMo: number; errorReduction: number };
  workflow: { nodes: WorkflowNode[]; edges: WorkflowEdge[] };
  demoScript: { input: string; nodeOutputs: Record<string, string> };
}

export const automations: Automation[] = [
  {
    id: "auto-1",
    title: "Email Triage Agent",
    slug: "email-triage-agent",
    category: "support",
    problem: "Support inbox gets 200+ emails/day; humans spend hours sorting by urgency.",
    description: "Reads incoming email, classifies urgency and topic, drafts a reply, and routes to the right queue.",
    tools: ["Gmail API", "claude-api", "Zendesk"],
    difficulty: "intermediate",
    roi: { hoursSavedWk: 9, costSavedMo: 1400, errorReduction: 22 },
    workflow: {
      nodes: [
        { id: "n1", type: "trigger", label: "New email received", x: 0, y: 0 },
        { id: "n2", type: "ai", label: "Classify urgency & topic", x: 220, y: 0 },
        { id: "n3", type: "action", label: "Route to queue", x: 440, y: -60 },
        { id: "n4", type: "ai", label: "Draft reply", x: 440, y: 60 },
        { id: "n5", type: "output", label: "Ticket created", x: 660, y: 0 },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n2", target: "n4" },
        { id: "e4", source: "n3", target: "n5" },
        { id: "e5", source: "n4", target: "n5" },
      ],
    },
    demoScript: {
      input: "\"My invoice charged me twice this month, please fix ASAP\"",
      nodeOutputs: {
        n2: "Urgency: High · Topic: Billing",
        n3: "Routed to: Billing Escalations",
        n4: "Draft: \"Hi Sam, sorry about the double charge — I can see it and I'm reversing it now...\"",
      },
    },
  },
  {
    id: "auto-2",
    title: "Lead-to-CRM Enrichment",
    slug: "lead-to-crm-enrichment",
    category: "sales",
    problem: "Reps manually research and re-type new lead info into the CRM.",
    description: "Takes a raw lead form submission, enriches it with public company data, and creates a scored CRM record.",
    tools: ["Webhook", "claude-api", "HubSpot"],
    difficulty: "intermediate",
    roi: { hoursSavedWk: 6, costSavedMo: 900, errorReduction: 30 },
    workflow: {
      nodes: [
        { id: "n1", type: "trigger", label: "Form submitted", x: 0, y: 0 },
        { id: "n2", type: "ai", label: "Enrich company data", x: 220, y: 0 },
        { id: "n3", type: "ai", label: "Score lead fit", x: 440, y: 0 },
        { id: "n4", type: "action", label: "Create CRM record", x: 660, y: 0 },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n3", target: "n4" },
      ],
    },
    demoScript: {
      input: "Lead: Jordan Lee, jordan@acmewidgets.com, \"interested in enterprise plan\"",
      nodeOutputs: {
        n2: "Acme Widgets · 80 employees · Manufacturing · Series B",
        n3: "Fit score: 82/100 (company size + stated intent)",
      },
    },
  },
  {
    id: "auto-3",
    title: "Weekly Report Generator",
    slug: "weekly-report-generator",
    category: "data",
    problem: "Manager spends 2 hours every Friday assembling a KPI summary from three spreadsheets.",
    description: "Pulls KPI data on a schedule, drafts an executive summary, and posts it to Slack.",
    tools: ["Cron trigger", "claude-api", "Slack"],
    difficulty: "beginner",
    roi: { hoursSavedWk: 2, costSavedMo: 300, errorReduction: 15 },
    workflow: {
      nodes: [
        { id: "n1", type: "trigger", label: "Friday 4pm", x: 0, y: 0 },
        { id: "n2", type: "action", label: "Pull KPI data", x: 220, y: 0 },
        { id: "n3", type: "ai", label: "Draft summary", x: 440, y: 0 },
        { id: "n4", type: "output", label: "Post to #leadership", x: 660, y: 0 },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n3", target: "n4" },
      ],
    },
    demoScript: {
      input: "KPI sheet: conversion 32% (+4pt), resolution time 3.1hr (-0.4hr)",
      nodeOutputs: {
        n3: "\"Strong week: conversion up 4pts driven by the new onboarding flow. Support resolution time improved...\"",
      },
    },
  },
  {
    id: "auto-4",
    title: "SOP Compliance Checker",
    slug: "sop-compliance-checker",
    category: "hr",
    problem: "New ops hires skip steps in onboarding checklists without anyone noticing until it's a problem.",
    description: "Reviews submitted checklist evidence against the SOP and flags gaps for a manager.",
    tools: ["Upload trigger", "claude-api", "Slack"],
    difficulty: "advanced",
    roi: { hoursSavedWk: 4, costSavedMo: 600, errorReduction: 40 },
    workflow: {
      nodes: [
        { id: "n1", type: "trigger", label: "Checklist submitted", x: 0, y: 0 },
        { id: "n2", type: "ai", label: "Compare to SOP", x: 220, y: 0 },
        { id: "n3", type: "action", label: "Flag gaps", x: 440, y: 0 },
        { id: "n4", type: "output", label: "Notify manager", x: 660, y: 0 },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
        { id: "e3", source: "n3", target: "n4" },
      ],
    },
    demoScript: {
      input: "Checklist: 8/10 steps checked, no evidence attached for step 4 (\"verify ID\")",
      nodeOutputs: {
        n2: "Gap found: step 4 missing evidence",
        n3: "Flagged: \"ID verification\" — needs photo evidence",
      },
    },
  },
  {
    id: "auto-5",
    title: "Social Post Repurposer",
    slug: "social-post-repurposer",
    category: "marketing",
    problem: "Marketing writes one blog post but needs 5 different social variants.",
    description: "Takes a long-form post and generates platform-specific variants (LinkedIn, X, Instagram caption).",
    tools: ["Webhook", "claude-api", "Buffer"],
    difficulty: "beginner",
    roi: { hoursSavedWk: 3, costSavedMo: 450, errorReduction: 10 },
    workflow: {
      nodes: [
        { id: "n1", type: "trigger", label: "Post published", x: 0, y: 0 },
        { id: "n2", type: "ai", label: "Generate variants", x: 220, y: 0 },
        { id: "n3", type: "action", label: "Queue in Buffer", x: 440, y: 0 },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
      ],
    },
    demoScript: {
      input: "Blog: \"5 lessons from our Q3 outage\"",
      nodeOutputs: {
        n2: "LinkedIn: \"Q3 taught us something the postmortem didn't capture...\" / X thread: 5 tweets drafted",
      },
    },
  },
  {
    id: "auto-6",
    title: "Meeting Notes Distiller",
    slug: "meeting-notes-distiller",
    category: "productivity",
    problem: "Nobody reads the full meeting transcript; action items get lost.",
    description: "Takes a raw transcript and extracts decisions, owners, and due dates into a task list.",
    tools: ["Upload trigger", "claude-api", "Notion"],
    difficulty: "beginner",
    roi: { hoursSavedWk: 3, costSavedMo: 400, errorReduction: 20 },
    workflow: {
      nodes: [
        { id: "n1", type: "trigger", label: "Transcript uploaded", x: 0, y: 0 },
        { id: "n2", type: "ai", label: "Extract action items", x: 220, y: 0 },
        { id: "n3", type: "action", label: "Create Notion tasks", x: 440, y: 0 },
      ],
      edges: [
        { id: "e1", source: "n1", target: "n2" },
        { id: "e2", source: "n2", target: "n3" },
      ],
    },
    demoScript: {
      input: "Transcript: \"...so Priya will own the migration, target end of month...\"",
      nodeOutputs: {
        n2: "Action: Migration → Owner: Priya → Due: end of month",
      },
    },
  },
];

// ---------- Bootcamp ----------

export type SegmentKind = "slide" | "live_demo" | "activity" | "recap";
export type ActivityType = "poll" | "quiz" | "prompt_duel" | "sandbox_task" | "feedback_form";

export interface BootcampSegment {
  id: string;
  kind: SegmentKind;
  title: string;
  body: string;
  deepLink?: string;
  activityType?: ActivityType;
}

export interface BootcampDay {
  id: string;
  dayNumber: number;
  title: string;
  theme: string;
  status: "draft" | "live" | "done";
  segments: BootcampSegment[];
}

export const bootcampDays: BootcampDay[] = [
  {
    id: "day-1",
    dayNumber: 1,
    title: "AI Fundamentals",
    theme: "What is AI, really?",
    status: "done",
    segments: [
      { id: "s1", kind: "slide", title: "What is AI / LLMs, in plain language", body: "Visual explainers, myth-busting. No math required." },
      { id: "s2", kind: "live_demo", title: "Ask the Tutor anything", body: "Presenter opens AI Tutor and takes live audience questions.", deepLink: "/student/tutor" },
      { id: "s3", kind: "live_demo", title: "How models differ", body: "Playground side-by-side: same question → Claude vs GPT.", deepLink: "/student/playground" },
      { id: "s4", kind: "activity", title: "Poll: Where could AI help you most?", body: "Live results chart — doubles as lead-qualification data.", activityType: "poll" },
      { id: "s5", kind: "activity", title: "Day 1 recap quiz (5 Qs)", body: "Leaderboard on screen.", activityType: "quiz" },
    ],
  },
  {
    id: "day-2",
    dayNumber: 2,
    title: "Prompt Engineering",
    theme: "Anatomy of a great prompt",
    status: "draft",
    segments: [
      { id: "s6", kind: "slide", title: "Anatomy of a great prompt", body: "Role, context, format, examples. Before/after comparisons." },
      { id: "s7", kind: "live_demo", title: "Live prompt makeover", body: "Take a vague audience prompt → improve it stepwise in Playground.", deepLink: "/student/playground" },
      { id: "s8", kind: "activity", title: "Prompt Duel", body: "Everyone writes a prompt for the same task; AI scores against a rubric.", activityType: "prompt_duel" },
      { id: "s9", kind: "activity", title: "Prompt-writing assessment", body: "The prompt_task question type, AI-graded with feedback.", activityType: "quiz" },
      { id: "s10", kind: "recap", title: "Recap + Day 3 teaser", body: "Show one automation card as a cliffhanger." },
    ],
  },
  {
    id: "day-3",
    dayNumber: 3,
    title: "AI Automation",
    theme: "The close",
    status: "draft",
    segments: [
      { id: "s11", kind: "slide", title: "What is AI Automation & why now", body: "Manual vs automated timeline visual." },
      { id: "s12", kind: "live_demo", title: "Showcase tour", body: "Run 2-3 automation demos live.", deepLink: "/student/automations" },
      { id: "s13", kind: "activity", title: "ROI Calculator, live with their numbers", body: "Ask a stakeholder for real figures; calculate savings on screen.", activityType: "sandbox_task" },
      { id: "s14", kind: "activity", title: "Build-your-own challenge", body: "Students assemble a simple flow in the sandbox.", activityType: "sandbox_task" },
      { id: "s15", kind: "slide", title: "The pitch", body: "Pricing/plans, rollout options, what your team gets." },
      { id: "s16", kind: "activity", title: "Interest form + feedback", body: "Captures name, use cases, interest level.", activityType: "feedback_form" },
    ],
  },
];

// ---------- Leads / Feedback ----------

export interface Lead {
  id: string;
  name: string;
  email: string;
  org: string;
  interestLevel: "curious" | "interested" | "ready_to_buy";
  useCases: string[];
  source: "bootcamp" | "app";
}

export const leads: Lead[] = [
  { id: "lead-1", name: "Rahul Verma", email: "rahul@northwind.co", org: "Northwind Retail", interestLevel: "ready_to_buy", useCases: ["Support triage", "Onboarding"], source: "bootcamp" },
  { id: "lead-2", name: "Sara Malik", email: "sara@brightpath.io", org: "BrightPath Consulting", interestLevel: "interested", useCases: ["Reporting"], source: "bootcamp" },
  { id: "lead-3", name: "Devika Rao", email: "devika@finqore.com", org: "FinQore", interestLevel: "curious", useCases: [], source: "app" },
];

// ---------- Students & Analytics ----------

export const analyticsOverview = {
  activeStudents: 41,
  quizAttempts: 118,
  tutorMessages: 612,
  bootcampSignups: 56,
  completionFunnel: [
    { stage: "Enrolled", value: 56 },
    { stage: "Started Day 1", value: 52 },
    { stage: "Completed Day 1", value: 48 },
    { stage: "Completed Day 2", value: 39 },
    { stage: "Completed Day 3", value: 31 },
  ],
  scoreDistribution: [
    { range: "0-50", count: 3 },
    { range: "51-70", count: 9 },
    { range: "71-85", count: 21 },
    { range: "86-100", count: 17 },
  ],
  tutorTopics: [
    { topic: "Prompt basics", count: 145 },
    { topic: "Hallucination", count: 88 },
    { topic: "Automation ROI", count: 76 },
    { topic: "Model differences", count: 63 },
    { topic: "SOP compliance", count: 40 },
  ],
};

export const activityFeed = [
  { id: "act-1", text: "Arjun Nair completed \"AI Foundations\"", time: "2h ago" },
  { id: "act-2", text: "New lead: Rahul Verma marked ready_to_buy", time: "5h ago" },
  { id: "act-3", text: "Meera Iyer scored 71% on Day 1 Recap Quiz", time: "1d ago" },
  { id: "act-4", text: "Admin published \"Prompt Engineering\" course", time: "2d ago" },
];
