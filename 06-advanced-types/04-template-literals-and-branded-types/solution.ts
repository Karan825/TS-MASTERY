/**
 * REFERENCE SOLUTION: Exercise 06.4
 * Template Literals & Branded Types
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

declare const BrandSymbol: unique symbol;
export type Brand<T, B extends string> = T & { readonly [BrandSymbol]: B };

// TASK 1 SOLUTION:
export type UsdCents = Brand<number, "UsdCents">;

// TASK 2 SOLUTION:
export function toUsdCents(val: number): UsdCents {
  if (!Number.isInteger(val) || val < 0) {
    throw new Error(`Invalid USD cents amount: ${val}. Must be a non-negative integer.`);
  }
  return val as UsdCents;
}

// TASK 3 SOLUTION:
export type ApiRoute = `/api/v${number}/${string}`;

// Verification
const validRoute: ApiRoute = "/api/v1/orders";
const validCents = toUsdCents(450);

console.assert(validCents === 450);
console.assert(validRoute === "/api/v1/orders");

// Compile-time test:
type _TestRoute = Expect<Equal<"/api/v2/items" extends ApiRoute ? true : false, true>>;
console.log("[PASS] Exercise 06.4 Solution Verified Successfully!");
