/**
 * EXERCISE 07.2: Union, Function & Promise Utility Types
 * Run with: npx tsx 07-utility-types/02-union-function-promise-utilities/exercise.ts
 */

// TASK 1: Implement `CustomReturnType<T>`
export type CustomReturnType<T extends (...args: any[]) => any> = any; // TODO: Implement

// TASK 2: Implement `CustomParameters<T>`
export type CustomParameters<T extends (...args: any[]) => any> = any; // TODO: Implement

// TASK 3: Implement `CustomAwaited<T>`
// Recursively unpacks thenable/Promise objects.
export type CustomAwaited<T> = any; // TODO: Implement

function runTests() {
  console.log("Run solution.ts for verification");
}

// runTests();
