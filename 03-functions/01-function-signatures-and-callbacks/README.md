# Lesson 03.1: Function Signatures, Rest Tuples & Higher-Order Functions

## 1. What is it?
In TypeScript, functions are first-class values. You can type them using:
1. **Arrow type syntax**: `(arg: string) => number`
2. **Callable interface syntax**: `{ (arg: string): number; metadata: string }` (useful for callable objects or functions with properties!)
3. **Tuple-backed rest parameters**: `(...args: [id: string, count?: number]) => void`

---

## 2. Why does it exist?
JavaScript functions can accept variable arguments, be passed as callbacks, or be decorated with extra properties (e.g. `express` middlewares, `jest.fn()`).
TypeScript allows precise specification of:
- Required vs optional parameters (optional parameters must always come *after* required parameters).
- Default values (which automatically make parameters optional in caller invocations).
- Strongly typed rest parameters that enforce tuple structures.

---

## 3. Mental Model: Call Signatures & Callable Objects
In JavaScript, a function is simply an `Object` with a hidden `[[Call]]` internal method.
```ts
// A function that also has properties attached to it:
interface RateLimitedExecutor {
  (command: string): Promise<void>; // Call signature
  readonly rateLimit: number;       // Property on the function object!
  resetLimit(): void;               // Method on the function object!
}
```

---

## 4. Syntax
```ts
// 1. Standard Function Type
type Middleware<TContext> = (ctx: TContext, next: () => Promise<void>) => Promise<void>;

// 2. Rest Parameters backed by Tuples
type LogArgs = [level: "info" | "warn" | "error", message: string, ...details: unknown[]];

function logMessage(...[level, message, ...details]: LogArgs) {
  console.log(`[${level.toUpperCase()}] ${message}`, ...details);
}

// 3. Void Return in Callbacks: Special Behavior
// In TS, a callback typed as returning 'void' allows the implementation to return any value,
// but callers are told to ignore the return value.
type ClickCallback = () => void;
const cb: ClickCallback = () => 42; // Allowed! JS functions return values even when unused.
```

---

## 5. TypeScript vs JavaScript Comparison
In JavaScript, omitting an argument passes `undefined` silently. In TypeScript:
- If a parameter is not marked `?` or given a default value `= val`, the compiler rejects the call if omitted.
- Optional parameters can be safely undefined, prompting the developer to handle both cases.

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Optional parameter preceding required parameter
// function fetchItem(page?: number, id: string) {} // Syntax error in both JS and TS!

// [PASS] FIX: Required parameters first, optional parameters last:
function fetchItem(id: string, page: number = 1) {}
```

---

## 7. Real-World Production Usage
Express-style middleware pipeline composition:
```ts
export function composeMiddlewares<T>(
  middlewares: ((ctx: T, next: () => Promise<void>) => Promise<void>)[]
): (ctx: T) => Promise<void> {
  return async (ctx: T) => {
    let index = -1;
    async function dispatch(i: number): Promise<void> {
      if (i <= index) throw new Error("next() called multiple times");
      index = i;
      const fn = middlewares[i];
      if (!fn) return;
      await fn(ctx, () => dispatch(i + 1));
    }
    await dispatch(0);
  };
}
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement a typed middleware pipeline runner.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
interface CallbackHolder {
  onClick: () => void;
}

const holder: CallbackHolder = {
  onClick: () => {
    return "completed"; // Why does TypeScript allow returning a string when 'void' was expected?
  },
};
```
**Diagnosis**: In TypeScript, a function type returning `void` means *"the caller will not consume the return value"*, NOT *"the function must return undefined"*. This allows passing methods like `Array.prototype.push()` (which returns a number) into `forEach` (which expects `() => void`) without compiler complaints.

---

## 10. Technical Interview Questions

### Question: Why does TypeScript permit a function returning a non-void value to be assigned to a type returning `void`?
- **Expected Answer**: To make array callbacks like `forEach` work with methods that return numbers.
- **Strong Answer**: In JavaScript idioms, functions often return values that callers choose to ignore (for instance, `Array.prototype.push` returns the new array length). If TypeScript enforced that `() => void` strictly prohibited returning anything other than `undefined`, expressions like `[1, 2].forEach(x => set.add(x))` would be rejected because `Set.prototype.add` returns the `Set` instance. TypeScript intentionally distinguishes between `void` return types in **declarations** (which enforce no return) and `void` in **callback types** (which represent an ignored return value).

---

## 11. 5-Minute Active Recall
1. Where must optional parameters be positioned in a parameter list?
2. How do you type a function that also has a custom property attached to it?
3. What is the difference between `() => void` and `() => undefined`?

<details>
<summary>[RECALL] Check Answers</summary>

1. At the end, after all required parameters.
2. Using an object/interface type with a call signature `{ (arg: string): number; prop: string }`.
3. `() => void` ignores the return value; `() => undefined` strictly forces the function to return `undefined`.
</details>
