# Lesson 06.3: Conditional Types, Distributivity & The `infer` Keyword

## 1. What is it?
- **Conditional Type**: An `if/else` statement at the type level: `T extends U ? X : Y`. If `T` is assignable to `U`, the type resolves to `X`; otherwise `Y`.
- **Distributivity**: When a naked type parameter `T` is evaluated in a conditional type, a union `A | B` automatically splits and evaluates each member individually: `(A extends U ? ...) | (B extends U ? ...)`.
- **The `infer` Keyword**: A keyword used inside the `extends` clause of a conditional type to declare a temporary type variable that TypeScript pattern-matches and extracts from a complex type.

---

## 2. Why does it exist?
TypeScript programs often need to inspect, unwrap, or transform types dynamically:
- *"Given a function, what does it return?"*
- *"Given a `Promise<T>`, what is `T`?"*
- *"Given a union `'a' | 'b' | 'c'`, how do I filter out `'b'`?"*
Conditional types and `infer` provide the computational engine to solve all of these problems.

---

## 3. Mental Model: Pattern Matching with `infer`
Think of `infer` like regex capture groups `/(?<token>\w+)/`:
```
Target Type:       Promise<string>
Pattern:           Promise<infer R>
                        │
                        ▼ (TypeScript matches 'infer R' against 'string')
Extracted Type R:  string!
```

---

## 4. Syntax: Distributivity in Action

### The Built-in `Exclude<T, U>`:
```ts
type MyExclude<T, U> = T extends U ? never : T;

type Mixed = "a" | "b" | 1 | 2;
type StringsOnly = MyExclude<Mixed, number>;

// How TypeScript evaluates this under the hood:
// Step 1: Distributes across union:
//   ("a" extends number ? never : "a") |
//   ("b" extends number ? never : "b") |
//   (1   extends number ? never : 1)   |
//   (2   extends number ? never : 2)
// Step 2: Evaluates branches:
//   "a" | "b" | never | never
// Step 3: 'never' vanishes from unions:
//   "a" | "b"
```

### Preventing Distributivity with Square Brackets `[T]`:
If you want to check if the union *as a whole* extends something (without distributing):
```ts
// Naked: distributes
type IsStringNaked<T> = T extends string ? true : false;
type Test1 = IsStringNaked<string | number>; // true | false => boolean!

// Boxed: does NOT distribute!
type IsStringBoxed<T> = [T] extends [string] ? true : false;
type Test2 = IsStringBoxed<string | number>; // false! (The whole union is NOT string)
```

---

## 5. Pattern Matching with `infer`
```ts
// 1. Extract Return Type:
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 2. Extract Promise Inner Value (Awaited):
type UnwrapPromise<T> = T extends Promise<infer Inner> ? UnwrapPromise<Inner> : T;

// 3. Extract First Element of Tuple:
type Head<T extends readonly unknown[]> = T extends readonly [infer First, ...unknown[]]
  ? First
  : never;
```

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Using 'infer' outside of a conditional 'extends' clause:
// type Bad<T> = infer R; // Syntax Error! 'infer' is only allowed in 'extends' clauses!
```

---

## 7. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. `UnpackArray<T>`: Extracts element type from arrays or returns `T`.
2. `LastElement<T>`: Extracts the last element of a tuple.
3. `PromisifyMethods<T>`: Converts all methods of an interface to return Promises.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 8. Debugging Challenge
```ts
type IsNever<T> = T extends never ? true : false;
type Result = IsNever<never>; // What does Result evaluate to?
```
**Diagnosis**: Surprise! `Result` evaluates to `never`, NOT `true`! Why? Because `never` is an empty union. A distributive conditional type over an empty union runs 0 times, returning `never`! To check for `never`, you must box it: `type IsNever<T> = [T] extends [never] ? true : false;`.

---

## 9. Technical Interview Questions

### Question: What are distributive conditional types, and how do you disable distributivity?
- **Expected Answer**: When you pass a union to a generic conditional type, it checks each member separately. Wrap in brackets `[T]` to stop it.
- **Strong Answer**: When a conditional type acts on a naked (unwrapped) type parameter `T`, TypeScript automatically distributes the evaluation across every member of a union: `(A | B) extends U ? X : Y` becomes `(A extends U ? X : Y) | (B extends U ? X : Y)`. This behavior is what makes union filtering utilities like `Exclude` and `Extract` possible. To prevent distributivity—for instance, when checking if a type is literally `never` or when checking if an entire union satisfies a constraint—you wrap both sides of the `extends` keyword in single-element tuples: `[T] extends [U] ? X : Y`.

---

## 10. 5-Minute Active Recall
1. Why does `never` disappear from union types (`string | never`)?
2. How do you prevent a generic conditional type from distributing across a union?
3. Where can the `infer` keyword appear?

<details>
<summary>[RECALL] Check Answers</summary>

1. Because `never` is the empty set ($\emptyset$); the union of any set with the empty set is just the set itself.
2. By wrapping the type parameter and target type in square brackets: `[T] extends [U]`.
3. Only in the `extends` clause of a conditional type.
</details>
