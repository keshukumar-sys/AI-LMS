export interface AssessmentModuleInfo {
  moduleId: string; // matches lib/curriculum module ids
  title: string;
  description: string;
}

// Mirrors the 8 curriculum modules (lib/curriculum/modules/01..08) by id, but kept as a
// standalone constant so the assessment feature doesn't need to import the full curriculum
// content tree just to read titles.
export const ASSESSMENT_MODULES: AssessmentModuleInfo[] = [
  {
    moduleId: "m1-ai-foundations",
    title: "AI Foundations",
    description: "ANI/AGI/ASI, machine learning fundamentals, and how AI is reshaping industries.",
  },
  {
    moduleId: "m2-how-ai-works",
    title: "How AI Works",
    description: "Neural networks, transformers, and how models generate text and images.",
  },
  {
    moduleId: "m3-ai-productivity",
    title: "AI Productivity",
    description: "Using AI tools to accelerate research, writing, and daily work.",
  },
  {
    moduleId: "m4-ai-security-ethics",
    title: "AI Security and Ethics",
    description: "Deepfakes, AI-driven cyber threats, governance, and responsible AI use.",
  },
  {
    moduleId: "m5-ai-in-business",
    title: "AI in Business",
    description: "Functional AI adoption across departments and enterprise AI strategy.",
  },
  {
    moduleId: "m6-large-language-models",
    title: "Large Language Models",
    description: "How LLMs are trained, prompted, fine-tuned, and deployed in products.",
  },
  {
    moduleId: "m7-automation",
    title: "Automation",
    description: "Workflow automation, agents, and connecting AI to business processes.",
  },
  {
    moduleId: "m8-final-section",
    title: "Final Assessment",
    description: "A cumulative assessment covering foundations, LLMs, business, ethics, and automation.",
  },
];

export const ASSESSMENT_MODULE_IDS = ASSESSMENT_MODULES.map((m) => m.moduleId);

export function getAssessmentModule(moduleId: string): AssessmentModuleInfo | undefined {
  return ASSESSMENT_MODULES.find((m) => m.moduleId === moduleId);
}

export const ASSESSMENT_TIME_LIMIT_SEC = 90 * 60;

export const MARKS_PER_TYPE: Record<string, number> = {
  mcq: 2,
  scenario: 5,
  practical: 10,
  subjective: 10,
  ai_challenge: 10,
};

export const SECTION_BREAKDOWN = [
  { key: "mcq", label: "20 MCQs × 2 marks", marks: 40 },
  { key: "scenario", label: "4 Scenario Questions × 5 marks", marks: 20 },
  { key: "practical", label: "1 Practical Task × 10 marks", marks: 10 },
  { key: "subjective", label: "2 Subjective Questions × 10 marks", marks: 20 },
  { key: "challenge", label: "1 AI Challenge × 10 marks", marks: 10 },
] as const;

export const QUESTION_TYPE_LABELS: Record<string, string> = {
  mcq: "Multiple Choice",
  scenario: "Scenario Question",
  practical: "Practical Assignment",
  subjective: "Subjective Question",
  ai_challenge: "AI-Evaluated Challenge",
};
