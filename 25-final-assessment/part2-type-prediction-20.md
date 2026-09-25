# Final Assessment — Part 2: Type Prediction (20 Problems)

> **Instructions**: Predict the resulting type for each expression without using IDE tooltips or compiling. Write down your prediction, then check [`answers-and-solutions/part2-answers.md`](./answers-and-solutions/part2-answers.md).

---

### Problem 1
```ts
type T1 = string | (number & string);
```
**Prediction**: `type T1 = ???`

---

### Problem 2
```ts
const tuple = ["GET", "POST"] as const;
type T2 = (typeof tuple)[number];
```
**Prediction**: `type T2 = ???`

---

### Problem 3
```ts
interface Box<T> { value: T }
type T3 = Box<string> extends Box<infer U> ? U : never;
```
**Prediction**: `type T3 = ???`

---

### Problem 4
```ts
type T4 = Exclude<"a" | "b" | "c", "a" | "d">;
```
**Prediction**: `type T4 = ???`

---

### Problem 5
```ts
type T5 = Extract<string | number | boolean, number | symbol>;
```
**Prediction**: `type T5 = ???`

---

### Problem 6
```ts
type T6 = NonNullable<string | number | null | undefined>;
```
**Prediction**: `type T6 = ???`

---

### Problem 7
```ts
type IsNever<T> = T extends never ? true : false;
type T7 = IsNever<never>;
```
**Prediction**: `type T7 = ???`

---

### Problem 8
```ts
type IsNeverFixed<T> = [T] extends [never] ? true : false;
type T8 = IsNeverFixed<never>;
```
**Prediction**: `type T8 = ???`

---

### Problem 9
```ts
type User = { id: string; age?: number };
type RequiredUser = { [K in keyof User]-?: User[K] };
type T9 = RequiredUser["age"];
```
**Prediction**: `type T9 = ???`

---

### Problem 10
```ts
type PrefixKeys<T> = {
  [K in keyof T as `user_${string & K}`]: T[K];
};
type T10 = keyof PrefixKeys<{ id: string; name: string }>;
```
**Prediction**: `type T10 = ???`

---

### Problem 11
```ts
type FilterMethods<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};
interface Demo { id: string; run(): void; stop(): boolean }
type T11 = keyof FilterMethods<Demo>;
```
**Prediction**: `type T11 = ???`

---

### Problem 12
```ts
type First<T extends readonly unknown[]> = T extends readonly [infer F, ...unknown[]] ? F : never;
type T12 = First<[10, "hello", boolean]>;
```
**Prediction**: `type T12 = ???`

---

### Problem 13
```ts
type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer Rest] ? Rest : [];
type T13 = Tail<[string, number, boolean]>;
```
**Prediction**: `type T13 = ???`

---

### Problem 14
```ts
type Flatten<T> = T extends (infer E)[] ? E : T;
type T14 = Flatten<string[][]>;
```
**Prediction**: `type T14 = ???`

---

### Problem 15
```ts
type EventType = `${"click" | "hover"}_${"event"}`;
type T15 = EventType;
```
**Prediction**: `type T15 = ???`

---

### Problem 16
```ts
type A = { x: number };
type B = { y: string };
type T16 = (A | B)[];
// What happens if you do: const list: T16 = [{ x: 1, y: "two" }];?
```
**Prediction**: `Is it valid or a compile error?`

---

### Problem 17
```ts
type FnA = (arg: string | number) => void;
type FnB = (arg: string) => void;
// Under --strictFunctionTypes:
// Can you assign FnA to FnB?
// Can you assign FnB to FnA?
```
**Prediction**: `Which assignment is valid?`

---

### Problem 18
```ts
type DeepPromise = Promise<Promise<Promise<number>>>;
type T18 = Awaited<DeepPromise>;
```
**Prediction**: `type T18 = ???`

---

### Problem 19
```ts
type Lookup = { a: 1; b: 2; c: 3 };
type T19 = Lookup[keyof Lookup];
```
**Prediction**: `type T19 = ???`

---

### Problem 20
```ts
type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
type T20 = UnionToIntersection<{ a: 1 } | { b: 2 }>;
```
**Prediction**: `type T20 = ???`

---
*Check your answers in [`answers-and-solutions/part2-answers.md`](./answers-and-solutions/part2-answers.md).*
