const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const ROOT = "C:\\Users\\biswa\\Downloads\\AI_LMS_Notes";
const OUT = "C:\\Users\\biswa\\AppData\\Local\\Temp\\claude\\C--Users-biswa\\00ee3c6e-f2ea-4916-aace-55bf812ba8c1\\scratchpad\\pdf-extract";

async function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  const folders = fs.readdirSync(ROOT).filter((f) => fs.statSync(path.join(ROOT, f)).isDirectory());
  const summary = [];
  for (const folder of folders) {
    const dir = path.join(ROOT, folder);
    const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".pdf")).sort();
    const outDir = path.join(OUT, folder);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    for (const file of files) {
      const buf = fs.readFileSync(path.join(dir, file));
      const data = await pdfParse(buf);
      const outFile = path.join(outDir, file.replace(/\.pdf$/i, ".txt"));
      fs.writeFileSync(outFile, data.text, "utf-8");
      summary.push({ folder, file, pages: data.numpages, chars: data.text.length });
    }
  }
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
