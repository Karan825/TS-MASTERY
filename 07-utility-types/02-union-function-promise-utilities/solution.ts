/**
 * REFERENCE SOLUTION: Exercise 07.2
 * Union, Function & Promise Utility Types
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

// TASK 1 SOLUTION:
export type CustomReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : never;

// TASK 2 SOLUTION:
export type CustomParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

// TASK 3 SOLUTION:
export type CustomAwaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
  ? F extends (value: infer V, ...args: infer _) => any
    ? CustomAwaited<V>
    : never
  : T;

// Verification
function sampleFn(id: string, count: number): boolean {
  return count > 0;
}

type _Test1 = Expect<Equal<CustomReturnType<typeof sampleFn>, boolean>>;
type _Test2 = Expect<Equal<CustomParameters<typeof sampleFn>, [id: string, count: number]>>;
type _Test3 = Expect<Equal<CustomAwaited<Promise<Promise<string>>>, string>>;

console.log("[PASS] Exercise 07.2 Solution Verified Successfully!");
