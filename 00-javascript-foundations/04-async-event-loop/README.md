# Lesson 00.4: The JavaScript Event Loop, Microtasks & Promises

## 1. What is it?
JavaScript is a **single-threaded, non-blocking, concurrent language** governed by the **Event Loop**.
- **Call Stack**: Synchronous execution of frames.
- **Microtask Queue**: High-priority tasks that execute immediately after the current stack frame empties (e.g. `Promise` callbacks, `queueMicrotask`).
- **Macrotask Queue (Task Queue)**: Lower-priority callbacks scheduled by timer APIs (`setTimeout`, `setInterval`), I/O, or OS events.

---

## 2. Why do I need to understand this before TypeScript?
- **TypeScript does NOT change runtime concurrency**: Annotating a function as `async function fetchUser(): Promise<User>` doesn't spin up a background OS thread or perform magic. It returns an instance of the JavaScript `Promise` class.
- **Promise Typing**: TypeScript wraps asynchronous return types in `Promise<T>`. Understanding how `await` unwraps a `Promise<T>` into `T` at compile-time requires knowing that the remainder of the function body is scheduled as a microtask at runtime!
- **Error Handling**: An unhandled rejected promise crashes Node.js processes. TypeScript cannot check whether you remembered to `await` or `.catch()` unless strict lint rules or compiler checks are applied.

---

## 3. Mental Model: Event Loop Priority
```
1. Run synchronous JavaScript on Call Stack until empty.
2. DRAIN the ENTIRE Microtask Queue (Promises, queueMicrotask).
3. If new microtasks were scheduled during step 2, RUN THEM TOO.
4. Render UI updates (in browsers).
5. Pick ONE Macrotask from the Task Queue (setTimeout, I/O callback).
6. Repeat from step 1!
```
*Microtasks always starve macrotasks until the microtask queue is completely empty.*

---

## 4. Syntax & Event Loop Execution Order
```ts
console.log("1. Synchronous Stack");

setTimeout(() => {
  console.log("4. Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("2. Microtask 1 (Promise)");
}).then(() => {
  console.log("3. Microtask 2 (Chained Promise)");
});

console.log("1b. Synchronous Stack End");
// Output order: 1, 1b, 2, 3, 4
```

---

## 5. TypeScript vs JavaScript Comparison
| Concept | JavaScript Runtime | TypeScript Compile-Time |
| :--- | :--- | :--- |
| `async fn(): Promise<T>` | Returns a JS `Promise` instance; errors become rejections. | Compiler enforces return type is assignable to `Promise<T>`. |
| `await expr` | Yields execution; schedules resumption as a microtask. | Unwraps `Promise<T>` into `T` (or `Awaited<T>`). |
| Floating Promise (`fn()`) | Runs in background; rejections may crash process. | Can be flagged via `@typescript-eslint/no-floating-promises`. |

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE 1: Forgetting await inside forEach
async function processBatch(ids: string[]) {
  // Array.prototype.forEach does NOT await promises!
  // It fires all promises and immediately returns undefined!
  ids.forEach(async (id) => {
    await sendAlert(id);
  });
  console.log("Done"); // Prints BEFORE alerts finish!
}

// [PASS] FIX: Use for...of or Promise.all:
async function processBatchCorrect(ids: string[]) {
  for (const id of ids) {
    await sendAlert(id); // Sequential
  }
  // OR concurrent:
  await Promise.all(ids.map((id) => sendAlert(id)));
}
```

---

## 7. Real-World Production Usage
Resilient retry mechanisms with exponential backoff:
```ts
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 200
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return retryWithBackoff(operation, retries - 1, delayMs * 2);
  }
}
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. `parallelLimit<T>`: Run a list of async task factories with a concurrency limit.
2. Type-safe timeout wrapper `withTimeout<T>(promise: Promise<T>, ms: number): Promise<T>`.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
async function loadUserData(userId: string) {
  try {
    return fetch(`/api/users/${userId}`).then(r => r.json());
  } catch (error) {
    console.error("Caught error:", error); // [FAIL] Why does this catch block NEVER run when fetch fails?
  }
}
```
**Diagnosis**: The return statement returns a pending Promise without `await`. When that promise rejects in the microtask queue, the synchronous `try/catch` frame has already exited! To catch rejections inside `try/catch`, you must `return await ...`.

---

## 10. Technical Interview Questions

### Question: What is the microtask queue, and why does `await` schedule code on it?
- **Expected Answer**: The microtask queue handles Promises. `await` pauses the function and schedules the rest as a microtask.
- **Strong Answer**: In the ECMAScript specification, Promises are processed as Jobs in the Job Queue (Microtask Queue). When execution hits an `await expr`, the JavaScript runtime evaluates `expr`. Even if `expr` is already resolved, the remainder of the async function body is packaged as a microtask and queued. After synchronous execution finishes, the event loop drains the entire microtask queue before picking up any I/O or timer events from the macrotask queue.
- **Follow-up**: *Why does TypeScript need the `Awaited<T>` utility type?*  
  *Answer*: Because promises can be recursively nested (e.g. `Promise<Promise<string>>`). `await` at runtime unwraps nested promises recursively until a non-promise value is reached. TypeScript's `Awaited<T>` models this exact runtime behavior at the type level.

---

## 11. 5-Minute Active Recall
1. Between `setTimeout(fn, 0)` and `Promise.resolve().then(fn)`, which executes first and why?
2. Why is `async` with `array.forEach(...)` a major anti-pattern?
3. What is the difference between `return promise` vs `return await promise` inside a `try/catch` block?

<details>
<summary>[RECALL] Check Answers</summary>

1. `Promise.resolve().then(fn)` executes first because microtasks are drained before the next macrotask is dequeued.
2. `forEach` ignores the returned promise; it does not wait for asynchronous tasks to settle.
3. `return promise` exits the `try` block immediately; any rejection happens after the `try/catch` is off the stack and escapes unhandled. `return await promise` suspends the function until the promise settles, allowing the `catch` block to intercept rejections.
</details>
