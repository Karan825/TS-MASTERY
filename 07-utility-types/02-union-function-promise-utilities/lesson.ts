/**
 * Lesson 07.2: Union, Function & Promise Utility Types
 * Run with: npx tsx 07-utility-types/02-union-function-promise-utilities/lesson.ts
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

// Re-implementing the standard library:
export type MyExclude<T, U> = T extends U ? never : T;
export type MyExtract<T, U> = T extends U ? T : never;
export type MyNonNullable<T> = T extends null | undefined ? never : T;
export type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;
export type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;

function computeTax(subtotal: number, rate: number): number {
  return subtotal * rate;
}

type TaxParams = MyParameters<typeof computeTax>; // [subtotal: number, rate: number]
type TaxReturn = MyReturnType<typeof computeTax>; // number

type _Test1 = Expect<Equal<TaxParams, [subtotal: number, rate: number]>>;
type _Test2 = Expect<Equal<TaxReturn, number>>;

console.log("All custom function utility types verified!");
