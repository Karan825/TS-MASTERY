/**
 * Level 18: Code Reading & Type Prediction Challenges
 *
 * DO NOT hover with your mouse cursor!
 * Predict the resulting type of:
 * - Result1
 * - Result2
 * - Result3
 * - Result4
 * - Result5
 *
 * Then read explanations.md to check your answers!
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

// =========================================================================
// CHALLENGE 1: Union Flattening & Distributivity
// =========================================================================
type Mystery1<T> = T extends any ? (arg: T) => void : never;
type Input1 = "read" | "write";
export type Result1 = Mystery1<Input1>;
// PREDICT: What is Result1?

// =========================================================================
// CHALLENGE 2: Path Value Extractor
// =========================================================================
type NestedObj = {
  user: {
    address: {
      zip: number;
    };
  };
};

type DeepGet<T, P extends string> = P extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? DeepGet<T[Head], Tail>
    : never
  : P extends keyof T
  ? T[P]
  : never;

export type Result2 = DeepGet<NestedObj, "user.address.zip">;
// PREDICT: What is Result2?

// =========================================================================
// CHALLENGE 3: Function Inversion with Infer
// =========================================================================
type Transform<T> = T extends (...args: infer P) => infer R
  ? (...args: P) => Promise<R>
  : T;

function calculateScore(name: string, rawScore: number): boolean {
  return rawScore > 50;
}

export type Result3 = Transform<typeof calculateScore>;
// PREDICT: What is Result3?

// =========================================================================
// CHALLENGE 4: Non-Homomorphic Key Filtering
// =========================================================================
interface Schema {
  id: string;
  count: number;
  tags: string[];
  execute(): void;
  reset(): boolean;
}

type ExtractMethods<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

export type Result4 = ExtractMethods<Schema>;
// PREDICT: What is keyof Result4?

// =========================================================================
// CHALLENGE 5: Union to Intersection Trick
// =========================================================================
type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type Input5 = { a: string } | { b: number };
export type Result5 = UnionToIntersection<Input5>;
// PREDICT: What is Result5?

// Type check confirmation
type _Test2 = Expect<Equal<Result2, number>>;
type _Test5 = Expect<Equal<Result5, { a: string } & { b: number }>>;
