/**
 *  Final Assessment — Part 5 Solutions: 10 Advanced Type Challenges
 * Run with: npx tsx 25-final-assessment/answers-and-solutions/part5-solutions.ts
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

// CHALLENGE 1: DeepReadonly
export type DeepReadonly<T> = T extends Function | boolean | number | string | symbol | null | undefined
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : { readonly [K in keyof T]: DeepReadonly<T[K]> };

// CHALLENGE 2: DeepPartial
export type DeepPartial<T> = T extends Function | boolean | number | string | symbol | null | undefined
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : { [K in keyof T]?: DeepPartial<T[K]> };

// CHALLENGE 3: TupleToUnion
export type TupleToUnion<T extends readonly unknown[]> = T[number];

// CHALLENGE 4: PickByType
export type PickByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K];
};

// CHALLENGE 5: RequiredKeys
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

// CHALLENGE 6: OptionalKeys
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// CHALLENGE 7: Flatten
export type Flatten<T> = T extends (infer E)[] ? E : T;

// CHALLENGE 8: UnionToIntersection
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

// CHALLENGE 9: Brand
declare const BrandSym: unique symbol;
export type Brand<T, B extends string> = T & { readonly [BrandSym]: B };

// CHALLENGE 10: Head
export type Head<T extends readonly unknown[]> = T extends readonly [infer H, ...unknown[]]
  ? H
  : never;

// Compile-Time Verification Tests
type _T1 = Expect<Equal<TupleToUnion<["a", "b"]>, "a" | "b">>;
type _T2 = Expect<Equal<PickByType<{ a: string; b: number; c: string }, string>, { a: string; c: string }>>;
type _T3 = Expect<Equal<RequiredKeys<{ a: string; b?: number }>, "a">>;
type _T4 = Expect<Equal<OptionalKeys<{ a: string; b?: number }>, "b">>;
type _T5 = Expect<Equal<Head<[42, "string"]>, 42>>;
type _T6 = Expect<Equal<Head<[]>, never>>;

console.log("[PASS] Part 5 All 10 Advanced Type Challenges Verified Successfully!");
