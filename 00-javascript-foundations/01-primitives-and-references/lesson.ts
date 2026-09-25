/**
 * Lesson 00.1: Primitives vs References & Mutability
 * Run with: npx tsx 00-javascript-foundations/01-primitives-and-references/lesson.ts
 */

console.log("=== 1. Primitive Values (Stack / Value Semantics) ===");

let primitiveA = "antigravity";
let primitiveB = primitiveA; // Copy of the string value

primitiveB = "changed";
console.log({ primitiveA, primitiveB });
// primitiveA remains "antigravity" because string primitives are copied by value

console.log("\n=== 2. Reference Values (Heap / Pointer Semantics) ===");

interface Session {
  id: string;
  metadata: {
    ip: string;
    attempts: number;
  };
}

const session1: Session = {
  id: "sess_100",
  metadata: {
    ip: "127.0.0.1",
    attempts: 1,
  },
};

// Shallow copy assignment (Pointer sharing!)
const session2 = session1;
session2.id = "sess_999";
console.log("session1.id after mutating session2.id:", session1.id);
// Output: "sess_999" -> Mutated the shared instance!

console.log("\n=== 3. TypeScript 'as const' vs JavaScript Runtime ===");

// 'as const' tells the TypeScript compiler:
// 1. Narrow all primitive fields to literal types (e.g. "production", not string)
// 2. Mark all object keys as 'readonly' recursively
const APP_CONFIG = {
  env: "production",
  endpoint: "https://api.domain.com/v1",
  timeoutMs: 5000,
  features: {
    enableAuditLog: true,
    maxRetries: 3,
  },
} as const;

// At compile time, the following line would cause TypeScript to emit an error:
// APP_CONFIG.timeoutMs = 10000; // TS2540: Cannot assign to 'timeoutMs' because it is a read-only property.

console.log("APP_CONFIG is type-safe at compile-time:", APP_CONFIG);

console.log("\n=== 4. Shallow Clone vs Deep Clone ===");

const original = {
  name: "Service A",
  tags: ["backend", "critical"],
};

// Shallow copy via object spread
const shallowCopy = { ...original };
shallowCopy.name = "Service B"; // Safe, modifies only shallowCopy's own property
shallowCopy.tags.push("mutated!"); // UNSAFE! Both point to the exact same Array reference!

console.log("original.tags after shallow mutation:", original.tags);
// Both show: ['backend', 'critical', 'mutated!']

// Modern deep cloning in JS/TS runtime: structuredClone()
const deepCopy = structuredClone(original);
deepCopy.tags.push("isolated");
console.log("original.tags after deepClone modification:", original.tags);
console.log("deepCopy.tags:", deepCopy.tags);
