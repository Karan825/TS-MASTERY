/**
 * EXERCISE 07.1: Object Transformation Utilities Under the Hood
 * Run with: npx tsx 07-utility-types/01-object-transformation-utilities/exercise.ts
 */

// TASK 1: Implement `CustomPick<T, K>` without using built-in Pick
export type CustomPick<T, K extends keyof T> = any; // TODO: Implement

// TASK 2: Implement `CustomOmit<T, K>` without using built-in Omit
export type CustomOmit<T, K extends keyof any> = any; // TODO: Implement

// TASK 3: Implement `DeepPartial<T>`
// Makes every property and all nested objects optionally undefined.
export type DeepPartial<T> = any; // TODO: Implement

function runTests() {
  console.log("Run solution.ts for verification");
}

// runTests();
