# Lesson 07.2: Union, Function & Promise Utility Types — Under the Hood

## 1. What is it?
This lesson breaks down and re-implements the standard library utilities for unions, functions, constructors, and promises:
- Union utilities: `Exclude`, `Extract`, `NonNullable`
- Function utilities: `Parameters`, `ReturnType`, `ThisParameterType`, `OmitThisParameter`
- Constructor utilities: `ConstructorParameters`, `InstanceType`
- Promise utilities: `Awaited`

---

## 2. Why does it exist?
Modern TypeScript architectures rely heavily on inferring types directly from existing functions, third-party libraries, and async operations without writing manual glue types.
Understanding how these utilities work gives you total mastery over TypeScript's `infer` and conditional type engine.

---

## 3. Re-implementing Every Utility From Scratch

### 1. `Exclude<T, U>` & `Extract<T, U>`
```ts
// Exclude: remove types in U from T
type MyExclude<T, U> = T extends U ? never : T;

// Extract: keep only types in U that exist in T
type MyExtract<T, U> = T extends U ? T : never;
```

### 2. `NonNullable<T>`
```ts
type MyNonNullable<T> = T extends null | undefined ? never : T;
```

### 3. `Parameters<T>` & `ReturnType<T>`
```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any
  ? P
  : never;

type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R
  ? R
  : never;
```

### 4. `ConstructorParameters<T>` & `InstanceType<T>`
```ts
type MyConstructorParameters<T extends abstract new (...args: any[]) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;

type MyInstanceType<T extends abstract new (...args: any[]) => any> =
  T extends abstract new (...args: any[]) => infer R ? R : any;
```

### 5. `Awaited<T>` (Recursive Promise Unwrapping)
```ts
type MyAwaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
  ? F extends (value: infer V, ...args: infer _) => any
    ? MyAwaited<V>
    : never
  : T;
```

---

## 4. Common Mistakes
```ts
// [FAIL] MISTAKE: Passing non-function to ReturnType:
// type Bad = ReturnType<string>; // [FAIL] TS Error: Type 'string' does not satisfy constraint '(...args: any[]) => any'.
```

---

## 5. Exercise
Open [exercise.ts](./exercise.ts) and verify all custom implementations against standard library assertions.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 6. Technical Interview Questions

### Question: How does `Awaited<T>` handle deeply nested promises like `Promise<Promise<number>>`?
- **Expected Answer**: It unwraps promises recursively.
- **Strong Answer**: `Awaited<T>` uses a recursive conditional type. It checks whether `T` is a "thenable" (an object with a `.then()` method). If so, it uses `infer` to extract the `value` parameter passed to the `onfulfilled` callback. It then recursively calls `Awaited<Value>` on that unwrapped type until a non-thenable type is reached. This mirrors the runtime behavior of JavaScript's `await` operator, which recursively unwraps nested Promise resolutions until a concrete value is produced.

---

## 7. 5-Minute Active Recall
1. What does `Extract<"a" | "b" | 1, string>` evaluate to?
2. What does `Parameters<typeof fn>` return?
3. What is the constraint on `T` in `ConstructorParameters<T>`?

<details>
<summary>[RECALL] Check Answers</summary>

1. `"a" | "b"`.
2. A tuple type representing the parameters of `fn`.
3. `abstract new (...args: any[]) => any`.
</details>
