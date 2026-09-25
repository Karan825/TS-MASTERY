/**
 * Lesson 03.2: Function Overloads vs Unions vs Generics
 * Run with: npx tsx 03-functions/02-function-overloads/lesson.ts
 */

console.log("=== 1. Function Overloads in Production ===");

interface FormatOptions {
  locale: string;
  timeZone?: string;
}

// Overload 1: When options are provided, returns formatted string
export function formatTimestamp(date: Date, options: FormatOptions): string;
// Overload 2: When no options are provided, returns raw epoch milliseconds
export function formatTimestamp(date: Date): number;

// Implementation signature
export function formatTimestamp(date: Date, options?: FormatOptions): string | number {
  if (options) {
    return date.toLocaleDateString(options.locale, { timeZone: options.timeZone });
  }
  return date.getTime();
}

const now = new Date("2026-01-01T00:00:00Z");

// Inferred as number:
const epoch = formatTimestamp(now);
console.log("Epoch milliseconds:", epoch);

// Inferred as string:
const formatted = formatTimestamp(now, { locale: "en-US", timeZone: "UTC" });
console.log("Formatted string:", formatted);
