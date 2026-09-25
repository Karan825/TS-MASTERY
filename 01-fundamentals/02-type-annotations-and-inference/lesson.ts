/**
 * Lesson 01.2: Type Annotations vs Type Inference
 * Run with: npx tsx 01-fundamentals/02-type-annotations-and-inference/lesson.ts
 */

console.log("=== 1. Literal Inference with const vs Widening with let ===");

let count = 42; // Inferred as 'number'
const maxRetries = 3; // Inferred as literal '3'

console.log({ count, maxRetries });

console.log("\n=== 2. Contextual Inference ===");

const names = ["alice", "bob", "charlie"];

// 'name' is automatically inferred as 'string'
// 'index' is automatically inferred as 'number'
const uppercased = names.map((name, index) => `${index + 1}: ${name.toUpperCase()}`);

console.log("Contextually typed result:", uppercased);

console.log("\n=== 3. Boundary Typing ===");

interface MetricReport {
  timestamp: number;
  tags: string[];
}

// Public boundary function: explicitly annotate return type and parameter types
export function generateReport(tags: string[]): MetricReport {
  return {
    timestamp: Date.now(),
    tags, // Inferred correctly
  };
}

console.log("Generated report:", generateReport(["auth", "production"]));
