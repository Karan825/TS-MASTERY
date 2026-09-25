/**
 * REFERENCE SOLUTION: Exercise 04.2
 * Declaration Merging & Index Signatures
 */

export interface InMemoryKV {
  namespace: string;
  [key: string]: string | undefined;
}

export function safeLookup(
  store: InMemoryKV,
  key: string,
  defaultValue: string
): string {
  const value = store[key];
  if (value !== undefined) {
    return value;
  }
  return defaultValue;
}

// Verification
const store: InMemoryKV = {
  namespace: "auth_tokens",
  token_1: "Bearer xyz",
};

console.assert(safeLookup(store, "token_1", "default") === "Bearer xyz");
console.assert(safeLookup(store, "missing", "default") === "default");
console.log("[PASS] Exercise 04.2 Solution Verified Successfully!");
