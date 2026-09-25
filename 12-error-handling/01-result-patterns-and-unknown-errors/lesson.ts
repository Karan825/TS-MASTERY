/**
 * Lesson 12.1: Error Handling & Unknown Errors
 * Run with: npx tsx 12-error-handling/01-result-patterns-and-unknown-errors/lesson.ts
 */

console.log("=== 1. Safe Error Normalization ===");

function normalizeError(err: unknown): Error {
  if (err instanceof Error) {
    return err;
  }
  if (typeof err === "string") {
    return new Error(err);
  }
  return new Error(`Unknown non-standard error thrown: ${JSON.stringify(err)}`);
}

try {
  // Deliberately throwing a non-Error string
  throw "database connection dropped";
} catch (err: unknown) {
  const normalized = normalizeError(err);
  console.log("Normalized error message:", normalized.message);
}

console.log("\n=== 2. Custom Domain Error Subclass ===");

export class DatabaseTimeoutError extends Error {
  readonly code = "DB_TIMEOUT";

  constructor(public readonly query: string, public readonly timeoutMs: number) {
    super(`Query '${query}' timed out after ${timeoutMs}ms`);
  }
}

try {
  throw new DatabaseTimeoutError("SELECT * FROM users", 5000);
} catch (err: unknown) {
  if (err instanceof DatabaseTimeoutError) {
    console.log(`Caught DB Timeout! Code: ${err.code}, Query: ${err.query}`);
  }
}
