/**
 * EXERCISE 02.2: Narrowing, Control-Flow Analysis & Type Predicates
 * Run with: npx tsx 02-type-system-deep-dive/02-narrowing-and-type-guards/exercise.ts
 */

// TASK 1: Implement `isRecord`
// Return true if `val` is a non-null object (and not an array).
// Use type predicate: `val is Record<string, unknown>`.
export function isRecord(val: unknown): val is Record<string, unknown> {
  // TODO: Implement
  throw new Error("Not implemented");
}

// TASK 2: Implement `assertPositiveInteger`
// Assertion function that asserts `val` is a finite positive integer (> 0).
// If invalid, throws an Error.
export function assertPositiveInteger(val: unknown): asserts val is number {
  // TODO: Implement
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 02.2 Tests...");
  if (
    isRecord({ a: 1 }) === true &&
    isRecord(null) === false &&
    isRecord([1, 2, 3]) === false &&
    isRecord("str") === false
  ) {
    console.log("[PASS] isRecord passed!");
  } else {
    console.error("[FAIL] isRecord failed!");
  }

  try {
    const val: unknown = 42;
    assertPositiveInteger(val);
    const result: number = val * 2; // Should compile and run
    console.log("[PASS] assertPositiveInteger passed!", result);
  } catch (err: any) {
    console.error("[FAIL] assertPositiveInteger failed:", err.message);
  }
}

// runTests();
