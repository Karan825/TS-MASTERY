/**
 * EXERCISE 01.3: Primitives, Arrays & Tuples
 * Run with: npx tsx 01-fundamentals/03-primitives-arrays-tuples/exercise.ts
 */

// TASK 1: Define a labeled readonly tuple type `GeoPoint`
// Contains: latitude (number), longitude (number), altitude (optional number)
// Must be immutable so pushing or altering coordinates is disallowed at compile-time.
export type GeoPoint = any; // TODO: Replace 'any' with correct tuple definition

// TASK 2: Implement parseCsvRow
// Input: "karan,28,true"
// Output: Labeled tuple [name: string, age: number, isActive: boolean]
export type ParsedUserRow = readonly [name: string, age: number, isActive: boolean];

export function parseCsvRow(row: string): ParsedUserRow {
  // TODO: Split string, parse types, and return the typed tuple
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 01.3 Tests...");
  try {
    const row = parseCsvRow("alice,30,true");
    if (row[0] !== "alice" || row[1] !== 30 || row[2] !== true) {
      throw new Error("Parsed row mismatch");
    }
    console.log("[PASS] Exercise 01.3 Passed!");
  } catch (err: any) {
    console.error("[FAIL] Exercise 01.3 Failed:", err.message);
  }
}

// runTests();
