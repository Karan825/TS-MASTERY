/**
 * REFERENCE SOLUTION: Exercise 00.1
 * Primitives, References & Immutability
 */

// TASK 1 SOLUTION:
export function shallowCloneObject<T extends object>(input: T): T {
  // Using object spread creates a new object reference and copies enumerable own properties.
  return { ...input };
}

// TASK 2 SOLUTION:
export function immutableAppend<T>(array: readonly T[], item: T): T[] {
  // Array spread creates a new array without mutating the caller's array.
  // Note: array parameter is typed as `readonly T[]` to guarantee the function cannot call .push().
  return [...array, item];
}

// TASK 3 SOLUTION:
export const DATABASE_CONFIG = {
  host: "db.internal.cluster",
  port: 5432,
  credentials: {
    username: "app_admin",
    password: "super_secret_token",
  },
  pools: [10, 20, 30],
} as const;

// Type verification:
// DATABASE_CONFIG.credentials.password = "hacked"; // [FAIL] TS Error: Cannot assign to 'password' because it is a read-only property.

// ==========================================
// ARCHITECTURAL ANALYSIS & BETTER SOLUTIONS
// ==========================================
/**
 * 1. Why `readonly T[]` in parameter signatures?
 * By accepting `readonly T[]` instead of `T[]`, your function is more generic:
 * It can accept both mutable arrays and immutable arrays, while preventing internal mutations.
 * 
 * 2. Spread Operator vs structuredClone:
 * - Shallow spread (`{ ...obj }`) is extremely fast (O(N) where N is top-level keys).
 * - For deep immutability across nested state trees, modern Node/browsers provide `structuredClone(obj)`.
 * 
 * 3. The `as const` Assertion:
 * `as const` does two crucial things:
 * a. Narrowing: Types become literal "db.internal.cluster" rather than string, and 5432 rather than number.
 * b. Immutability: Recursively marks all properties and array indices as `readonly`.
 */

// Self-test execution:
export function verifySolution() {
  const original = { id: 1, name: "Alpha" };
  const clone = shallowCloneObject(original);
  console.assert(clone !== original, "Cloned reference must differ!");
  console.assert(clone.name === "Alpha", "Properties must match!");

  const list: readonly number[] = [1, 2, 3];
  const nextList = immutableAppend(list, 4);
  console.assert(nextList.length === 4 && list.length === 3, "Original must be untouched!");
  console.log("[PASS] All Exercise 00.1 solutions verified successfully!");
}

verifySolution();
