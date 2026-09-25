/**
 * EXERCISE 06.2: Mapped Types & Key Remapping
 * Run with: npx tsx 06-advanced-types/02-mapped-types-and-key-remapping/exercise.ts
 */

// TASK 1: Implement `DeepReadonly<T>`
// Recursively marks all properties (including nested objects and arrays) as readonly.
// Primitives and functions should remain untouched.
export type DeepReadonly<T> = any; // TODO: Implement recursive mapped type

// TASK 2: Implement `MethodsOnly<T>`
// Filters an object type `T` to only keep properties whose values are functions.
export type MethodsOnly<T> = any; // TODO: Implement using key remapping with 'as never'

function runTests() {
  console.log("Running Exercise 06.2 Tests...");
  interface Service {
    port: number;
    host: string;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
  }

  type ServiceMethods = MethodsOnly<Service>;
  // Should only have connect and disconnect!
  console.log("[PASS] Exercise 06.2 Checked!");
}

// runTests();
