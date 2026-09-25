/**
 * Lesson 04.2: Declaration Merging & Index Signatures
 * Run with: npx tsx 04-interfaces-and-types/02-declaration-merging-and-index-signatures/lesson.ts
 */

console.log("=== 1. Declaration Merging ===");

interface ServerMetrics {
  requestsPerSecond: number;
}

// In another part of the codebase (or plugin):
interface ServerMetrics {
  activeConnections: number;
}

const metrics: ServerMetrics = {
  requestsPerSecond: 1250,
  activeConnections: 84,
};

console.log("Merged metrics:", metrics);

console.log("\n=== 2. Index Signatures with noUncheckedIndexedAccess ===");

interface CacheBucket {
  readonly bucketName: string;
  readonly [key: string]: string | number | undefined;
}

const cache: CacheBucket = {
  bucketName: "sessions",
  user_1: "token_abc",
  user_2: 4500,
};

// Accessing dynamic key:
const session = cache["user_1"];
console.log("Session lookup:", session);

const missing = cache["nonexistent_key"];
console.log("Missing key lookup:", missing); // In strict mode, typed as 'string | number | undefined'
