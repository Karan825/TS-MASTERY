import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const catalog = [];

// Define the ordered levels
const levels = [
  { id: "00", name: "Level 00: Foundations", dir: "00-javascript-foundations", tier: "Essential" },
  { id: "01", name: "Level 01: TS Fundamentals", dir: "01-fundamentals", tier: "Fundamental" },
  { id: "02", name: "Level 02: Type System Deep Dive", dir: "02-type-system-deep-dive", tier: "Intermediate" },
  { id: "03", name: "Level 03: Functions", dir: "03-functions", tier: "Intermediate" },
  { id: "04", name: "Level 04: Interfaces & Types", dir: "04-interfaces-and-types", tier: "Intermediate" },
  { id: "05", name: "Level 05: Generics", dir: "05-generics", tier: "Core Master" },
  { id: "06", name: "Level 06: Advanced Types", dir: "06-advanced-types", tier: "Advanced" },
  { id: "07", name: "Level 07: Utility Types", dir: "07-utility-types", tier: "Core Master" },
  { id: "08", name: "Level 08: Classes & OOP", dir: "08-oop", tier: "Intermediate" },
  { id: "09", name: "Level 09: Modules & Setup", dir: "09-modules", tier: "Intermediate" },
  { id: "10", name: "Level 10: TSConfig & Compiler", dir: "10-tsconfig", tier: "Intermediate" },
  { id: "11", name: "Level 11: Runtime vs Types", dir: "11-runtime-vs-types", tier: "Core Master" },
  { id: "12", name: "Level 12: Error Handling", dir: "12-error-handling", tier: "Core Master" },
  { id: "13", name: "Level 13: Async TypeScript", dir: "13-async", tier: "Intermediate" },
  { id: "14", name: "Level 14: Type-Safe API Design", dir: "14-api-design", tier: "Core Master" },
  { id: "15", name: "Level 15: Node.js Architecture", dir: "15-node", tier: "Core Master" },
  { id: "16", name: "Level 16: React Integration", dir: "16-react", tier: "Core Master" },
  { id: "17", name: "Level 17: Design Patterns", dir: "17-design-patterns", tier: "Advanced" },
  { id: "18", name: "Level 18: Code Reading", dir: "18-code-reading", tier: "Advanced" },
  { id: "19", name: "Level 19: Refactoring JS to TS", dir: "19-refactoring", tier: "Core Master" },
  { id: "20", name: "Level 20: Debugging TS", dir: "20-debugging", tier: "Advanced" },
  { id: "21", name: "Level 21: Testing & Type-Tests", dir: "21-testing", tier: "Core Master" },
  { id: "22", name: "Level 22: Enterprise Capstone", dir: "22-project", tier: "Capstone" },
  { id: "23", name: "Level 23: Technical Interview", dir: "23-interview", tier: "Career" },
  { id: "24", name: "Level 24: Coding Interview DS&A", dir: "24-coding-interview", tier: "Career" },
  { id: "25", name: "Level 25: Final Assessment", dir: "25-final-assessment", tier: "Certification" }
];

for (const level of levels) {
  const levelPath = path.join(rootDir, level.dir);
  if (!fs.existsSync(levelPath)) continue;

  const subItems = fs.readdirSync(levelPath, { withFileTypes: true });
  const subDirs = subItems.filter(item => item.isDirectory());

  if (subDirs.length > 0 && !["22-project", "24-coding-interview", "25-final-assessment"].includes(level.dir)) {
    for (const subDir of subDirs) {
      const lessonPath = path.join(levelPath, subDir.name);
      const readmePath = path.join(lessonPath, "README.md");
      const lessonTsPath = path.join(lessonPath, "lesson.ts");
      const exerciseTsPath = path.join(lessonPath, "exercise.ts");
      const solutionTsPath = path.join(lessonPath, "solution.ts");

      let readmeContent = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf-8") : "";
      let lessonCode = fs.existsSync(lessonTsPath) ? fs.readFileSync(lessonTsPath, "utf-8") : "";
      let exerciseCode = fs.existsSync(exerciseTsPath) ? fs.readFileSync(exerciseTsPath, "utf-8") : "";
      let solutionCode = fs.existsSync(solutionTsPath) ? fs.readFileSync(solutionTsPath, "utf-8") : "";

      // Extract title from readme
      const titleMatch = readmeContent.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].replace(/\[.*?\]/g, "").trim() : subDir.name;

      catalog.push({
        id: `${level.id}-${subDir.name}`,
        levelId: level.id,
        levelName: level.name,
        tier: level.tier,
        slug: subDir.name,
        title,
        folder: `${level.dir}/${subDir.name}`,
        readme: readmeContent,
        lessonCode,
        exerciseCode,
        solutionCode
      });
    }
  } else {
    // Top-level files or specialized modules (e.g. 23-interview, 24-coding-interview, 25-final-assessment, 22-project)
    const files = subItems.filter(item => !item.isDirectory() && (item.name.endsWith(".md") || item.name.endsWith(".ts")));
    
    if (level.dir === "22-project") {
      const readmePath = path.join(levelPath, "workflow-compliance-engine", "README.md");
      const indexPath = path.join(levelPath, "workflow-compliance-engine", "src", "index.ts");
      const testPath = path.join(levelPath, "workflow-compliance-engine", "tests", "engine.test.ts");

      catalog.push({
        id: "22-capstone",
        levelId: level.id,
        levelName: level.name,
        tier: level.tier,
        slug: "workflow-compliance-engine",
        title: "Enterprise Workflow & Compliance Engine Capstone",
        folder: "22-project/workflow-compliance-engine",
        readme: fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf-8") : "",
        lessonCode: fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf-8") : "",
        exerciseCode: fs.existsSync(testPath) ? fs.readFileSync(testPath, "utf-8") : "",
        solutionCode: fs.existsSync(indexPath) ? fs.readFileSync(indexPath, "utf-8") : ""
      });
    } else if (level.dir === "24-coding-interview") {
      const tsFiles = files.filter(f => f.name.endsWith(".ts"));
      for (const file of tsFiles) {
        const filePath = path.join(levelPath, file.name);
        const code = fs.readFileSync(filePath, "utf-8");
        const title = file.name.replace(".ts", "").replace(/^\d+-/, "").replace(/-/g, " ").toUpperCase();
        catalog.push({
          id: `24-${file.name}`,
          levelId: level.id,
          levelName: level.name,
          tier: level.tier,
          slug: file.name,
          title: `DS&A Challenge: ${title}`,
          folder: `24-coding-interview/${file.name}`,
          readme: `# DS&A Coding Challenge: ${title}\n\nReview and execute the typed data structure in the interactive editor on the right.\n\n\`\`\`ts\n// Direct source in 24-coding-interview/${file.name}\n\`\`\``,
          lessonCode: code,
          exerciseCode: code,
          solutionCode: code
        });
      }
    } else if (level.dir === "23-interview") {
      const mdFiles = files.filter(f => f.name.endsWith(".md"));
      for (const file of mdFiles) {
        const filePath = path.join(levelPath, file.name);
        const content = fs.readFileSync(filePath, "utf-8");
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : file.name;
        catalog.push({
          id: `23-${file.name}`,
          levelId: level.id,
          levelName: level.name,
          tier: level.tier,
          slug: file.name,
          title,
          folder: `23-interview/${file.name}`,
          readme: content,
          lessonCode: "// Read questions and practice articulating answers",
          exerciseCode: "// Practice coding your answer here",
          solutionCode: "// Refer to question guide"
        });
      }
    } else if (level.dir === "25-final-assessment") {
      for (const file of files) {
        const filePath = path.join(levelPath, file.name);
        const content = fs.readFileSync(filePath, "utf-8");
        const isTs = file.name.endsWith(".ts");
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : file.name;
        catalog.push({
          id: `25-${file.name}`,
          levelId: level.id,
          levelName: level.name,
          tier: level.tier,
          slug: file.name,
          title,
          folder: `25-final-assessment/${file.name}`,
          readme: isTs ? `# Final Assessment: ${file.name}\n\nComplete the challenges in the code studio on the right.` : content,
          lessonCode: isTs ? content : "",
          exerciseCode: isTs ? content : "",
          solutionCode: ""
        });
      }
    }
  }
}

const outDir = path.join(rootDir, "frontend", "src");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, "lessons-catalog.json"), JSON.stringify(catalog, null, 2), "utf-8");
console.log(`Generated lessons-catalog.json with ${catalog.length} lessons!`);
