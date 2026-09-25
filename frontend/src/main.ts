import "./styles.css";
import Prism from "prismjs";
import "prismjs/components/prism-typescript.js";
import { icons } from "./icons";
import { renderMarkdown } from "./markdown";
import { executeTypeScript } from "./runner";
import catalogData from "./lessons-catalog.json";

interface Lesson {
  id: string;
  levelId: string;
  levelName: string;
  tier: string;
  slug: string;
  title: string;
  folder: string;
  readme: string;
  lessonCode: string;
  exerciseCode: string;
  solutionCode: string;
}

const lessons: Lesson[] = catalogData as Lesson[];

// Application State
let activeIndex = 0;
let activeTab: "exercise" | "solution" | "lesson" | "scratch" = "exercise";
let layoutMode: "split" | "reader" | "studio" = "split";
let searchQuery = "";
let isSolutionRevealed = false;
let isSidebarOpen = true;
let terminalMode: "normal" | "collapsed" | "expanded" = "normal";
let scratchpadCode = `// Scratchpad - Freeform TypeScript IDE\n// Comments are highlighted in green!\n\ninterface Developer {\n  name: string;\n  primaryLanguage: "TypeScript";\n  yearsExperience: number;\n}\n\nconst dev: Developer = {\n  name: "Karan",\n  primaryLanguage: "TypeScript",\n  yearsExperience: 5\n};\n\nconsole.log(\`Developer: \${dev.name} (\${dev.primaryLanguage})\`);\n`;

// LocalStorage Persistence
const STORAGE_PREFIX = "ts_mastery_";
function getStoredCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + "completed");
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCompleted(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_PREFIX + "completed", JSON.stringify(Array.from(set)));
  } catch {}
}

function getStoredCode(lessonId: string, tab: string): string | null {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}code_${lessonId}_${tab}`);
  } catch {
    return null;
  }
}

function saveCode(lessonId: string, tab: string, code: string) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}code_${lessonId}_${tab}`, code);
  } catch {}
}

const completedLessons = getStoredCompleted();

// Terminal State
let terminalLogs: { text: string; type: "log" | "pass" | "fail" | "info" | "warn" }[] = [
  { text: "TypeScript IDE Ready. Press Ctrl+Enter to compile and run.", type: "info" }
];
let terminalStatus: "idle" | "running" | "pass" | "fail" = "idle";
let terminalDuration = 0;

// Root Element
const app = document.getElementById("app")!;

function renderApp() {
  const currentLesson = lessons[activeIndex] || lessons[0]!;
  const progressPercent = Math.round((completedLessons.size / lessons.length) * 100);

  // Group lessons by level
  const groupedLevels: { [levelName: string]: Lesson[] } = {};
  for (const l of lessons) {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!l.title.toLowerCase().includes(q) && !l.levelName.toLowerCase().includes(q) && !l.slug.toLowerCase().includes(q)) {
        continue;
      }
    }
    if (!groupedLevels[l.levelName]) {
      groupedLevels[l.levelName] = [];
    }
    groupedLevels[l.levelName]!.push(l);
  }

  // Get current code
  let editorCode = "";
  if (activeTab === "exercise") {
    editorCode = getStoredCode(currentLesson.id, "exercise") ?? (currentLesson.exerciseCode || "// No starter exercise for this module.");
  } else if (activeTab === "solution") {
    editorCode = isSolutionRevealed ? (currentLesson.solutionCode || "// No separate solution file.") : "// Solution is hidden.\n// Click 'Reveal Solution' above to inspect.";
  } else if (activeTab === "lesson") {
    editorCode = currentLesson.lessonCode || "// No lesson script for this module.";
  } else if (activeTab === "scratch") {
    editorCode = scratchpadCode;
  }

  const isCompleted = completedLessons.has(currentLesson.id);

  app.innerHTML = `
    <!-- Top Navigation Bar -->
    <header class="app-header">
      <div class="header-left">
        <button class="sidebar-toggle-btn" id="btn-toggle-sidebar" title="Toggle Sidebar (Ctrl+B)">
          ${icons.sidebar}
        </button>
        <a href="#" class="brand-badge">${icons.code} TS-MASTERY</a>
        <div class="header-divider"></div>
        <div class="header-breadcrumb">
          <span class="breadcrumb-level">${currentLesson.levelName}</span>
          <span>/</span>
          <span class="breadcrumb-lesson">${currentLesson.title}</span>
        </div>
      </div>

      <div class="header-center">
        <div class="course-progress-pill">
          <span>${completedLessons.size} / ${lessons.length} COMPLETE</span>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <span>${progressPercent}%</span>
        </div>
      </div>

      <div class="header-right">
        <div class="layout-toggle-group">
          <button class="layout-btn ${layoutMode === 'split' ? 'active' : ''}" id="btn-layout-split" title="Split View">
            ${icons.columns} Split
          </button>
          <button class="layout-btn ${layoutMode === 'reader' ? 'active' : ''}" id="btn-layout-reader" title="Reader Only">
            ${icons.book} Reader
          </button>
          <button class="layout-btn ${layoutMode === 'studio' ? 'active' : ''}" id="btn-layout-studio" title="Studio Only">
            ${icons.terminal} Studio
          </button>
        </div>
      </div>
    </header>

    <!-- Main Workspace -->
    <div class="app-container">
      <!-- Left Navigation Sidebar (Closeable) -->
      <aside class="app-sidebar ${isSidebarOpen ? '' : 'sidebar-collapsed'}" id="app-sidebar">
        <div class="sidebar-search-box">
          <div class="search-input-wrapper">
            <span class="search-icon">${icons.search}</span>
            <input 
              type="text" 
              class="search-input" 
              id="sidebar-search" 
              placeholder="Search topics, syntax, generics..." 
              value="${escapeAttr(searchQuery)}" 
            />
            <span class="search-shortcut">/</span>
          </div>
        </div>

        <div class="sidebar-content">
          ${Object.entries(groupedLevels).map(([lvlName, lvlLessons]) => `
            <div class="level-group">
              <button class="level-header">
                <span class="level-title-flex">
                  <span class="level-chevron">${icons.chevronDown}</span>
                  <span>${lvlName}</span>
                </span>
                <span class="level-tier-badge">${lvlLessons[0]?.tier || 'Core'}</span>
              </button>
              <ul class="lesson-list">
                ${lvlLessons.map(l => {
                  const idx = lessons.findIndex(x => x.id === l.id);
                  const isAct = idx === activeIndex;
                  const isDone = completedLessons.has(l.id);
                  return `
                    <li class="lesson-item ${isAct ? 'active' : ''}" data-index="${idx}">
                      <span class="lesson-item-title">${l.title}</span>
                      <span class="status-dot ${isDone ? 'completed' : isAct ? 'active' : ''}"></span>
                    </li>
                  `;
                }).join("")}
              </ul>
            </div>
          `).join("")}
        </div>
      </aside>

      <!-- Center Pane: Markdown Reader -->
      ${layoutMode !== 'studio' ? `
        <main class="reader-pane ${layoutMode === 'reader' ? 'fullscreen' : ''}">
          <article class="markdown-body">
            ${renderMarkdown(currentLesson.readme)}
          </article>
        </main>
      ` : ''}

      <!-- Right Pane: Interactive Code Studio with Live Syntax Highlighting -->
      ${layoutMode !== 'reader' ? `
        <section class="studio-pane ${layoutMode === 'studio' ? 'fullscreen' : ''}">
          <!-- Tab Bar -->
          <div class="studio-header">
            <div class="studio-tabs">
              <button class="tab-btn ${activeTab === 'exercise' ? 'active' : ''}" id="tab-exercise">
                ${icons.code} Exercise.ts
              </button>
              <button class="tab-btn ${activeTab === 'solution' ? 'active' : ''}" id="tab-solution">
                ${icons.eye} Solution.ts
              </button>
              <button class="tab-btn ${activeTab === 'lesson' ? 'active' : ''}" id="tab-lesson">
                ${icons.book} Lesson.ts
              </button>
              <button class="tab-btn ${activeTab === 'scratch' ? 'active' : ''}" id="tab-scratch">
                ${icons.terminal} Scratchpad.ts
              </button>
            </div>

            <div class="studio-actions-bar">
              ${activeTab === 'solution' && !isSolutionRevealed ? `
                <button class="studio-btn subtle" id="btn-reveal-solution" title="Reveal reference solution">
                  ${icons.eye}
                  <span>Reveal Solution</span>
                </button>
              ` : ''}

              <div class="studio-btn-group">
                <button class="studio-btn ${isCompleted ? 'mastered' : ''}" id="btn-toggle-mastered" title="Toggle Mastered state">
                  ${icons.check}
                  <span>${isCompleted ? 'Mastered' : 'Mark as Mastered'}</span>
                </button>

                <button class="studio-btn" id="btn-reset-code" title="Reset code to initial template">
                  ${icons.refresh}
                  <span>Reset</span>
                </button>

                <button class="studio-btn primary" id="btn-run-code" title="Compile & Run (Ctrl+Enter)">
                  ${icons.play}
                  <span>Run Code</span>
                  <kbd>Ctrl+↵</kbd>
                </button>
              </div>

              <div class="studio-header-divider"></div>

              <button class="studio-icon-btn ${layoutMode === 'studio' ? 'active' : ''}" id="btn-expand-ide" title="${layoutMode === 'studio' ? 'Restore Split View' : 'Expand IDE Fullscreen'}">
                ${layoutMode === 'studio' ? icons.minimize : icons.maximize}
              </button>
            </div>
          </div>

          <!-- Code Editor Body (Syntax Highlighted) -->
          <div class="editor-container">
            <div class="code-gutter" id="code-gutter"></div>
            <div class="editor-canvas-wrapper" id="editor-canvas-wrapper">
              <pre class="editor-highlight-layer" id="editor-highlight-layer" aria-hidden="true"><code class="language-typescript" id="editor-highlighted-code"></code></pre>
              <textarea 
                class="code-textarea" 
                id="code-editor" 
                spellcheck="false" 
                autocomplete="off" 
                autocorrect="off" 
                autocapitalize="off"
                ${activeTab === 'solution' && !isSolutionRevealed ? 'readonly' : ''}
              >${escapeHtml(editorCode)}</textarea>
            </div>
          </div>

          <!-- Bottom Console / Terminal -->
          <div class="terminal-pane ${terminalMode === 'collapsed' ? 'terminal-collapsed' : terminalMode === 'expanded' ? 'terminal-maximized' : ''}">
            <div class="terminal-header">
              <div class="terminal-title">
                <span class="terminal-indicator ${terminalStatus}"></span>
                <span>Terminal</span>
                ${terminalDuration > 0 ? `<span class="terminal-metric">(${terminalDuration}ms)</span>` : ''}
              </div>
              <div class="terminal-tools">
                <button class="terminal-clear-btn" id="btn-clear-terminal" title="Clear terminal logs">Clear</button>
                <button class="terminal-icon-btn" id="btn-toggle-terminal" title="${terminalMode === 'collapsed' ? 'Expand Terminal' : 'Collapse Terminal'}">
                  ${terminalMode === 'collapsed' ? icons.chevronUp : icons.chevronDown}
                </button>
              </div>
            </div>
            <div class="terminal-output" id="terminal-output">
              ${terminalLogs.length > 0 ? terminalLogs.map(l => `
                <div class="terminal-line ${l.type}">
                  ${l.type === 'pass' ? '<span class="badge-tag pass">PASS</span>' : ''}
                  ${l.type === 'fail' ? '<span class="badge-tag fail">FAIL</span>' : ''}
                  ${l.type === 'info' ? '<span class="badge-tag info">INFO</span>' : ''}
                  ${escapeHtml(l.text)}
                </div>
              `).join("") : `
                <div class="terminal-line info" style="color: #666666;">
                  &gt; TypeScript engine ready. Press Run Code (Ctrl+↵) to evaluate.
                </div>
              `}
            </div>
          </div>
        </section>
      ` : ''}
    </div>
  `;

  attachEventHandlers();
  updateEditorHighlight();
}

function updateEditorHighlight() {
  const editor = document.getElementById("code-editor") as HTMLTextAreaElement | null;
  const highlightCode = document.getElementById("editor-highlighted-code");
  const highlightLayer = document.getElementById("editor-highlight-layer");
  const gutter = document.getElementById("code-gutter");

  if (!editor || !highlightCode || !highlightLayer || !gutter) return;

  const rawCode = editor.value;
  const codeToHighlight = rawCode.endsWith("\n") ? rawCode + " " : rawCode;

  try {
    highlightCode.innerHTML = Prism.highlight(codeToHighlight, Prism.languages.typescript || Prism.languages.javascript, "typescript");
  } catch {
    highlightCode.textContent = codeToHighlight;
  }

  // Update Gutter numbers
  const linesCount = rawCode.split("\n").length;
  gutter.innerHTML = Array.from({ length: linesCount }, (_, i) => `<div class="gutter-number">${i + 1}</div>`).join("");

  // Sync scroll positions
  highlightLayer.scrollTop = editor.scrollTop;
  highlightLayer.scrollLeft = editor.scrollLeft;
  gutter.scrollTop = editor.scrollTop;
}

function attachEventHandlers() {
  const currentLesson = lessons[activeIndex] || lessons[0]!;

  // Toggle Sidebar
  document.getElementById("btn-toggle-sidebar")?.addEventListener("click", () => {
    isSidebarOpen = !isSidebarOpen;
    const sidebar = document.getElementById("app-sidebar");
    sidebar?.classList.toggle("sidebar-collapsed", !isSidebarOpen);
  });

  // Layout Toggles
  document.getElementById("btn-layout-split")?.addEventListener("click", () => { layoutMode = "split"; renderApp(); });
  document.getElementById("btn-layout-reader")?.addEventListener("click", () => { layoutMode = "reader"; renderApp(); });
  document.getElementById("btn-layout-studio")?.addEventListener("click", () => { layoutMode = "studio"; renderApp(); });

  // Sidebar Search
  const searchInput = document.getElementById("sidebar-search") as HTMLInputElement | null;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = (e.target as HTMLInputElement).value;
      renderApp();
      const updatedInput = document.getElementById("sidebar-search") as HTMLInputElement | null;
      if (updatedInput) {
        updatedInput.focus();
        updatedInput.setSelectionRange(searchQuery.length, searchQuery.length);
      }
    });
  }

  // Lesson Click
  document.querySelectorAll(".lesson-item").forEach(item => {
    item.addEventListener("click", () => {
      const idx = parseInt(item.getAttribute("data-index") || "0", 10);
      activeIndex = idx;
      isSolutionRevealed = false;
      renderApp();
    });
  });

  // Level Accordion Header Click
  document.querySelectorAll(".level-header").forEach(hdr => {
    hdr.addEventListener("click", () => {
      const group = hdr.closest(".level-group");
      group?.classList.toggle("collapsed");
    });
  });

  // Editor Tabs
  document.getElementById("tab-exercise")?.addEventListener("click", () => { activeTab = "exercise"; renderApp(); });
  document.getElementById("tab-solution")?.addEventListener("click", () => { activeTab = "solution"; renderApp(); });
  document.getElementById("tab-lesson")?.addEventListener("click", () => { activeTab = "lesson"; renderApp(); });
  document.getElementById("tab-scratch")?.addEventListener("click", () => { activeTab = "scratch"; renderApp(); });

  // Reveal Solution Button
  document.getElementById("btn-reveal-solution")?.addEventListener("click", () => {
    isSolutionRevealed = true;
    renderApp();
  });

  // Mark as Mastered
  document.getElementById("btn-toggle-mastered")?.addEventListener("click", () => {
    if (completedLessons.has(currentLesson.id)) {
      completedLessons.delete(currentLesson.id);
    } else {
      completedLessons.add(currentLesson.id);
    }
    saveCompleted(completedLessons);
    renderApp();
  });

  // Code Editor Input, Scroll, & Tab Indentation
  const editor = document.getElementById("code-editor") as HTMLTextAreaElement | null;
  if (editor) {
    editor.addEventListener("input", () => {
      updateEditorHighlight();
      if (activeTab === "exercise") {
        saveCode(currentLesson.id, "exercise", editor.value);
      } else if (activeTab === "scratch") {
        scratchpadCode = editor.value;
      }
    });

    editor.addEventListener("scroll", () => {
      const highlightLayer = document.getElementById("editor-highlight-layer");
      const gutter = document.getElementById("code-gutter");
      if (highlightLayer) {
        highlightLayer.scrollTop = editor.scrollTop;
        highlightLayer.scrollLeft = editor.scrollLeft;
      }
      if (gutter) {
        gutter.scrollTop = editor.scrollTop;
      }
    });

    // Support Tab key for 2-space indentation & Ctrl+Enter to run
    editor.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + "  " + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 2;
        updateEditorHighlight();
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        runActiveCode();
      }
    });
  }

  // Reset Code
  document.getElementById("btn-reset-code")?.addEventListener("click", () => {
    if (confirm("Reset current file to default starter code?")) {
      if (activeTab === "exercise") {
        saveCode(currentLesson.id, "exercise", currentLesson.exerciseCode || "");
      }
      renderApp();
    }
  });

  // Run Code
  document.getElementById("btn-run-code")?.addEventListener("click", () => {
    runActiveCode();
  });

  // Clear Terminal
  document.getElementById("btn-clear-terminal")?.addEventListener("click", () => {
    terminalLogs = [];
    terminalStatus = "idle";
    terminalDuration = 0;
    renderApp();
  });

  // Expand / Restore IDE Fullscreen
  document.getElementById("btn-expand-ide")?.addEventListener("click", () => {
    layoutMode = layoutMode === "studio" ? "split" : "studio";
    renderApp();
  });

  // Toggle Terminal Height / Collapse
  document.getElementById("btn-toggle-terminal")?.addEventListener("click", () => {
    terminalMode = terminalMode === "collapsed" ? "normal" : "collapsed";
    renderApp();
  });

  // Interactive In-App Studio Links (e.g. clicking [exercise.ts] or [solution.ts] in markdown)
  document.querySelectorAll(".studio-link-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      if (layoutMode === "reader") {
        layoutMode = "split";
      }
      if (action === "tab-exercise") {
        activeTab = "exercise";
      } else if (action === "tab-solution") {
        activeTab = "solution";
        isSolutionRevealed = true;
      } else if (action === "tab-lesson") {
        activeTab = "lesson";
      }
      renderApp();
      const ed = document.getElementById("code-editor") as HTMLTextAreaElement | null;
      ed?.focus();
    });
  });

  // In-App Lesson Navigation Links (e.g. clicking [Lesson 00.1](./01-primitives-and-references/README.md))
  document.querySelectorAll(".lesson-link-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const href = btn.getAttribute("data-href") || "";
      const targetSlug = href.replace(/^\.\//, "").replace(/\/README\.md$/i, "").replace(/\.md$/i, "");
      const foundIdx = lessons.findIndex(l => l.folder.includes(targetSlug) || l.slug.includes(targetSlug) || l.id.includes(targetSlug));
      if (foundIdx !== -1) {
        activeIndex = foundIdx;
        isSolutionRevealed = false;
        renderApp();
      }
    });
  });

  // Markdown Code Block Copy Button
  document.querySelectorAll(".code-copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const codeEl = btn.closest(".code-block-wrapper")?.querySelector("code");
      if (codeEl) {
        navigator.clipboard.writeText(codeEl.innerText);
        const span = btn.querySelector("span");
        if (span) span.textContent = "Copied";
        setTimeout(() => {
          if (span) span.textContent = "Copy";
        }, 1500);
      }
    });
  });
}

async function runActiveCode() {
  const editor = document.getElementById("code-editor") as HTMLTextAreaElement | null;
  if (!editor) return;

  const code = editor.value;
  terminalStatus = "running";
  terminalLogs = [{ text: "Compiling and executing TypeScript...", type: "info" }];
  renderApp();

  const res = await executeTypeScript(code, false);

  terminalDuration = res.durationMs;
  terminalStatus = res.success ? "pass" : "fail";

  const lines = res.output.split("\n");
  terminalLogs = lines.map((line: string) => {
    let type: "log" | "pass" | "fail" | "info" | "warn" = "log";
    if (line.includes("[PASS]") || line.includes("Passed")) type = "pass";
    else if (line.includes("[FAIL]") || line.includes("Failed") || line.includes("ERROR") || line.includes("error TS")) type = "fail";
    else if (line.includes("[WARN]")) type = "warn";
    else if (line.includes("[INFO]")) type = "info";
    return { text: line, type };
  });

  renderApp();

  // Scroll terminal to bottom
  const term = document.getElementById("terminal-output");
  if (term) term.scrollTop = term.scrollHeight;
}

// Global hotkeys (Ctrl+B for sidebar, / for search)
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
    e.preventDefault();
    isSidebarOpen = !isSidebarOpen;
    const sidebar = document.getElementById("app-sidebar");
    sidebar?.classList.toggle("sidebar-collapsed", !isSidebarOpen);
  } else if (e.key === "/" && (document.activeElement?.tagName !== "TEXTAREA" && document.activeElement?.tagName !== "INPUT")) {
    e.preventDefault();
    const input = document.getElementById("sidebar-search") as HTMLInputElement | null;
    input?.focus();
  }
});

function escapeHtml(str: string): string {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  if (!str) return "";
  return str.replace(/"/g, "&quot;");
}

// Initial Boot
renderApp();
