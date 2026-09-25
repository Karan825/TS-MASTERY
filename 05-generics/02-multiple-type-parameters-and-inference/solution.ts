/**
 * REFERENCE SOLUTION: Exercise 05.2
 * Multiple Type Parameters & Generic Inference
 */

export function pickFields<T extends object, K extends keyof T>(
  target: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in target) {
      result[key] = target[key];
    }
  }
  return result;
}

export function mapDictionary<K extends string | number, VInput, VOutput>(
  input: Record<K, VInput>,
  fn: (val: VInput, key: K) => VOutput
): Record<K, VOutput> {
  const result = {} as Record<K, VOutput>;
  for (const key of Object.keys(input) as (keyof typeof input)[]) {
    result[key] = fn(input[key], key);
  }
  return result;
}

// Verification
const user = { id: "u_1", name: "Alice", email: "alice@test.com", age: 28 };
const picked = pickFields(user, ["id", "name"] as const);
console.assert(picked.id === "u_1");
console.assert(picked.name === "Alice");
console.assert(!("email" in picked));

const counts = { apple: 2, banana: 5 };
const formatted = mapDictionary(counts, (v, k) => `${k}: ${v * 2}`);
console.assert(formatted.apple === "apple: 4");
console.assert(formatted.banana === "banana: 10");
console.log("[PASS] Exercise 05.2 Solution Verified Successfully!");
