/**
 * Lesson 07.1: Object Transformation Utilities Under the Hood
 * Run with: npx tsx 07-utility-types/01-object-transformation-utilities/lesson.ts
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

// Re-implementing the standard library:
export type MyPartial<T> = { [K in keyof T]?: T[K] };
export type MyRequired<T> = { [K in keyof T]-?: T[K] };
export type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
export type MyRecord<K extends keyof any, T> = { [P in K]: T };
export type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
export type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>;

interface UserEntity {
  id: string;
  username: string;
  email: string;
  age?: number;
}

// Verification via compile-time type assertions:
type _TestPartial = Expect<Equal<MyPartial<UserEntity>, Partial<UserEntity>>>;
type _TestRequired = Expect<Equal<MyRequired<UserEntity>, Required<UserEntity>>>;
type _TestReadonly = Expect<Equal<MyReadonly<UserEntity>, Readonly<UserEntity>>>;
type _TestPick = Expect<Equal<MyPick<UserEntity, "id" | "username">, Pick<UserEntity, "id" | "username">>>;
type _TestOmit = Expect<Equal<MyOmit<UserEntity, "email">, Omit<UserEntity, "email">>>;

console.log("All custom object utility types verified against TypeScript standard library!");
