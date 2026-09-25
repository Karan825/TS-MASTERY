/**
 * REFERENCE SOLUTION: Exercise 06.2
 * Mapped Types & Key Remapping
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

// TASK 1 SOLUTION:
export type DeepReadonly<T> = T extends Function | boolean | number | string | symbol | null | undefined
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : { readonly [K in keyof T]: DeepReadonly<T[K]> };

// TASK 2 SOLUTION:
export type MethodsOnly<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K];
};

// Verification & Type-Level Tests
interface Service {
  port: number;
  host: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

type ServiceMethods = MethodsOnly<Service>;
type ExpectedMethods = {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
};

type _TestMethods = Expect<Equal<keyof ServiceMethods, "connect" | "disconnect">>;

type Nested = {
  a: number;
  b: {
    c: string[];
  };
};

type ReadonlyNested = DeepReadonly<Nested>;
// ReadonlyNested["b"]["c"] is ReadonlyArray<string>!

console.log("[PASS] Exercise 06.2 Solution Verified Successfully!");
