/**
 * EXERCISE 04.2: Declaration Merging & Index Signatures
 * Run with: npx tsx 04-interfaces-and-types/02-declaration-merging-and-index-signatures/exercise.ts
 */

// TASK 1: Define `InMemoryKV` interface with Index Signature
// Must require a string property `namespace: string`,
// and allow arbitrary string keys with values of type `string | undefined`.
export interface InMemoryKV {
  // TODO: Add properties and index signature
}

// TASK 2: Implement `safeLookup`
// Accepts an `InMemoryKV` store and a `key: string`.
// If key is present and defined, return it; otherwise return a fallback defaultValue: string.
export function safeLookup(
  store: InMemoryKV,
  key: string,
  defaultValue: string
): string {
  // TODO: Implement safe access with undefined check
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 04.2 Tests...");
  const store: InMemoryKV = {
    namespace: "auth_tokens",
    token_1: "Bearer xyz",
  };

  try {
    const val1 = safeLookup(store, "token_1", "default");
    const val2 = safeLookup(store, "token_missing", "default");

    if (val1 === "Bearer xyz" && val2 === "default") {
      console.log("[PASS] Exercise 04.2 Passed!");
    } else {
      console.error("[FAIL] Exercise 04.2 Failed!");
    }
  } catch (err: any) {
    console.error("[FAIL] Exercise 04.2 Failed:", err.message);
  }
}

// runTests();
