/**
 * Type testing and assertion utilities for TypeScript Mastery course.
 * Used to verify type derivations at compile time.
 */

export type Expect<T extends true> = T;
export type ExpectFalse<T extends false> = T;

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false;

export type NotEqual<X, Y> = Equal<X, Y> extends true ? false : true;

export type IsAny<T> = 0 extends 1 & T ? true : false;
export type NotAny<T> = IsAny<T> extends true ? false : true;

export type IsNever<T> = [T] extends [never] ? true : false;
export type IsUnknown<T> = IsAny<T> extends true
  ? false
  : [unknown] extends [T]
  ? true
  : false;
