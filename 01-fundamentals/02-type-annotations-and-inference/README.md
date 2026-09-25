# Lesson 01.2: Type Annotations vs Type Inference

## 1. What is it?
- **Type Annotation**: Explicitly telling the compiler what type a variable, parameter, or return value has (e.g. `let count: number = 0;`).
- **Type Inference**: Allowing the TypeScript compiler to automatically deduce the type based on the assigned initial value or context (e.g. `let count = 0;` -> TS infers `number`).

---

## 2. Why does it exist?
If developers were forced to annotate every single local variable, TypeScript would be excruciatingly verbose, noisy, and unreadable. Modern TypeScript has a sophisticated bidirectional inference engine. Knowing when to annotate and when to trust inference is the hallmark of an experienced TypeScript engineer.

---

## 3. Mental Model: The Golden Rule of Annotations
```
┌────────────────────────────────────────────────────────┐
│  PUBLIC BOUNDARIES & CONTRACTS: Explicitly Annotate    │
│  (Function parameters, exported API returns, types)    │
├────────────────────────────────────────────────────────┤
│  INTERNAL IMPLEMENTATION DETAILS: Let TypeScript Infer │
│  (Local variables, chain results, map/filter returns)   │
└────────────────────────────────────────────────────────┘
```
**Why?**
If you annotate local variables unnecessarily (`const s: string = "hello"`), you add noise without adding safety. But if you fail to annotate function parameter types, TypeScript cannot infer them from nothing and falls back to `any` (triggering `--noImplicitAny` errors).

---

## 4. Syntax & Comparison
```ts
// [FAIL] Redundant / Beginner Noise:
const name: string = "Alice";
const scores: number[] = [10, 20, 30];

// [PASS] Professional / Idiomatic:
const name = "Alice"; // Inferred as 'string' (or literal "Alice" with const)
const scores = [10, 20, 30]; // Inferred as 'number[]'

// [PASS] Essential Annotations:
function calculateTotal(items: { price: number; tax: number }[]): number {
  return items.reduce((sum, item) => sum + item.price + item.tax, 0);
}
```

---

## 5. TypeScript vs JavaScript Comparison
In JavaScript, variable declarations have no type metadata. In TypeScript:
- `let x = "apple"` is inferred as `string` (because `let` allows future reassignment to any string).
- `const x = "apple"` is inferred as the literal type `"apple"` (because `x` can never change)!

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Unintentional 'any[]' via empty array initialization
const results = []; // Inferred as any[] in older TS or never[] in strict mode!
results.push("hello");
results.push(123); // Unsafe!

// [PASS] FIX: Always annotate empty collections:
const typedResults: string[] = [];
```

---

## 7. Real-World Production Usage
Contextual typing in event handlers and API callbacks:
```ts
// TypeScript knows 'event' is MouseEvent because of window.onclick signature!
window.onclick = (event) => {
  console.log(event.clientX, event.clientY); // Fully type-safe without manual annotation!
};
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and clean up noisy redundant annotations while adding critical missing boundary types.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
function parseData(jsonStr: string) {
  const data = JSON.parse(jsonStr);
  return data; // Why is the inferred return type dangerous in production?
}
```
**Diagnosis**: `JSON.parse` returns `any`. Without an explicit return annotation or schema validation, `any` silently infects every downstream caller, completely disabling type checking!

---

## 10. Technical Interview Questions

### Question: Should you always annotate the return type of a function?
- **Expected Answer**: It's good practice for clarity.
- **Strong Answer**: In production codebases, **exported public API functions** should almost always have explicit return types. This prevents accidental breaking changes if an implementation edit unintentionally shifts the return type, speeds up compiler performance (since TS doesn't have to evaluate deep function bodies to compute signatures), and provides clear documentation. However, for internal helper functions, inline callbacks, and simple one-liners, relying on inference reduces boilerplate and prevents duplicate type maintenance.

---

## 11. 5-Minute Active Recall
1. Why does `const x = 10` infer type `10` while `let x = 10` infers type `number`?
2. What type does `const items = []` infer in strict mode if unannotated?
3. What is "contextual typing"?

<details>
<summary>[RECALL] Check Answers</summary>

1. `const` creates an immutable binding, so TS narrows to the literal type `10`. `let` can be reassigned to any number, so TS widens to `number`.
2. It infers `never[]` (or `any[]`), preventing safe element additions.
3. When the type of an expression is inferred based on its location in the surrounding code (e.g. callback parameters).
</details>
