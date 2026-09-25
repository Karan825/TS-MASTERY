# Lesson 02.2: Narrowing, Control-Flow Analysis & Type Predicates

## 1. What is it?
- **Type Narrowing**: The process of refining a broad type (like `string | number` or `unknown`) into a more specific, precise type within a conditional branch.
- **Control-Flow Analysis (CFA)**: The TypeScript compiler's internal graph analysis that traces variable assignments, conditional branches, loops, and return statements to determine the exact type of a variable at any given line of code.
- **Custom Type Predicates**: Functions that return `value is TargetType`, instructing the compiler to narrow a variable when the function returns `true`.
- **Assertion Functions**: Functions with return type `asserts value is TargetType`, which throw if the condition fails and narrow the variable for all lines following the call.

---

## 2. Why does it exist?
In JavaScript, functions routinely accept multiple types (e.g. `document.getElementById` returns `HTMLElement | null`). Without narrowing, you could never call methods specific to one type without compiler errors.
Type predicates bridge the gap between runtime JavaScript validation functions and TypeScript's compile-time type tracker.

---

## 3. Mental Model: The Funnel
Think of Control-Flow Analysis as a series of funnels:
```
               [ Input: string | number | null ]
                              │
               Is it !== null?
               ├─ NO  ──> [ Type: null ] (handled or returned)
               └─ YES ──> [ Type: string | number ]
                              │
               Is typeof === "string"?
               ├─ YES ──> [ Type: string ] (Can call .toUpperCase())
               └─ NO  ──> [ Type: number ] (Can call .toFixed())
```

---

## 4. Syntax: Built-in Guards vs Custom Predicates
```ts
// 1. Built-in: typeof
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input; // Narrowed to number!
  }
  return padding + input; // Narrowed to string!
}

// 2. Built-in: 'in' operator
interface Admin { roles: string[] }
interface Guest { guestId: string }

function handleUser(u: Admin | Guest) {
  if ("roles" in u) {
    console.log(u.roles.join(", ")); // Narrowed to Admin!
  } else {
    console.log(u.guestId); // Narrowed to Guest!
  }
}

// 3. Custom Type Predicate: value is TargetType
function isString(val: unknown): val is string {
  return typeof val === "string";
}

// 4. Assertion Function: asserts condition
function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    throw new Error(`Expected value to be defined, got ${val}`);
  }
}
```

---

## 5. TypeScript vs JavaScript Comparison
In JavaScript, a helper like `function isUser(u) { return u && u.id; }` only returns a boolean. In TypeScript, annotating it as `u is User` teaches the compiler's control-flow engine to automatically cast `u` to `User` in any `if (isUser(u))` block!

---

## 6. Common Mistakes: The `typeof null` Trap!
```ts
function process(val: object | null) {
  // [FAIL] FATAL MISTAKE:
  if (typeof val === "object") {
    // In JavaScript: typeof null === "object"!
    // val is STILL (object | null) here!
    // val.toString(); // Runtime crash if null!
  }

  // [PASS] CORRECT: Always guard against null explicitly:
  if (typeof val === "object" && val !== null) {
    // Now val is narrowed to object!
  }
}
```

---

## 7. Real-World Production Usage
Safe array filtering:
```ts
const items: (string | null | undefined)[] = ["a", null, "b", undefined, "c"];

// [FAIL] Naive filter does NOT narrow the array type:
// const bad = items.filter(x => x !== null); // Type is still (string | null | undefined)[]!

// [PASS] Type predicate filter narrows the return type to string[]:
function isNotNull<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}
const clean: string[] = items.filter(isNotNull);
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. `isRecord(val: unknown): val is Record<string, unknown>`.
2. `assertValidSession(session: unknown): asserts session is ActiveSession`.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
function getLength(input: string | number) {
  const isStr = typeof input === "string";
  if (isStr) {
    // In older TS versions, storing the boolean in a separate variable
    // lost narrowing! Why does TS 4.4+ now support aliased conditions?
    return input.length;
  }
  return input;
}
```
**Diagnosis**: TypeScript 4.4+ introduced Control Flow Analysis of Aliased Conditions for `const` variables that hold type guard results. If `isStr` were declared with `let`, TS cannot safely assume `isStr` didn't change before the `if` check, losing narrowing!

---

## 10. Technical Interview Questions

### Question: What is a custom type predicate, and what happens if the function returns `true` when the value is actually invalid?
- **Expected Answer**: It's a function returning `x is T`. If it lies, TypeScript will have wrong types.
- **Strong Answer**: A type predicate `x is T` is a compile-time contract between the developer and the compiler. The compiler blindly trusts that if the function returns `true`, `x` is safely typed as `T`. TypeScript cannot inspect the runtime logic inside the function body to verify that the check is mathematically sound. If your type predicate contains a logical bug and returns `true` for an invalid value, it introduces a **type-system hole**, leading to downstream `TypeError: Cannot read properties of undefined` crashes at runtime while the compiler reports zero errors.
- **Follow-up**: *What is the difference between `arg is T` and `asserts arg is T`?*  
  *Answer*: `arg is T` returns a boolean for use in `if/else` conditions. `asserts arg is T` returns `void` (or throws), narrowing the variable in the current lexical scope for all subsequent code following the assertion without requiring an `if` block.

---

## 11. 5-Minute Active Recall
1. Why does `typeof x === "object"` fail to rule out `null`?
2. What return type must an assertion function have?
3. How do you narrow an array of `(T | null)[]` to `T[]` using `.filter()`?

<details>
<summary>[RECALL] Check Answers</summary>

1. Because in JavaScript's original implementation, `typeof null` returns `"object"` (a historical bug preserved for web compatibility).
2. `asserts <parameter> is <Type>` or `asserts <parameter>`.
3. Pass a type predicate callback `(item: T | null): item is T => item !== null`.
</details>
