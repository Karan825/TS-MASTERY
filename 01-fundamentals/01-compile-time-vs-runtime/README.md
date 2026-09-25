# Lesson 01.1: Compile-Time vs Runtime & Type Erasure

## 1. What is it?
TypeScript is a **statically typed syntactic superset of JavaScript**. It executes in two distinct phases:
1. **Compile-Time**: The TypeScript compiler (`tsc`) parses your code into an Abstract Syntax Tree (AST), performs type checking, validates assignability, and flags errors.
2. **Emit / Transpilation**: The compiler **strips away** all type annotations, interfaces, type aliases, and type assertions (a process called **Type Erasure**), outputting pure JavaScript.
3. **Runtime**: A JavaScript engine (V8 in Node.js/Chrome, JavaScriptCore in Safari) executes the emitted JavaScript. The JS engine has **zero knowledge** that TypeScript ever existed!

---

## 2. Why does it exist?
JavaScript is dynamically typed: types are associated with runtime values, not variable bindings. This causes entire classes of bugs (e.g. `undefined is not a function`, typoed property names, passing wrong arguments) to be discovered only when users trigger them in production.

TypeScript gives developers **feedback at author-time** while preserving 100% compatibility with any JavaScript runtime environment without requiring proprietary VMs.

---

## 3. Mental Model: The Phantom Blueprint
Imagine an architect drawing blueprints on tracing paper placed over a building plan:
- The blueprints specify: "This beam must support 500kg; that wall cannot be removed."
- Once the construction workers build the house, the tracing paper is **thrown away**.
- When a tenant walks into the house, only the physical bricks (JavaScript values) exist.
- **Critical takeaway**: You cannot inspect the tracing paper while walking inside the physical house. You cannot do `if (arg instanceof SomeInterface)` because `SomeInterface` was erased before the program ever started running!

---

## 4. Syntax: What Stays vs What Disappears
```ts
// COMPILE-TIME (Erased completely)
interface UserProfile {
  id: string;
  email: string;
}
type Role = "admin" | "member";

// RUNTIME (Preserved in JS output)
class AccountService {
  constructor(public readonly tenantId: string) {}

  validateEmail(email: string): boolean {
    return email.includes("@");
  }
}
```

---

## 5. TypeScript vs JavaScript Comparison
```ts
// Input TypeScript:
function calculateDiscount(price: number, isVip: boolean): number {
  return isVip ? price * 0.8 : price;
}

// Emitted JavaScript (Notice types completely erased):
function calculateDiscount(price, isVip) {
  return isVip ? price * 0.8 : price;
}
```

---

## 6. Common Mistakes
```ts
interface ApiResponse {
  data: string[];
}

function handleResponse(response: unknown) {
  // [FAIL] FATAL ERROR: 'ApiResponse' only refers to a type, but is being used as a value here.
  // if (response instanceof ApiResponse) { ... }

  // [PASS] CORRECT: Use runtime checks (typeof, property checks, or custom type guards):
  if (typeof response === "object" && response !== null && "data" in response) {
    console.log("Safe runtime property access");
  }
}
```

---

## 7. Real-World Production Usage
When fetching external data (from REST APIs, message queues, or user inputs), **TypeScript types provide zero runtime protection**. You must establish **Type Boundaries** using runtime validators (like Zod, Valibot, or manual type guards):

```ts
// Compile-time contract
export interface CustomerPayload {
  customerId: string;
  tier: "gold" | "silver" | "bronze";
}

// Runtime validator guarding the boundary
export function isCustomerPayload(data: unknown): data is CustomerPayload {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as any).customerId === "string" &&
    ["gold", "silver", "bronze"].includes((data as any).tier)
  );
}
```

---

## 8. Exercise

### Problem
Demonstrate the difference between compile-time types and runtime values:
1. Define a TypeScript interface `DatabaseRecord`.
2. Implement a runtime type guard `isDatabaseRecord(value: unknown): value is DatabaseRecord` that validates incoming raw JSON.
3. Show why `instanceof` fails on interfaces.

Open [exercise.ts](./exercise.ts).

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
type HttpMethod = "GET" | "POST" | "DELETE";

function logAllowedMethods() {
  // [FAIL] Compiler Error: 'HttpMethod' only refers to a type, but is being used as a value here.
  // console.log("Allowed methods:", HttpMethod.join(", "));
}
```
**Diagnosis**: `HttpMethod` is a type alias, erased during compilation. At runtime, `HttpMethod` does not exist as an array or object. To have a list of values at runtime, you must declare a runtime array (e.g. `const HTTP_METHODS = ["GET", "POST", "DELETE"] as const;`) and derive the type from it!

---

## 10. Technical Interview Questions

### Question: Can TypeScript types cause performance overhead at runtime?
- **Expected Answer**: No, types are erased during compilation.
- **Strong Answer**: Zero overhead. Because TypeScript uses type erasure, all interfaces, type annotations, and generic parameters are removed during the emit step. The generated JavaScript has no type-checking machinery, meaning memory consumption and CPU execution speeds are identical to hand-written JavaScript. (The only exception is TypeScript-specific language features that emit runtime JS, such as `enum` and class parameter properties).
- **Follow-up**: *If TypeScript compiles with no errors, is it guaranteed that our application won't throw a TypeError at runtime?*  
  *Answer*: No! TypeScript is intentionally not sound. Runtime `TypeError`s can still happen due to:
  1. Untrusted external data (`fetch()`, `JSON.parse()`).
  2. Type assertions (`as SomeType`).
  3. The `any` escape hatch.
  4. Out-of-bounds array access (without `noUncheckedIndexedAccess`).

---

## 11. 5-Minute Active Recall
1. What does the term "Type Erasure" mean?
2. Why can't you use `instanceof` with a TypeScript interface?
3. Which two TypeScript features actually emit JavaScript code rather than being erased?

<details>
<summary>[RECALL] Check Answers</summary>

1. All type annotations, interfaces, and type aliases are completely removed by `tsc` when outputting JavaScript.
2. `instanceof` checks the prototype chain of runtime constructor functions. Interfaces do not exist at runtime.
3. TypeScript `enum`s and `class` declarations with parameter properties.
</details>
