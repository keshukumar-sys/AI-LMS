const fs = require("fs");
const path = require("path");

const EXTRACT_ROOT =
  "C:\\Users\\biswa\\AppData\\Local\\Temp\\claude\\C--Users-biswa\\00ee3c6e-f2ea-4916-aace-55bf812ba8c1\\scratchpad\\pdf-extract";
const OUT_DIR = path.join(__dirname, "..", "lib", "course-content");

const FOLDERS = [
  { folder: "AI_Fundamentals", slug: "ai-fundamentals", varName: "aiFundamentalsLessons" },
  { folder: "AI_Frameworks", slug: "ai-frameworks", varName: "aiFrameworksLessons" },
  { folder: "AI_Automation", slug: "ai-automation", varName: "aiAutomationLessons" },
];

function cleanText(raw) {
  return raw
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
    .join("\n")
    .trim();
}

function estMinutesFor(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(6, Math.round(words / 130));
}

function jsEscape(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

for (const { folder, slug, varName } of FOLDERS) {
  const dir = path.join(EXTRACT_ROOT, folder);
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".txt"))
    .sort();

  const lessons = files.map((file, idx) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const lines = raw.split("\n").map((l) => l.trim());
    const nonEmpty = lines.filter(Boolean);
    let title = nonEmpty[1] || nonEmpty[0] || file;
    let titleLineIdx = lines.findIndex((l) => l === title);
    // A handful of PDF titles wrap onto a second line (heading ends/continues with "&"/"+").
    const nextLineIdx = lines.findIndex((l, i) => i > titleLineIdx && l !== "");
    const nextLine = lines[nextLineIdx] || "";
    if (/[&+]$/.test(title) || /^[&+]/.test(nextLine)) {
      title = `${title} ${nextLine}`;
      titleLineIdx = nextLineIdx;
    }
    const bodyLines = lines.slice(titleLineIdx + 1);
    const content = cleanText(bodyLines.join("\n"));
    const lessonNum = String(idx + 1).padStart(2, "0");
    const id = `${slug}-l${lessonNum}`;
    const pdfFile = file.replace(/\.txt$/, ".pdf");
    return {
      id,
      title,
      estMinutes: estMinutesFor(content),
      status: idx === 0 ? "in_progress" : "not_started",
      content,
      pdfUrl: `/course-materials/${slug}/${pdfFile}`,
    };
  });

  const body = lessons
    .map(
      (l) => `  {
    id: ${JSON.stringify(l.id)},
    title: ${JSON.stringify(l.title)},
    estMinutes: ${l.estMinutes},
    status: ${JSON.stringify(l.status)},
    pdfUrl: ${JSON.stringify(l.pdfUrl)},
    content: \`${jsEscape(l.content)}\`,
  }`
    )
    .join(",\n");

  const fileContent = `import type { Lesson } from "@/lib/mock-data";

export const ${varName}: Lesson[] = [
${body},
];
`;

  fs.writeFileSync(path.join(OUT_DIR, `${slug}.ts`), fileContent, "utf-8");
  console.log(`Wrote ${slug}.ts with ${lessons.length} lessons`);
}
