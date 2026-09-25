/**
 * REFERENCE SOLUTION: Exercise 01.3
 * Primitives, Arrays & Tuples
 */

// TASK 1 SOLUTION:
export type GeoPoint = readonly [latitude: number, longitude: number, altitude?: number];

// TASK 2 SOLUTION:
export type ParsedUserRow = readonly [name: string, age: number, isActive: boolean];

export function parseCsvRow(row: string): ParsedUserRow {
  const parts = row.split(",");
  if (parts.length < 3) {
    throw new Error("Invalid CSV row: expected 3 comma-separated values");
  }

  const name = parts[0]!.trim();
  const age = Number(parts[1]!.trim());
  const isActive = parts[2]!.trim().toLowerCase() === "true";

  if (isNaN(age)) {
    throw new Error("Invalid age value: must be a number");
  }

  return [name, age, isActive] as const;
}

// Verification
const point: GeoPoint = [37.7749, -122.4194];
const row = parseCsvRow("alice,30,true");
console.assert(row[0] === "alice");
console.assert(row[1] === 30);
console.assert(row[2] === true);
console.log("[PASS] Exercise 01.3 Solution Verified Successfully!");
