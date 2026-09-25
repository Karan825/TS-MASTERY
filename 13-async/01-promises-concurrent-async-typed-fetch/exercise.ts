/**
 * EXERCISE 13.1: Async TypeScript & Concurrency
 * Run with: npx tsx 13-async/01-promises-concurrent-async-typed-fetch/exercise.ts
 */

export interface BatchSummary<T> {
  successful: T[];
  failedErrors: Error[];
}

// TASK: Implement `processBatchSettled`
// Runs an array of Promise factories `tasks: (() => Promise<T>)[]` using Promise.allSettled.
// Returns a BatchSummary separating fulfilled values from rejected errors.
export async function processBatchSettled<T>(
  tasks: (() => Promise<T>)[]
): Promise<BatchSummary<T>> {
  // TODO: Implement
  throw new Error("Not implemented");
}

async function runTests() {
  console.log("Running Exercise 13.1 Tests...");
  const tasks = [
    () => Promise.resolve("A"),
    () => Promise.reject(new Error("Failed B")),
    () => Promise.resolve("C"),
  ];

  try {
    const summary = await processBatchSettled(tasks);
    if (summary.successful.length === 2 && summary.failedErrors.length === 1) {
      console.log("[PASS] Exercise 13.1 Passed!");
    } else {
      console.error("[FAIL] Exercise 13.1 Failed!");
    }
  } catch (err: any) {
    console.error("[FAIL] Exercise 13.1 Failed:", err.message);
  }
}

// runTests();
