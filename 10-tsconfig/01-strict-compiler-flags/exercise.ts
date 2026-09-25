/**
 * EXERCISE 10.1: TSConfig Strict Flags
 * Run with: npx tsx 10-tsconfig/01-strict-compiler-flags/exercise.ts
 */

// TASK: Implement `safeArrayHead`
// Returns the first item of an array, safely handling undefined and empty arrays,
// ensuring noUncheckedIndexedAccess does not cause type errors.
export function safeArrayHead<T>(arr: readonly T[]): T | undefined {
  // TODO: Implement
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 10.1 Tests...");
  const list = [10, 20, 30];
  const empty: number[] = [];

  if (safeArrayHead(list) === 10 && safeArrayHead(empty) === undefined) {
    console.log("[PASS] Exercise 10.1 Passed!");
  } else {
    console.error("[FAIL] Exercise 10.1 Failed!");
  }
}

// runTests();
