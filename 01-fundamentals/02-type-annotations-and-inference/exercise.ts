/**
 * EXERCISE 01.2: Type Annotations vs Inference
 * Run with: npx tsx 01-fundamentals/02-type-annotations-and-inference/exercise.ts
 */

// TASK 1: Refactor this overly verbose code
// Remove redundant annotations while keeping strict type safety.
// export const port: number = 8080;
// export const serverName: string = "api-gateway";
// export const isDebug: boolean = false;

// TASK 2: Add essential boundary types
// The following function currently allows implicit 'any' parameters.
// Add explicit parameter and return types for `calculateTax`.
export function calculateTax(subtotal: any, taxRate: any): any {
  // TODO: Fix signature and annotate parameters properly
  return subtotal * taxRate;
}

// TASK 3: Properly type an initially empty array
// Currently unannotated; make it strictly hold strings only.
export const eventLog: any = [];

function runTests() {
  console.log("Running Exercise 01.2 Tests...");
  const tax = calculateTax(100, 0.08);
  if (tax === 8) {
    console.log("[PASS] Exercise 01.2 Passed!");
  } else {
    console.error("[FAIL] Exercise 01.2 Failed!");
  }
}

// runTests();
