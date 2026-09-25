/**
 * REFERENCE SOLUTION: Exercise 06.3
 * Conditional Types, Distributivity & Infer
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

// TASK 1 SOLUTION:
export type UnpackArray<T> = T extends (infer E)[]
  ? E
  : T extends readonly (infer E)[]
  ? E
  : T;

// TASK 2 SOLUTION:
export type LastElement<T extends readonly unknown[]> = T extends readonly [...unknown[], infer Last]
  ? Last
  : never;

// TASK 3 SOLUTION:
export type NonNullableValue<T> = T extends null | undefined ? never : T;

// Type-level Test Assertions:
type _Test1 = Expect<Equal<UnpackArray<string[]>, string>>;
type _Test2 = Expect<Equal<UnpackArray<number>, number>>;
type _Test3 = Expect<Equal<LastElement<[1, 2, "last"]>, "last">>;
type _Test4 = Expect<Equal<LastElement<[]>, never>>;
type _Test5 = Expect<Equal<NonNullableValue<string | null | undefined>, string>>;

console.log("[PASS] Exercise 06.3 Solution Verified Successfully via Compile-Time Type Assertions!");
