/**
 * REFERENCE SOLUTION: Exercise 02.2
 * Narrowing, Control-Flow Analysis & Type Predicates
 */

export function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export function assertPositiveInteger(val: unknown): asserts val is number {
  if (
    typeof val !== "number" ||
    !Number.isInteger(val) ||
    !Number.isFinite(val) ||
    val <= 0
  ) {
    throw new Error(`Expected positive integer, got ${val}`);
  }
}

// Verification
console.assert(isRecord({ a: 1 }) === true);
console.assert(isRecord(null) === false);
console.assert(isRecord([1, 2]) === false);

const testVal: unknown = 100;
assertPositiveInteger(testVal);
console.assert(testVal === 100);
console.log("[PASS] Exercise 02.2 Solution Verified Successfully!");
