/**
 * EXERCISE 02.1: Structural Typing & Excess Property Checks
 * Run with: npx tsx 02-type-system-deep-dive/01-structural-typing-and-excess-properties/exercise.ts
 */

export interface StrictHeader {
  contentType: string;
  authorization: string;
}

// TASK 1: Implement `acceptHeader`
// Accepts an object satisfying `StrictHeader`.
// Return a string formatted as `${header.contentType} | ${header.authorization}`.
export function acceptHeader(header: StrictHeader): string {
  // TODO: Implement
  throw new Error("Not implemented");
}

// TASK 2: Define `OpenPayload`
// Define an interface `OpenPayload` that requires `id: string` and `type: string`,
// but explicitly allows arbitrary extra properties of unknown type without triggering excess property errors.
export interface OpenPayload {
  // TODO: Add properties and index signature
}

function runTests() {
  console.log("Running Exercise 02.1 Tests...");
  const full = {
    contentType: "application/json",
    authorization: "Bearer token",
    userAgent: "Antigravity/1.0",
  };

  // Passing reference with extra properties
  if (acceptHeader(full) === "application/json | Bearer token") {
    console.log("[PASS] Task 1 Passed!");
  } else {
    console.error("[FAIL] Task 1 Failed!");
  }
}

// runTests();
