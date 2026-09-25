// TypeScript Execution Engine (Server-backed + In-Browser Sucrase Engine)
import { transform } from "sucrase";

export interface RunResult {
  success: boolean;
  output: string;
  durationMs: number;
  isTest?: boolean;
}

export async function executeTypeScript(code: string, isTest: boolean = false): Promise<RunResult> {
  const startTime = performance.now();

  // 1. Try local dev server API if available (running tsx on Node)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch("/api/run-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, isTest }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        success: data.success,
        output: data.output || "Execution completed with no output.",
        durationMs: Math.round(performance.now() - startTime),
        isTest
      };
    }
  } catch {
    // Dev server unavailable or running on static GitHub Pages - execute client-side with Sucrase
  }

  // 2. Battle-tested Client-Side Sucrase Execution
  return runInBrowserWithSucrase(code, startTime, isTest);
}

function runInBrowserWithSucrase(tsCode: string, startTime: number, isTest: boolean): RunResult {
  const logs: string[] = [];

  // Capture console
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalAssert = console.assert;

  console.log = (...args: any[]) => {
    logs.push(`[LOG] ${args.map(formatArg).join(" ")}`);
  };
  console.error = (...args: any[]) => {
    logs.push(`[FAIL] ${args.map(formatArg).join(" ")}`);
  };
  console.warn = (...args: any[]) => {
    logs.push(`[WARN] ${args.map(formatArg).join(" ")}`);
  };
  console.assert = (condition: boolean, ...args: any[]) => {
    if (!condition) {
      logs.push(`[ASSERT FAILED] ${args.map(formatArg).join(" ")}`);
    }
  };

  let success = true;

  try {
    // Transpile TypeScript to JavaScript via Sucrase
    const transpiled = transform(tsCode, { transforms: ["typescript"] });

    // Clean module exports & imports for clean function-level execution
    let executableJs = transpiled.code
      .replace(/\bimport\s+type\s+[^;]+;?/g, "")
      .replace(/\bimport\s+[^;]+;?/g, "")
      .replace(/\bexport\s+default\s+/g, "")
      .replace(/\bexport\s+(async\s+)?(function|const|let|var|class)\s+/g, "$1$2 ")
      .replace(/\bexport\s*\{[^}]*\};?/g, "");

    // Execute in sandboxed Function scope
    const runner = new Function(executableJs);
    runner();
  } catch (err: any) {
    success = false;
    const msg = err.message || String(err);
    logs.push(`[RUNTIME ERROR] ${msg}`);
  } finally {
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
    console.assert = originalAssert;
  }

  const durationMs = Math.round(performance.now() - startTime);
  const output = logs.length > 0 ? logs.join("\n") : "Execution finished with 0 output.";

  return {
    success,
    output,
    durationMs,
    isTest
  };
}

function formatArg(arg: any): string {
  if (typeof arg === "object" && arg !== null) {
    try {
      return JSON.stringify(arg, null, 2);
    } catch {
      return String(arg);
    }
  }
  return String(arg);
}
