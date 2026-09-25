/**
 * REFERENCE SOLUTION: Exercise 10.1
 * TSConfig Strict Flags
 */

export function safeArrayHead<T>(arr: readonly T[]): T | undefined {
  if (arr.length === 0) {
    return undefined;
  }
  return arr[0];
}

// Verification
const list = [10, 20, 30];
const empty: number[] = [];

console.assert(safeArrayHead(list) === 10);
console.assert(safeArrayHead(empty) === undefined);
console.log("[PASS] Exercise 10.1 Solution Verified Successfully!");
