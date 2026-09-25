/**
 * Lesson 01.5: any vs unknown vs never vs void
 * Run with: npx tsx 01-fundamentals/05-any-unknown-never-void/lesson.ts
 */

console.log("=== 1. Safe Boundary Parsing with unknown ===");

function safeJsonParse(jsonString: string): unknown {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

const rawData = '{"metric": "cpu_load", "value": 78.4}';
const parsed: unknown = safeJsonParse(rawData);

// Cannot do: parsed.metric (TS error: 'parsed' is of type 'unknown')

// Narrowing unknown safely:
if (
  typeof parsed === "object" &&
  parsed !== null &&
  "metric" in parsed &&
  "value" in parsed
) {
  const metricRecord = parsed as { metric: string; value: number };
  console.log(`Parsed metric: ${metricRecord.metric} = ${metricRecord.value}%`);
}

console.log("\n=== 2. Exhaustive Type Checking with never ===");

export type Priority = "low" | "medium" | "high";

export function getSlaHours(priority: Priority): number {
  switch (priority) {
    case "low":
      return 72;
    case "medium":
      return 24;
    case "high":
      return 4;
    default: {
      const _exhaustiveCheck: never = priority;
      throw new Error(`Unhandled priority: ${_exhaustiveCheck}`);
    }
  }
}

console.log("High SLA hours:", getSlaHours("high"));
