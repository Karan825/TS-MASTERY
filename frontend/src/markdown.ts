// High-contrast, zero-emoji Markdown renderer with Prism.js syntax highlighting
import Prism from "prismjs";
import "prismjs/components/prism-typescript.js";
import { icons } from "./icons";

export function renderMarkdown(markdown: string): string {
  if (!markdown) return "";

  const lines = markdown.split(/\r?\n/);
  const htmlOut: string[] = [];
  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockLines: string[] = [];
  let inTable = false;
  let tableHeaderParsed = false;
  let tableRows: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i] ?? "";

    // Code block toggle
    if (rawLine.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = rawLine.slice(3).trim() || "typescript";
        codeBlockLines = [];
        continue;
      } else {
        inCodeBlock = false;
        const rawCode = codeBlockLines.join("\n");
        let highlighted = "";
        try {
          const grammar = Prism.languages[codeBlockLang] || Prism.languages.typescript || Prism.languages.javascript;
          highlighted = Prism.highlight(rawCode, grammar, codeBlockLang);
        } catch {
          highlighted = escapeHtml(rawCode);
        }

        htmlOut.push(
          `<div class="code-block-wrapper">
            <div class="code-block-header">
              <span class="code-lang-tag">${codeBlockLang}</span>
              <button class="code-copy-btn" type="button" aria-label="Copy code">
                ${icons.copy}
                <span>Copy</span>
              </button>
            </div>
            <pre class="language-${codeBlockLang}"><code class="language-${codeBlockLang}">${highlighted}</code></pre>
          </div>`
        );
        continue;
      }
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // Table handling
    if (rawLine.trim().startsWith("|") && rawLine.trim().endsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableHeaderParsed = false;
        tableRows = [];
      }

      // Check if separator line (|---|---|)
      if (/^\|(\s*[-:]+\s*\|)+$/.test(rawLine.trim())) {
        tableHeaderParsed = true;
        continue;
      }

      const cells = rawLine
        .trim()
        .slice(1, -1)
        .split("|")
        .map(c => parseInline(c.trim()));

      if (!tableHeaderParsed && tableRows.length === 0) {
        tableRows.push(`<thead><tr>${cells.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>`);
      } else {
        tableRows.push(`<tr>${cells.map(c => `<td>${c}</td>`).join("")}</tr>`);
      }
      continue;
    } else if (inTable) {
      inTable = false;
      htmlOut.push(`<div class="table-container"><table>${tableRows.join("")}</tbody></table></div>`);
      tableRows = [];
    }

    // Callout blocks: > [!NOTE] or > NOTE:
    if (rawLine.startsWith(">")) {
      const calloutText = rawLine.replace(/^>\s*/, "");
      let calloutType = "note";
      let title = "NOTE";

      if (/\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]/i.test(calloutText)) {
        const match = calloutText.match(/\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]/i);
        const type = match ? match[1]!.toLowerCase() : "note";
        calloutType = type === "caution" ? "warning" : type;
        title = type.toUpperCase();
        const content = calloutText.replace(/\[!(NOTE|IMPORTANT|WARNING|TIP|CAUTION)\]/i, "").trim();
        htmlOut.push(
          `<div class="callout callout-${calloutType}">
            <div class="callout-header">${icons.alertTriangle} ${title}</div>
            <div class="callout-content">${parseInline(content)}</div>
          </div>`
        );
        continue;
      } else {
        htmlOut.push(`<blockquote>${parseInline(calloutText)}</blockquote>`);
        continue;
      }
    }

    // Headings
    if (rawLine.startsWith("# ")) {
      htmlOut.push(`<h1>${parseInline(rawLine.slice(2))}</h1>`);
      continue;
    }
    if (rawLine.startsWith("## ")) {
      htmlOut.push(`<h2>${parseInline(rawLine.slice(3))}</h2>`);
      continue;
    }
    if (rawLine.startsWith("### ")) {
      htmlOut.push(`<h3>${parseInline(rawLine.slice(4))}</h3>`);
      continue;
    }

    // Horizontal rule
    if (/^(\*\*\*|---|___)$/.test(rawLine.trim())) {
      htmlOut.push("<hr />");
      continue;
    }

    // Lists
    if (/^[\*\-]\s+/.test(rawLine)) {
      htmlOut.push(`<ul><li>${parseInline(rawLine.replace(/^[\*\-]\s+/, ""))}</li></ul>`);
      continue;
    }
    if (/^\d+\.\s+/.test(rawLine)) {
      htmlOut.push(`<ol><li>${parseInline(rawLine.replace(/^\d+\.\s+/, ""))}</li></ol>`);
      continue;
    }

    // Details tags
    if (rawLine.includes("<details>") || rawLine.includes("</details>") || rawLine.includes("<summary>") || rawLine.includes("</summary>")) {
      htmlOut.push(rawLine);
      continue;
    }

    // Empty lines
    if (rawLine.trim() === "") {
      continue;
    }

    // Normal paragraph
    htmlOut.push(`<p>${parseInline(rawLine)}</p>`);
  }

  if (inTable && tableRows.length > 0) {
    htmlOut.push(`<div class="table-container"><table>${tableRows.join("")}</tbody></table></div>`);
  }

  // Group consecutive <ul> and <ol> tags
  return htmlOut
    .join("\n")
    .replace(/<\/ul>\n<ul>/g, "")
    .replace(/<\/ol>\n<ol>/g, "");
}

function parseInline(text: string): string {
  if (!text) return "";
  let res = escapeHtml(text);

  // Bold: **text**
  res = res.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Inline code: `code`
  res = res.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Intelligent internal routing for links
  res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const cleanHref = href.toLowerCase();
    if (cleanHref.includes("exercise.ts")) {
      return `<button type="button" class="studio-link-btn" data-action="tab-exercise">${label}</button>`;
    }
    if (cleanHref.includes("solution.ts")) {
      return `<button type="button" class="studio-link-btn" data-action="tab-solution">${label}</button>`;
    }
    if (cleanHref.includes("lesson.ts")) {
      return `<button type="button" class="studio-link-btn" data-action="tab-lesson">${label}</button>`;
    }
    if (cleanHref.endsWith(".md") || cleanHref.startsWith("./") || cleanHref.startsWith("../")) {
      return `<button type="button" class="lesson-link-btn" data-href="${href}">${label}</button>`;
    }
    return `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
  });

  // Clean badges
  res = res.replace(/\[PASS\]/g, '<span class="badge-tag pass">PASS</span>');
  res = res.replace(/\[FAIL\]/g, '<span class="badge-tag fail">FAIL</span>');
  res = res.replace(/\[OK\]/g, '<span class="badge-tag pass">OK</span>');
  res = res.replace(/\[ERR\]/g, '<span class="badge-tag fail">ERR</span>');
  res = res.replace(/\[NOTE\]/g, '<span class="badge-tag info">NOTE</span>');

  return res;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
