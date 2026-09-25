/**
 * EXERCISE 05.2: Multiple Type Parameters & Generic Inference
 * Run with: npx tsx 05-generics/02-multiple-type-parameters-and-inference/exercise.ts
 */

// TASK 1: Implement `pickFields`
// Accepts an object `target: T` and an array of keys `keys: K[]` where `K extends keyof T`.
// Returns a new object containing only the specified keys.
// The return type must be `Pick<T, K>`.
export function pickFields<T extends object, K extends keyof T>(
  target: T,
  keys: readonly K[]
): Pick<T, K> {
  // TODO: Implement
  throw new Error("Not implemented");
}

// TASK 2: Implement `mapDictionary`
// Accepts a Record `input: Record<K, VInput>` and a mapper `fn: (val: VInput, key: K) => VOutput`.
// Returns a new `Record<K, VOutput>` with transformed values.
export function mapDictionary<K extends string | number, VInput, VOutput>(
  input: Record<K, VInput>,
  fn: (val: VInput, key: K) => VOutput
): Record<K, VOutput> {
  // TODO: Implement
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 05.2 Tests...");
  const user = { id: "u_1", name: "Alice", email: "alice@test.com", age: 28 };
  const picked = pickFields(user, ["id", "name"] as const);

  if (picked.id === "u_1" && picked.name === "Alice" && !("email" in picked)) {
    console.log("[PASS] Task 1 Passed!");
  } else {
    console.error("[FAIL] Task 1 Failed!");
  }

  const counts = { apple: 2, banana: 5 };
  const formatted = mapDictionary(counts, (v, k) => `${k}: ${v * 2}`);
  if (formatted.apple === "apple: 4" && formatted.banana === "banana: 10") {
    console.log("[PASS] Task 2 Passed!");
  } else {
    console.error("[FAIL] Task 2 Failed!");
  }
}

// runTests();
