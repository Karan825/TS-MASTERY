/**
 * Lesson 06.3: Conditional Types, Distributivity & Infer
 * Run with: npx tsx 06-advanced-types/03-conditional-types-distributivity-infer/lesson.ts
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

console.log("=== 1. Distributive Union Filtering (Exclude) ===");

type MyExclude<T, U> = T extends U ? never : T;

type EventTypes = "click" | "hover" | "scroll" | "resize";
type MouseEvents = MyExclude<EventTypes, "scroll" | "resize">;
// MouseEvents is "click" | "hover"

console.log("Mouse events filtered successfully at compile time");

console.log("\n=== 2. Pattern Matching with infer ===");

// Extract resolved promise payload:
type AwaitedValue<T> = T extends Promise<infer Inner> ? AwaitedValue<Inner> : T;

type DeepPromise = Promise<Promise<string>>;
type Resolved = AwaitedValue<DeepPromise>; // string!

type _TestResolved = Expect<Equal<Resolved, string>>;

// Extract function return type:
type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never;

function createMetric() {
  return { id: "m_1", latencyMs: 120 };
}

type MetricOutput = GetReturn<typeof createMetric>;
type _TestMetric = Expect<Equal<MetricOutput, { id: string; latencyMs: number }>>;

console.log("All conditional type tests passed at compile-time!");
