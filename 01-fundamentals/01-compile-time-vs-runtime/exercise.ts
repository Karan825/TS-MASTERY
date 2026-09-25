/**
 * EXERCISE 01.1: Compile-Time vs Runtime
 * Run with: npx tsx 01-fundamentals/01-compile-time-vs-runtime/exercise.ts
 */

export interface SystemUser {
  id: string;
  username: string;
  isActive: boolean;
}

// TASK: Implement `validateSystemUser`
// Because `SystemUser` is an interface erased at runtime, incoming `data`
// (e.g. from an API or JSON.parse) has type `unknown`.
// Write a custom type predicate that checks at runtime:
// 1. data is an object and not null
// 2. has 'id' property of type 'string'
// 3. has 'username' property of type 'string'
// 4. has 'isActive' property of type 'boolean'
export function validateSystemUser(data: unknown): data is SystemUser {
  // TODO: Implement runtime validation logic
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 01.1 Tests...");
  const valid = { id: "u_1", username: "karan", isActive: true };
  const invalid = { id: 123, username: null };

  if (validateSystemUser(valid) && !validateSystemUser(invalid)) {
    console.log("[PASS] Exercise 01.1 Passed!");
  } else {
    console.error("[FAIL] Exercise 01.1 Failed!");
  }
}

// runTests();
