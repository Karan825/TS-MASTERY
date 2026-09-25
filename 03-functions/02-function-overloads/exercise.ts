/**
 * EXERCISE 03.2: Function Overloads
 * Run with: npx tsx 03-functions/02-function-overloads/exercise.ts
 */

export interface QueryOptions {
  limit?: number;
  single?: boolean;
}

export interface UserRow {
  id: string;
  name: string;
}

// TASK: Implement overloaded `findUsers`
// Signature 1: When options.single is explicitly true, returns Promise<UserRow | null>
// Signature 2: When options.single is false or omitted, returns Promise<UserRow[]>
// Implementation: Simulate database lookup.
export function findUsers(query: string, options: { single: true }): Promise<UserRow | null>;
export function findUsers(query: string, options?: QueryOptions): Promise<UserRow[]>;
export function findUsers(
  query: string,
  options?: QueryOptions
): Promise<UserRow | null | UserRow[]> {
  // TODO: Implement logic matching the overload signatures
  throw new Error("Not implemented");
}

async function runTests() {
  console.log("Running Exercise 03.2 Tests...");
  try {
    const many = await findUsers("active", { limit: 10 });
    const single = await findUsers("active", { single: true });

    if (Array.isArray(many) && (single === null || "id" in (single as object))) {
      console.log("[PASS] Exercise 03.2 Passed!");
    } else {
      console.error("[FAIL] Exercise 03.2 Failed!");
    }
  } catch (err: any) {
    console.error("[FAIL] Exercise 03.2 Failed:", err.message);
  }
}

// runTests();
