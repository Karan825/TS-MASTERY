/**
 * EXERCISE 00.1: Primitives, References & Immutability
 *
 * Instructions:
 * 1. Implement `shallowCloneObject`.
 * 2. Implement `immutableAppend`.
 * 3. Define the `ServerConfig` type with compile-time readonly safety.
 *
 * Run your code to test:
 * npx tsx 00-javascript-foundations/01-primitives-and-references/exercise.ts
 */

// TASK 1: Implement shallowCloneObject
// It must return a new object with top-level properties copied,
// without mutating the input object.
export function shallowCloneObject<T extends object>(input: T): T {
  // TODO: Replace with implementation
  throw new Error("Not implemented");
}

// TASK 2: Implement immutableAppend
// Given an array and an item, return a brand new array with the item added
// at the end, without calling .push() on the original array.
export function immutableAppend<T>(array: readonly T[], item: T): T[] {
  // TODO: Replace with implementation
  throw new Error("Not implemented");
}

// TASK 3: Define a deeply immutable configuration object using TypeScript's `as const`
// Define `DATABASE_CONFIG` so that assigning to `DATABASE_CONFIG.credentials.password`
// or `DATABASE_CONFIG.hosts` is rejected at compile time.
export const DATABASE_CONFIG = {
  // TODO: Create a config object with host, port, credentials: { username, password }
  // and ensure it is deeply typed as immutable.
};

// ==========================================
// TEST SUITE (Self-Verification)
// ==========================================
function runTests() {
  console.log("Running Exercise 00.1 Tests...");

  try {
    const original = { id: 1, name: "Alpha" };
    const clone = shallowCloneObject(original);
    if (clone === original) throw new Error("shallowCloneObject returned same reference!");
    if (clone.name !== "Alpha") throw new Error("Properties not copied correctly!");
    console.log("[PASS] Task 1 Passed: shallowCloneObject");
  } catch (err: any) {
    console.error("[FAIL] Task 1 Failed:", err.message);
  }

  try {
    const list: readonly number[] = [1, 2, 3];
    const nextList = immutableAppend(list, 4);
    if (nextList === (list as any)) throw new Error("immutableAppend returned same array reference!");
    if (nextList.length !== 4 || nextList[3] !== 4) throw new Error("Item not appended!");
    if (list.length !== 3) throw new Error("Original array was mutated!");
    console.log("[PASS] Task 2 Passed: immutableAppend");
  } catch (err: any) {
    console.error("[FAIL] Task 2 Failed:", err.message);
  }
}

// Uncomment to run verification when working on this exercise:
// runTests();
