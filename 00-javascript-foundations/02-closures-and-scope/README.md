# Lesson 00.2: Closures, Lexical Scope & Encapsulation

## 1. What is it?
A **closure** is the combination of a function bundled together with references to its surrounding state (its **lexical environment**). In JavaScript, every inner function retains access to the variables in its outer enclosing scopes, even after the outer function has finished executing and returned.

---

## 2. Why do I need to understand this before TypeScript?
1. **Encapsulation in Functional Programming**: TypeScript gives you `private` class members, but in functional TS codebases (React hooks, Redux, Express middlewares), encapsulation is achieved through closures.
2. **Type Inference in Callbacks**: When you pass a closure into a generic higher-order function (like `.map()` or `.filter()`), TypeScript infers the types of the closure parameters based on contextual typing from the outer scope!
3. **Stale State Pitfalls**: In React and async TS code, a closure capturing a variable that is later mutated or re-rendered can hold onto "stale" values if you don't understand when closures are created.

---

## 3. Mental Model
Think of each function execution as creating a "backpack" (lexical environment record):
- When `createCounter()` runs, it puts a variable `let count = 0;` inside its backpack.
- It returns an inner function. That inner function carries a permanent reference to `createCounter`'s backpack.
- Even when `createCounter()` has exited, the backpack is **not garbage collected** because the returned function still holds a reference to it.

---

## 4. Syntax
```ts
function createRateLimiter(maxCalls: number) {
  let callCount = 0; // Enclosed state (hidden from external modification)

  return function attemptCall(): boolean {
    if (callCount >= maxCalls) {
      return false;
    }
    callCount++;
    return true;
  };
}

const limiter = createRateLimiter(2);
limiter(); // true
limiter(); // true
limiter(); // false (blocked)
```

---

## 5. TypeScript vs JavaScript Comparison
| Feature | JavaScript | TypeScript |
| :--- | :--- | :--- |
| **Closure Mechanism** | Native engine feature (Heap allocated environment). | Identical runtime engine mechanics. |
| **Parameter Typing** | Untyped; easy to mismatch captured types. | Contextually typed based on caller signature. |
| **Encapsulation** | Achieved via closures or `#private` fields. | Achieved via closures, `#private`, or `private` (compile-time only). |

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: The classic loop closure issue (var vs let)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10); // Prints 3, 3, 3! 'var' is function-scoped!
}

// [PASS] FIX: Use 'let' which creates a new lexical binding per iteration:
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10); // Prints 0, 1, 2
}
```

---

## 7. Real-World Production Usage
Factory patterns, rate limiters, memoization caches, and middleware pipelines:
```ts
export function createMemoizedFetcher<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

---

## 8. Exercise

### Problem
Build a type-safe `createTokenBucket` rate limiter:
1. It takes `capacity: number` and `refillRatePerSec: number`.
2. Returns an object `{ consume: (tokens: number) => boolean, getRemainingTokens: () => number }`.
3. The internal token counter must be completely inaccessible from the outside.

See [exercise.ts](./exercise.ts).

<details>
<summary>[HINT] Click to view solution & analysis</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
function makeAccumulator() {
  let total = 0;
  return {
    add(n: number) { total += n; },
    get: total // [FAIL] Bug: Why does this never update when add() is called?
  };
}
```
**Diagnosis**: In JavaScript, `get: total` evaluates `total` immediately at the time the object literal is created and assigns the primitive number `0`. It does NOT return a live getter function or property getter!

---

## 10. Technical Interview Questions

### Question: How do closures differ from object methods, and when would you prefer closures over classes in TypeScript?
- **Expected Answer**: Closures encapsulate state inside an enclosing function scope, whereas classes store state on properties attached to `this`.
- **Strong Answer**: Closures offer true runtime privacy: variables inside an enclosing lexical scope cannot be accessed, inspected, or patched from outside, even via reflection. TypeScript's `private` keyword only provides compile-time protection and is completely visible at JavaScript runtime. Closures are also naturally decoupled from `this` binding issues. However, creating many closure instances creates a new copy of every inner function in memory, whereas classes share methods across instances via the prototype chain.
- **Common Weak Answer**: "Closures are for functions and classes are for OOP."

---

## 11. 5-Minute Active Recall
1. Why does a closure prevent its outer scope from being garbage-collected?
2. What is the difference between `var` and `let` inside a `for` loop regarding closures?
3. How does TypeScript know the type of `item` in `[1, 2, 3].map(item => item * 2)`?

<details>
<summary>[RECALL] Check Recall Answers</summary>

1. Because the returned inner function retains an active reference to the outer environment record in heap memory.
2. `var` binds a single variable for the entire function scope; `let` creates a distinct lexical binding for each loop iteration.
3. Through **contextual typing**: TypeScript looks at the signature of `Array.prototype.map<U>(callbackfn: (value: T, ...))` where `T` is inferred as `number`.
</details>
