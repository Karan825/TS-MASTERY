/**
 * EXERCISE 06.3: Conditional Types, Distributivity & Infer
 * Run with: npx tsx 06-advanced-types/03-conditional-types-distributivity-infer/exercise.ts
 */

// TASK 1: Implement `UnpackArray<T>`
// If T is an array or tuple, extract its element type.
// Otherwise, return T as is.
export type UnpackArray<T> = any; // TODO: Implement using conditional types and infer

// TASK 2: Implement `LastElement<T>`
// Given a tuple `T extends readonly unknown[]`, extract the type of its last element.
// If empty tuple, return never.
export type LastElement<T extends readonly unknown[]> = any; // TODO: Implement

// TASK 3: Implement `NonNullableValue<T>`
// Exclude `null` and `undefined` from type `T` using distributive conditional types.
export type NonNullableValue<T> = any; // TODO: Implement

function runTests() {
  console.log("Running Exercise 06.3 type verification...");
  console.log("Compile check in solution.ts");
}

// runTests();
