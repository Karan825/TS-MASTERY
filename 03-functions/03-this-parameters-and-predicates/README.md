# Lesson 03.3: `this` Parameters, Type Predicates & Typed Error Patterns

## 1. What is it?
This lesson covers three critical production function techniques:
1. **Explicit `this` Parameters**: Telling the compiler what `this` must be (or preventing `this` entirely via `this: void`).
2. **Type Predicates**: Functions that act as custom boolean filters for Control-Flow Analysis (`arg is T`).
3. **The Result Pattern for Typed Errors**: Representing success or failure as a discriminated union instead of throwing un-typed exceptions.

---

## 2. Why does it exist?
### Why Typed Errors Matter:
In TypeScript, **exceptions cannot be typed in function signatures**.
If you write `function loadUser(): User`, the compiler tells callers they will get a `User`. It cannot warn them that `loadUser` might throw `NetworkError` or `DatabaseTimeoutError`. The caller forgets to `try/catch`, and the app crashes in production.
The **Result Pattern** makes errors visible directly in the type signature: `function loadUser(): Result<User, NetworkError>`. The compiler now **forces** the caller to check `.ok` before accessing `.value`!

---

## 3. Mental Model: The Unsafe Throw vs The Sealed Result
```
THROWING:
   Caller expects:  User
   Runtime reality: Surprise bomb thrown over the fence! 💣💥

RESULT MONAD:
   Caller receives: Box { ok: true, value: User } OR { ok: false, error: Error }
   Compiler forces: "You cannot touch .value until you check if .ok is true!" 🔒
```

---

## 4. Syntax: The Result Pattern
```ts
export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// Consuming:
function safeDivide(a: number, b: number): Result<number, string> {
  if (b === 0) return err("Division by zero");
  return ok(a / b);
}

const res = safeDivide(10, 2);
if (res.ok) {
  console.log("Result:", res.value); // res.value is strictly available!
} else {
  console.error("Error:", res.error); // res.error is strictly available!
}
```

---

## 5. `this: void` To Prevent Context Leakage
```ts
// Enforces that this utility helper must never rely on 'this':
function standaloneMath(this: void, a: number, b: number): number {
  return a + b;
}
```

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Assuming TypeScript can type thrown errors:
// function parse(s: string): User throws ParseError {} // Syntax error! TS has no 'throws' clause!

// [FAIL] MISTAKE: Untyped catch block in JS:
try { ... } catch (e) {
  // e is 'unknown' in strict mode. Don't do: e.message without narrowing!
}
```

---

## 7. Real-World Production Usage
Enterprise domain services, financial engines, and compilers almost exclusively use Result types to ensure zero unhandled operational errors.

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement a safe, typesafe file/json reading pipeline using the Result pattern.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
function isApiError(err: unknown): err is { code: number; message: string } {
  return typeof err === "object" && "code" in err!; // [FAIL] What happens if err is null?
}
```
**Diagnosis**: In JavaScript, `"code" in null` throws a runtime `TypeError: Cannot use 'in' operator to search for 'code' in null`! The type predicate must first ensure `err !== null`.

---

## 10. Technical Interview Questions

### Question: Why doesn't TypeScript have checked exceptions (like Java's `throws Exception`), and how do production systems solve this?
- **Expected Answer**: JavaScript doesn't have checked exceptions. We use Result types.
- **Strong Answer**: Checked exceptions in languages like Java are notoriously difficult to evolve because changing an internal dependency breaks all intermediate call signatures. In JavaScript, anything can be thrown at runtime (strings, numbers, undefined, errors). Furthermore, Promises unwrap rejected errors asynchronously where exception tracking across microtask queues breaks down. Instead of adding complex checked exception machinery, modern TypeScript architectures use **Discriminated Union Result types** (`Result<T, E>`). This leverages TypeScript's existing structural typing and Control-Flow Analysis to provide 100% type-checked error paths without requiring language extensions.

---

## 11. 5-Minute Active Recall
1. Why can't TypeScript enforce that callers `catch` a specific error?
2. What is the type of `catch (err)` in strict TypeScript mode?
3. How does the `Result<T, E>` pattern force developers to handle errors?

<details>
<summary>[RECALL] Check Answers</summary>

1. Because TypeScript has no syntax or runtime support for `throws` clauses.
2. `unknown`.
3. Because `.value` only exists when `.ok === true`, Control Flow Analysis prevents accessing the value until the success check is completed.
</details>
