// TypeScript Execution Engine (Server-backed + In-Browser Fallback)

export interface RunResult {
  success: boolean;
  output: string;
  durationMs: number;
  isTest?: boolean;
}

export async function executeTypeScript(code: string, isTest: boolean = false): Promise<RunResult> {
  const startTime = performance.now();

  // Try dev server API first (which runs tsx and provides authentic TypeScript compiler checks)
  try {
    const res = await fetch("/api/run-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, isTest })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: data.success,
        output: data.output || "Execution completed with no output.",
        durationMs: Math.round(performance.now() - startTime),
        isTest
      };
    }
  } catch (e) {
    // Server not available, proceed to client-side runner fallback
  }

  // Client-Side In-Browser Runner Fallback
  return runInBrowserSandbox(code, startTime, isTest);
}

function runInBrowserSandbox(tsCode: string, startTime: number, isTest: boolean): RunResult {
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
    // Strip TypeScript types for browser execution
    const jsCode = stripTypeScript(tsCode);
    // Execute inside safe function scope
    const runner = new Function(jsCode);
    runner();
  } catch (err: any) {
    success = false;
    logs.push(`[RUNTIME ERROR] ${err.message || String(err)}`);
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

// Lightweight TypeScript type stripper for client-side fallback
export function stripTypeScript(ts: string): string {
  let js = ts;

  // Remove type-only imports and exports: import type ...
  js = js.replace(/import\s+type\s+[^;]+;/g, "");
  js = js.replace(/export\s+type\s+[^;]+;/g, "");

  // Remove interfaces
  js = js.replace(/interface\s+[\w<>]+\s*(\s+extends\s+[\w<>,\s]+)?\s*\{[\s\S]*?\}/g, "");

  // Remove type aliases: type Foo = ...;
  js = js.replace(/type\s+[\w<>]+\s*=\s*[\s\S]*?;/g, "");

  // Remove 'as const' and type casts: as any, as string, etc.
  js = js.replace(/\s+as\s+[\w<>[\]|&]+/g, "");

  // Remove generic type arguments on functions: foo<T>(...)
  js = js.replace(/<[A-Za-z0-9_,\s]+>(?=\s*\()/g, "");

  // Remove parameter type annotations: (a: number, b: string = "x")
  js = js.replace(/(\w+)\s*:\s*[A-Za-z0-9_<>[\]|&\s]+/g, "$1");

  // Remove return type annotations: ): string { or ): void =>
  js = js.replace(/\)\s*:\s*[A-Za-z0-9_<>[\]|&\s]+(?=\s*(=>|\{))/g, ")");

  return js;
}
