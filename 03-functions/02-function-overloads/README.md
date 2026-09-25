# Lesson 03.2: Function Overloads vs Unions vs Generics

## 1. What is it?
In TypeScript, **Function Overloads** allow a single function name to have multiple distinct type signatures.
An overloaded function consists of:
1. One or more **Overload Signatures** (which define the public API seen by callers).
2. Exactly one **Implementation Signature** (which contains the runtime code and is hidden from callers).

---

## 2. Why does it exist?
JavaScript functions often return completely different shapes based on the flags or arguments passed.
For example, Node.js's `fs.readFileSync(path, 'utf-8')` returns a `string`, but `fs.readFileSync(path)` returns a `Buffer`.
A simple union return type `string | Buffer` forces the caller to write type narrowing code every single time. Function overloads allow TypeScript to tell the caller: *"If you pass 'utf-8', I promise you get a string back!"*

---

## 3. Mental Model: The Velvet Rope & The Kitchen
```
                     PUBLIC CALLERS
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
   [ Overload 1: ]                   [ Overload 2: ]
   parse(val: string): Date          parse(val: number): string
         │                                 │
         └────────────────┬────────────────┘
                          ▼  (Velvet Rope: Callers only see these)
                          │
             [ Implementation Signature: ]
             parse(val: string | number): Date | string { ... }
             (The Kitchen: Internal logic handling all cases)
```
**Key Rule**: The implementation signature is invisible to the outside world. Callers can **only** call the function using one of the overload signatures!

---

## 4. Syntax
```ts
// Overload signature 1:
function getElement(selector: "canvas"): HTMLCanvasElement;
// Overload signature 2:
function getElement(selector: "input"): HTMLInputElement;
// Overload signature 3 (Fallback):
function getElement(selector: string): HTMLElement;

// Implementation signature (compatible with all overloads):
function getElement(selector: string): HTMLElement {
  return document.querySelector(selector) as HTMLElement;
}

// Call site:
const canvas = getElement("canvas"); // Inferred as HTMLCanvasElement!
const input = getElement("input");   // Inferred as HTMLInputElement!
```

---

## 5. TypeScript vs JavaScript Comparison
In JavaScript, there is no language feature called "overloading"—you simply check `arguments.length` or `typeof` manually at runtime. In TypeScript, overloads provide compile-time contract branching that is completely erased in the emitted JS.

---

## 6. Overloads vs Unions vs Generics Decision Matrix
| Requirement | Best Tool | Why |
| :--- | :--- | :--- |
| Parameters vary, but return type is always the same. | **Union Types** (`(a: string \| number) => void`) | Simpler, less boilerplate. |
| Return type depends directly on the argument type. | **Overloads** or **Generics** | Preserves input-to-output relationship. |
| Preserving literal types or arbitrary shapes through the call. | **Generics** (`<T>(val: T) => T`) | Dynamic type preservation without hardcoded signatures. |

---

## 7. Common Mistakes
```ts
// [FAIL] MISTAKE: Forgetting that implementation signature is not callable:
function greet(name: string): string;
function greet(age: number): string;
function greet(val: string | number | boolean): string { // 'boolean' is in implementation only!
  return String(val);
}

// greet(true); // [FAIL] TS Error: No overload matches this call!
// Even though the implementation accepts boolean, callers cannot use it!
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement an overloaded `formatTimestamp` utility that returns a formatted string when given an options object, or a raw epoch number when no options are provided.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
function len(x: any[]): number;
function len(x: string): number;
function len(x: any): number {
  return x.length;
}

// Why does passing `string | any[]` fail here?
function test(val: string | any[]) {
  // len(val); // [FAIL] TS Error: No overload matches this call!
}
```
**Diagnosis**: TypeScript resolves overloads one by one from top to bottom. It does not synthesize a union across overloads! When passed a union `string | any[]`, neither individual overload matches. To fix this, you should either add an overload for the union, or use a single union signature instead of overloads: `function len(x: string | any[]): number`.

---

## 10. Technical Interview Questions

### Question: When should you prefer a generic function over function overloads?
- **Expected Answer**: Use generics when the types can be anything, and overloads when you have fixed specific combinations.
- **Strong Answer**: Prefer generics when you want to preserve the relationship between input types and output types without specifying every combination ahead of time (e.g. `identity<T>(x: T): T` or `pick<T, K extends keyof T>(obj: T, key: K): T[K]`). Overloads should be used when the return type radically shifts structure or semantics based on specific discrete parameter configurations (such as returning a stream vs a buffer based on an options flag), or when conditional types in generics would produce overly complex and unreadable compiler errors for callers.

---

## 11. 5-Minute Active Recall
1. Can external callers invoke the implementation signature directly?
2. Why is `function fn(x: string | number): void` better than two overloads if both return `void`?
3. In what order does the TypeScript compiler evaluate overload signatures?

<details>
<summary>[RECALL] Check Answers</summary>

1. No, the implementation signature is hidden from the public API.
2. Because union types require zero repetition and can accept union values at the call site without errors.
3. Sequentially from top to bottom; the first matching signature is selected.
</details>
