# Lesson 12.1: Production Error Handling & Untrusted External Data

## 1. What is it?
In production applications, failures are inevitable: network timeouts, invalid JSON, missing environment variables, or database constraints.
This lesson covers the modern TypeScript error handling architecture:
1. **The `unknown` Catch Variable**: Safely extracting error messages without unsafe casting.
2. **Domain-Specific Error Classes**: Subclassing `Error` with custom discriminant properties.
3. **The `Result<T, E>` Monad**: Converting un-typed runtime exceptions into strongly typed compile-time return values.

---

## 2. Why does it exist?
In JavaScript, any statement can throw literally anything:
```js
throw "Network failed";
throw 500;
throw null;
```
Because of this dynamic reality, modern TypeScript flags catch variables as `unknown` (under `"useUnknownInCatchVariables": true`).
If you write `catch (err) { console.log(err.message); }`, TypeScript raises a compile error because `err` might not be an `Error` object!

---

## 3. Mental Model: Safe Error Extraction
```
                     try { ... } catch (err: unknown)
                                      │
                         Is err instanceof Error?
                         ├── YES ──> err.message (Safe string!)
                         └── NO  ──> String(err) or fallback message
```

---

## 4. Syntax: Domain Error Hierarchy
```ts
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  readonly code = "NOT_FOUND";
  readonly statusCode = 404;
}

export class ValidationError extends AppError {
  readonly code = "VALIDATION_FAILED";
  readonly statusCode = 400;

  constructor(message: string, public readonly validationErrors: string[]) {
    super(message);
  }
}
```

---

## 5. Result Monad with Safe Async Wrapper
```ts
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
  mapError?: (err: unknown) => E
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { ok: true, value: data };
  } catch (err) {
    const formatted = mapError ? mapError(err) : (err as E);
    return { ok: false, error: formatted };
  }
}
```

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Unsafe catch cast
try { ... } catch (err) {
  const e = err as Error; // [FAIL] Dangerous! If a string was thrown, e.message is undefined!
}
```

---

## 7. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. `normalizeError(err: unknown): Error`.
2. Safe environment variable loader with typed errors.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 8. Technical Interview Questions

### Question: Why did TypeScript 4.4 change `catch (e)` from `any` to `unknown`, and how do you handle it cleanly?
- **Expected Answer**: To make sure you don't assume `e` is an Error. You check with `instanceof Error`.
- **Strong Answer**: In earlier versions of TypeScript, catch variables were typed as `any`, creating a subtle safety hazard where developers routinely accessed `e.message` or `e.stack` without checking. Because JavaScript allows throwing primitives (like strings, numbers, or null), this could lead to secondary runtime crashes inside the error-handling block itself. By changing catch variables to `unknown`, TypeScript forces developers to guard with `if (e instanceof Error)` or a helper utility, ensuring that error reporting is resilient against non-standard exceptions.

---

## 9. 5-Minute Active Recall
1. Can you throw a primitive number in JavaScript?
2. Why is `Object.setPrototypeOf(this, new.target.prototype)` needed when subclassing `Error` in older targets?
3. How do you check if an `unknown` error is an instance of a specific custom error class?

<details>
<summary>[RECALL] Check Answers</summary>

1. Yes, any value can be thrown.
2. To restore the prototype chain when transpiling classes down to ES5.
3. Using the `instanceof` operator: `if (err instanceof CustomError)`.
</details>
