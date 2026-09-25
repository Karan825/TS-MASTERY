# Lesson 01.5: The Type Hierarchy: `any`, `unknown`, `never`, and `void`

## 1. What is it?
TypeScript organizes types into a formal lattice/hierarchy:
- **Top Types (`any`, `unknown`)**: The supertypes of everything. Every conceivable value in JavaScript can be assigned to a top type.
- **Bottom Type (`never`)**: The subtype of everything (the empty set $\emptyset$). No value can ever be assigned to `never` (except another `never`).
- **Absence Types (`void`, `undefined`, `null`)**: `void` signals that a function does not return a usable value.

---

## 2. Why does it exist?
In dynamic JavaScript, external data (from HTTP requests, `JSON.parse()`, message brokers) can be literally anything.
- If you use `any`, you turn off the compiler and forfeit all safety.
- If TypeScript lacked a type-safe top type (`unknown`), you would have no way to accept arbitrary input without losing compiler protection.
- If TypeScript lacked a bottom type (`never`), you could not perform exhaustive checks or model impossible states.

---

## 3. Mental Model: The Type Lattice
```
                    ┌─────────────────────────┐
                    │      unknown / any      │  <-- TOP TYPES (Everything fits in)
                    └────────────┬────────────┘
                                 │
             ┌───────────────────┼───────────────────┐
             │                   │                   │
      ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
      │   string    │     │   number    │     │   Object    │
      └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
             │                   │                   │
             └───────────────────┼───────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │          never          │  <-- BOTTOM TYPE (Nothing fits in)
                    └─────────────────────────┘
```

### The Difference Between `any` and `unknown`:
| Property | `any` | `unknown` |
| :--- | :--- | :--- |
| Can assign anything **to** it? | [PASS] Yes | [PASS] Yes |
| Can assign it **to other types**? | [PASS] Yes (Bypasses checks!) | [FAIL] No (Except `any` and `unknown`) |
| Can access properties (`val.prop`)? | [PASS] Yes (No compiler error!) | [FAIL] No (Compile-time error!) |
| Can call as a function (`val()`)? | [PASS] Yes | [FAIL] No |
| Forces runtime narrowing? | [FAIL] No | [PASS] Yes (Mandatory!) |

---

## 4. Syntax: The `assertNever` Exhaustiveness Check
```ts
function assertNever(value: never): never {
  throw new Error(`Unexpected value reached: ${JSON.stringify(value)}`);
}

type OrderStatus = "placed" | "shipped" | "delivered";

function handleOrder(status: OrderStatus) {
  switch (status) {
    case "placed": return "Processing order";
    case "shipped": return "Order is on the way";
    case "delivered": return "Order arrived";
    default:
      // If a new status (e.g. "cancelled") is added to OrderStatus later,
      // TypeScript will raise a compile-time error here because
      // "cancelled" cannot be assigned to 'never'!
      return assertNever(status);
  }
}
```

---

## 5. TypeScript vs JavaScript Comparison
In JavaScript, an unhandled status in a switch statement quietly falls through to `undefined`, causing bugs downstream. In TypeScript, combining `never` with exhaustive checking guarantees at compile time that **every single possible union case is handled**.

---

## 6. The "Why Not `any`?" Rule
Beginners often reach for `any` when:
1. They don't know what shape external data will have.  
   -> **Solution**: Use `unknown` + runtime type guards.
2. An API signature is complex.  
   -> **Solution**: Use generics (`<T>`) to preserve relationships.
3. They get a frustrating compiler error.  
   -> **Solution**: Narrow the type or refine the union.

---

## 7. Real-World Production Usage
Safe error handling in modern TypeScript:
```ts
try {
  executeRiskyOperation();
} catch (error: unknown) {
  // In modern TS (useUnknownInCatchVariables), error is 'unknown', NOT 'any'!
  if (error instanceof Error) {
    console.error("Standard error message:", error.message);
  } else {
    console.error("Non-standard error thrown:", String(error));
  }
}
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. A safe JSON parser that returns `unknown` and narrows it to a typed structure.
2. An exhaustive action dispatcher that utilizes `assertNever`.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
function formatUnknown(val: unknown): string {
  // [FAIL] TS Error: 'val' is of type 'unknown'.
  // return val.toString();
  return "";
}
```
**Diagnosis**: You cannot call methods on `unknown` without checking first. Even `.toString()` could fail if `val` is `null` or `undefined` (or an object created with `Object.create(null)`). You must narrow with `if (val !== null && val !== undefined)`.

---

## 10. Technical Interview Questions

### Question: What is the practical difference between `any`, `unknown`, and `never`?
- **Expected Answer**: `any` disables type checking, `unknown` is safe `any`, and `never` means impossible.
- **Strong Answer**:
  - `any` is an escape hatch that acts as both a top and bottom type simultaneously, disabling static analysis and allowing unsafe property accesses that infect downstream variables.
  - `unknown` is the type-safe top type. You can assign any value to it, but TypeScript forbids all operations on it until you narrow it down through control-flow analysis. It is the correct type for untrusted boundaries.
  - `never` is the bottom type representing the empty set. It represents values that can never occur (e.g. return types of functions that always throw, or unreachable branches). It is essential for exhaustive compile-time checking.

---

## 11. 5-Minute Active Recall
1. Why is `any` considered contagious?
2. Can you assign an `unknown` variable to a `string` variable without a type assertion or type guard?
3. How does `assertNever(x: never): never` guarantee exhaustiveness at compile time?

<details>
<summary>[RECALL] Check Answers</summary>

1. Any variable assigned the result of an operation on an `any` value also becomes `any`, spreading through your code.
2. No! `unknown` is assignable only to `unknown` and `any`.
3. If any union member is unhandled in a switch/if ladder, its remaining type is passed to `assertNever`. Since a concrete type cannot be assigned to `never`, the compiler fails with a type error.
</details>
