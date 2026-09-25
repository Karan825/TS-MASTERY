/**
 * EXERCISE 06.4: Template Literals & Branded Types
 * Run with: npx tsx 06-advanced-types/04-template-literals-and-branded-types/exercise.ts
 */

declare const BrandSymbol: unique symbol;
export type Brand<T, B extends string> = T & { readonly [BrandSymbol]: B };

// TASK 1: Define `UsdCents` branded type
// Must brand `number` with "UsdCents".
export type UsdCents = any; // TODO: Implement

// TASK 2: Implement smart constructor `toUsdCents(val: number): UsdCents`
// Rejects values that are not non-negative integers.
export function toUsdCents(val: number): UsdCents {
  // TODO: Implement
  throw new Error("Not implemented");
}

// TASK 3: Define `ApiRoute` template literal type
// Matches routes starting with "/api/v" followed by number, followed by "/" and any string.
// Example: "/api/v1/users", "/api/v2/products"
export type ApiRoute = any; // TODO: Implement

function runTests() {
  console.log("Running Exercise 06.4 Tests...");
  try {
    const cents = toUsdCents(1450);
    console.log("[PASS] Exercise 06.4 Passed! Cents:", cents);
  } catch (err: any) {
    console.error("[FAIL] Exercise 06.4 Failed:", err.message);
  }
}

// runTests();
