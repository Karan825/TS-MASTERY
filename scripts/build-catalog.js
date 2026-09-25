import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const catalog = [];

const progressContent = fs.existsSync(path.join(rootDir, "PROGRESS.md"))
  ? fs.readFileSync(path.join(rootDir, "PROGRESS.md"), "utf-8")
  : "";

function scanFiles(dir) {
  const fileMap = {};
  if (!fs.existsSync(dir)) return fileMap;

  function walk(currentDir, relPrefix = "") {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(currentDir, ent.name);
      const relPath = relPrefix ? `${relPrefix}/${ent.name}` : ent.name;
      if (ent.isDirectory()) {
        walk(fullPath, relPath);
      } else {
        const content = fs.readFileSync(fullPath, "utf-8");
        fileMap[relPath] = content;
        fileMap[ent.name] = content;
        fileMap[`./${relPath}`] = content;
        fileMap[`./${ent.name}`] = content;
      }
    }
  }
  walk(dir);
  return fileMap;
}

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
      const extraFiles = scanFiles(lessonPath);
      extraFiles["PROGRESS.md"] = progressContent;
      extraFiles["./PROGRESS.md"] = progressContent;
      extraFiles["../PROGRESS.md"] = progressContent;

      const readmeContent = extraFiles["README.md"] || "";

      // Determine exercise code and filename
      let exerciseCode = "";
      let exerciseFilename = "exercise.ts";
      if (extraFiles["exercise.ts"]) {
        exerciseCode = extraFiles["exercise.ts"];
        exerciseFilename = "exercise.ts";
      } else if (extraFiles["legacy-code.js"]) {
        exerciseCode = extraFiles["legacy-code.js"];
        exerciseFilename = "legacy-code.js";
      } else if (extraFiles["broken-cases.ts"]) {
        exerciseCode = extraFiles["broken-cases.ts"];
        exerciseFilename = "broken-cases.ts";
      } else if (extraFiles["challenges.ts"]) {
        exerciseCode = extraFiles["challenges.ts"];
        exerciseFilename = "challenges.ts";
      } else if (extraFiles["unit-tests.test.ts"]) {
        exerciseCode = extraFiles["unit-tests.test.ts"];
        exerciseFilename = "unit-tests.test.ts";
      }

      // Determine solution code and filename
      let solutionCode = "";
      let solutionFilename = "solution.ts";
      if (extraFiles["solution.ts"]) {
        solutionCode = extraFiles["solution.ts"];
        solutionFilename = "solution.ts";
      } else if (extraFiles["refactored.ts"]) {
        solutionCode = extraFiles["refactored.ts"];
        solutionFilename = "refactored.ts";
      } else if (extraFiles["diagnosis-and-fixes.ts"]) {
        solutionCode = extraFiles["diagnosis-and-fixes.ts"];
        solutionFilename = "diagnosis-and-fixes.ts";
      } else if (extraFiles["challenges.ts"]) {
        solutionCode = extraFiles["challenges.ts"];
        solutionFilename = "challenges.ts";
      }

      // Determine lesson code and filename
      let lessonCode = "";
      let lessonFilename = "lesson.ts";
      if (extraFiles["lesson.ts"]) {
        lessonCode = extraFiles["lesson.ts"];
        lessonFilename = "lesson.ts";
      } else if (extraFiles["type-tests.test.ts"]) {
        lessonCode = extraFiles["type-tests.test.ts"];
        lessonFilename = "type-tests.test.ts";
      } else if (extraFiles["legacy-code.js"]) {
        lessonCode = extraFiles["legacy-code.js"];
        lessonFilename = "legacy-code.js";
      } else if (extraFiles["broken-cases.ts"]) {
        lessonCode = extraFiles["broken-cases.ts"];
        lessonFilename = "broken-cases.ts";
      } else if (extraFiles["challenges.ts"]) {
        lessonCode = extraFiles["challenges.ts"];
        lessonFilename = "challenges.ts";
      }

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
        lessonFilename,
        exerciseCode,
        exerciseFilename,
        solutionCode,
        solutionFilename,
        extraFiles
      });
    }
  } else {
    // Top-level files or specialized modules (e.g. 23-interview, 24-coding-interview, 25-final-assessment, 22-project)
    const files = subItems.filter(item => !item.isDirectory() && (item.name.endsWith(".md") || item.name.endsWith(".ts")));
    
    if (level.dir === "22-project") {
      const projectPath = path.join(levelPath, "workflow-compliance-engine");
      const extraFiles = scanFiles(projectPath);
      extraFiles["PROGRESS.md"] = progressContent;
      extraFiles["./PROGRESS.md"] = progressContent;

      catalog.push({
        id: "22-capstone",
        levelId: level.id,
        levelName: level.name,
        tier: level.tier,
        slug: "workflow-compliance-engine",
        title: "Enterprise Workflow & Compliance Engine Capstone",
        folder: "22-project/workflow-compliance-engine",
        readme: extraFiles["README.md"] || "",
        lessonCode: extraFiles["src/index.ts"] || "",
        lessonFilename: "src/index.ts",
        exerciseCode: extraFiles["tests/engine.test.ts"] || "",
        exerciseFilename: "tests/engine.test.ts",
        solutionCode: extraFiles["src/engine.ts"] || "",
        solutionFilename: "src/engine.ts",
        extraFiles
      });
    } else if (level.dir === "24-coding-interview") {
      const extraFiles = scanFiles(levelPath);
      extraFiles["PROGRESS.md"] = progressContent;
      extraFiles["./PROGRESS.md"] = progressContent;

      const tsFiles = files.filter(f => f.name.endsWith(".ts"));
      for (const file of tsFiles) {
        const code = extraFiles[file.name] || "";
        const title = file.name.replace(".ts", "").replace(/^\d+-/, "").replace(/-/g, " ").toUpperCase();
        catalog.push({
          id: `24-${file.name}`,
          levelId: level.id,
          levelName: level.name,
          tier: level.tier,
          slug: file.name,
          title: `DS&A Challenge: ${title}`,
          folder: `24-coding-interview`,
          readme: `# DS&A Coding Challenge: ${title}\n\nReview and execute the typed data structure in the interactive editor on the right.\n\n\`\`\`ts\n// Source: 24-coding-interview/${file.name}\n\`\`\``,
          lessonCode: code,
          lessonFilename: file.name,
          exerciseCode: code,
          exerciseFilename: file.name,
          solutionCode: code,
          solutionFilename: file.name,
          extraFiles
        });
      }
    } else if (level.dir === "23-interview") {
      const extraFiles = scanFiles(levelPath);
      extraFiles["PROGRESS.md"] = progressContent;
      extraFiles["./PROGRESS.md"] = progressContent;

      const mdFiles = files.filter(f => f.name.endsWith(".md"));
      for (const file of mdFiles) {
        const content = extraFiles[file.name] || "";
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : file.name;
        catalog.push({
          id: `23-${file.name}`,
          levelId: level.id,
          levelName: level.name,
          tier: level.tier,
          slug: file.name,
          title,
          folder: `23-interview`,
          readme: content,
          lessonCode: "// Read questions and practice articulating answers in technical interviews.",
          lessonFilename: "guide.ts",
          exerciseCode: "// Practice coding your answer here:\n",
          exerciseFilename: "practice.ts",
          solutionCode: "// Refer to question guide and solutions in the markdown viewer.",
          solutionFilename: "guide.ts",
          extraFiles
        });
      }
    } else if (level.dir === "25-final-assessment") {
      const extraFiles = scanFiles(levelPath);
      extraFiles["PROGRESS.md"] = progressContent;
      extraFiles["./PROGRESS.md"] = progressContent;

      for (const file of files) {
        const content = extraFiles[file.name] || "";
        const isTs = file.name.endsWith(".ts");
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : file.name;

        let solutionCode = "";
        let solutionFilename = "solution.ts";
        if (file.name === "part3-debugging-10.ts") {
          solutionCode = extraFiles["answers-and-solutions/part3-solutions.ts"] || extraFiles["part3-solutions.ts"] || "";
          solutionFilename = "part3-solutions.ts";
        } else if (file.name === "part4-implementation-10.ts") {
          solutionCode = extraFiles["answers-and-solutions/part4-solutions.ts"] || extraFiles["part4-solutions.ts"] || "";
          solutionFilename = "part4-solutions.ts";
        } else if (file.name === "part5-advanced-types-10.ts") {
          solutionCode = extraFiles["answers-and-solutions/part5-solutions.ts"] || extraFiles["part5-solutions.ts"] || "";
          solutionFilename = "part5-solutions.ts";
        } else if (file.name === "part1-conceptual-50.md") {
          solutionCode = extraFiles["answers-and-solutions/part1-answers.md"] || extraFiles["part1-answers.md"] || "";
          solutionFilename = "part1-answers.md";
        } else if (file.name === "part2-type-prediction-20.md") {
          solutionCode = extraFiles["answers-and-solutions/part2-answers.md"] || extraFiles["part2-answers.md"] || "";
          solutionFilename = "part2-answers.md";
        }

        catalog.push({
          id: `25-${file.name}`,
          levelId: level.id,
          levelName: level.name,
          tier: level.tier,
          slug: file.name,
          title,
          folder: `25-final-assessment`,
          readme: isTs ? `# Final Assessment: ${file.name}\n\nComplete the challenges in the code studio on the right.\nWhen finished, inspect the solution tab to compare your implementation.` : content,
          lessonCode: isTs ? content : "",
          lessonFilename: isTs ? file.name : "assessment.ts",
          exerciseCode: isTs ? content : "",
          exerciseFilename: isTs ? file.name : "exercise.ts",
          solutionCode,
          solutionFilename,
          extraFiles
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
console.log(`Generated lessons-catalog.json with ${catalog.length} lessons and comprehensive extraFiles mapping!`);
