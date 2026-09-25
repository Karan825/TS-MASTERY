# Lesson 02.3: Discriminated Unions & Exhaustive Checking with `never`

## 1. What is it?
A **Discriminated Union** (also called a **Tagged Union** or **Algebraic Data Type**) is a union of object types where every member shares a common property (the "tag" or "discriminant") containing a distinct **literal type**.
When combined with TypeScript's Control-Flow Analysis, inspecting this single property automatically narrows the entire object to that specific variant!

---

## 2. Why does it exist?
In naive JavaScript/TypeScript modeling, developers often model state using optional booleans:
```ts
// [FAIL] THE ANTI-PATTERN: The "Bag of Optionals"
interface AsyncState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data?: User;
  error?: Error;
}
```
**Why this is dangerous**:
Nothing prevents a bug where `isLoading: true`, `isError: true`, AND `data: user` are all present at the same time! The UI doesn't know whether to show a spinner, an error dialog, or the user profile.

**The Solution**: Make invalid states unrepresentable!
```ts
// [PASS] DISCRIMINATED UNION: Impossible states cannot compile!
type AsyncState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User }
  | { status: "error"; error: Error };
```

---

## 3. Mental Model: The Passport Stamp
Think of the discriminant as a country stamp on a passport:
- Every variant is an object wearing a uniform tag: `{ status: "loading" }`, `{ status: "success" }`.
- When TypeScript inspects `state.status === "success"`, the compiler checks its catalog and says: *"Only variant 3 has status 'success'. Therefore, in this block, `state.data` is guaranteed to exist!"*

---

## 4. Syntax & The Exhaustive `never` Guard
```ts
type NetworkEvent =
  | { type: "CONNECT"; timestamp: number }
  | { type: "DISCONNECT"; reason: string }
  | { type: "PING" };

function assertNever(x: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(x)}`);
}

function processEvent(event: NetworkEvent): string {
  switch (event.type) {
    case "CONNECT":
      return `Connected at ${event.timestamp}`;
    case "DISCONNECT":
      return `Disconnected: ${event.reason}`;
    case "PING":
      return "Ping received";
    default:
      // If someone adds { type: "RECONNECT" } to NetworkEvent tomorrow,
      // TypeScript will refuse to compile this line!
      return assertNever(event);
  }
}
```

---

## 5. TypeScript vs JavaScript Comparison
In JavaScript, a `switch (event.type)` will silently fall through if a case is missing. In TypeScript with `assertNever(event)`, the compiler enforces compile-time completeness.

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Non-literal discriminant
interface ActionA { type: string; payload: number } // 'string' is NOT a discriminant!
interface ActionB { type: string; message: string }

function handle(a: ActionA | ActionB) {
  if (a.type === "A") {
    // [FAIL] TS cannot narrow here because both types have 'type: string'!
  }
}

// [PASS] FIX: Use string literal types:
interface SafeA { type: "ACTION_A"; payload: number }
interface SafeB { type: "ACTION_B"; message: string }
```

---

## 7. Real-World Production Usage
Redux reducers, React state hooks, Payment gateway state machines, AST interpreters:
```ts
export type HttpResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: string; readonly code: number };
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and model a resilient Payment State Machine with exhaustive compile-time checking.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "triangle"; base: number; height: number };

function getArea(s: Shape): number {
  if (s.kind === "circle") return Math.PI * s.radius ** 2;
  if (s.kind === "square") return s.size ** 2;
  // [FAIL] Compiler Error: Function lacks ending return statement and return type does not include 'undefined'.
}
```
**Diagnosis**: The function did not handle the `"triangle"` case. TypeScript's Control Flow Analysis detected that execution could fall off the end of the function, returning `undefined`.

---

## 10. Technical Interview Questions

### Question: What is a discriminated union, and why is it preferred over optional fields for modeling state?
- **Expected Answer**: It's a union of objects sharing a common tag. It prevents invalid state combinations.
- **Strong Answer**: A discriminated union pairs literal property tags with variant-specific payloads. In application architecture, modeling complex states with independent optional properties allows invalid combinations (such as an entity having both an `error` object and active `data` payload simultaneously). A discriminated union enforces mutual exclusivity at the type level: only the properties valid for a specific state variant are accessible when that state's discriminant matches. Furthermore, combined with a `never` fallback check, it gives developers compile-time exhaustiveness guarantees during refactors.

---

## 11. 5-Minute Active Recall
1. What three things are required for a type to be a Discriminated Union?
2. Why must the discriminant property be a literal type rather than `string` or `number`?
3. How does `const _exhaustive: never = val` detect missing switch cases at compile time?

<details>
<summary>[RECALL] Check Answers</summary>

1. A union type, object variants, and a shared common property containing distinct literal types.
2. If it is `string`, all variants share the identical broad type, preventing Control Flow Analysis from differentiating them.
3. If any case is unhandled, `val` holds the unhandled variant type, which is not assignable to `never`, causing a compiler type error.
</details>
