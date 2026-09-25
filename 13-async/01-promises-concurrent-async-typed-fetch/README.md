# Lesson 13.1: Async TypeScript, Typed Fetch & Concurrency Orchestration

## 1. What is it?
Asynchronous TypeScript extends JavaScript Promises with type annotations:
- `Promise<T>`: A container for a value of type `T` available in the future.
- `Promise.all`: Runs promises in parallel; rejects immediately if any promise rejects.
- `Promise.allSettled`: Runs all promises to completion, returning an array of `{ status: "fulfilled", value: T } | { status: "rejected", reason: any }`.
- Generic Typed Fetch Client: Wrapper around the standard `fetch()` API that validates and returns typed responses.

---

## 2. Why does it exist?
Network operations, database queries, and disk I/O are all asynchronous.
Beginners frequently stumble over:
- How `Promise.all` infers tuple returns (`[Promise<User>, Promise<Order[]>]` -> `Promise<[User, Order[]]>`).
- Discriminated union narrowing on `Promise.allSettled` results.
- Handling partial batch failures without aborting the entire process.

---

## 3. Mental Model: The Concurrency Orchestrator
```
Promise.all:       [Task 1, Task 2, Task 3] ──> Fails fast if ANY task fails!
Promise.allSettled: [Task 1, Task 2, Task 3] ──> Waits for ALL, returns discriminated results:
                                                 [{ status: "fulfilled", value }, { status: "rejected", reason }]
```

---

## 4. Syntax: Discriminated Unions in `Promise.allSettled`
```ts
interface Metrics { latency: number }
interface Profile { name: string }

async function loadDashboard() {
  const results = await Promise.allSettled([
    fetchMetrics(),
    fetchProfile(),
  ]);

  const [metricsResult, profileResult] = results;

  if (metricsResult.status === "fulfilled") {
    console.log("Metrics value:", metricsResult.value.latency);
  } else {
    console.error("Metrics failed:", metricsResult.reason);
  }
}
```

---

## 5. Building a Strongly Typed Generic HTTP Client
```ts
export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export async function typedFetch<T>(
  url: string,
  validator: (data: unknown) => T,
  init?: RequestInit
): Promise<HttpResponse<T>> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
  }
  const raw = await res.json();
  const validatedData = validator(raw);

  return {
    data: validatedData,
    status: res.status,
    headers: res.headers,
  };
}
```

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Unchecked Promise.all with user inputs
// If one item fails, the entire batch is lost!
// In batch processing, prefer Promise.allSettled!
```

---

## 7. Exercise
Open [exercise.ts](./exercise.ts) and implement a batch worker using `Promise.allSettled` that separates successful results from failures.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 8. Technical Interview Questions

### Question: Compare `Promise.all` and `Promise.allSettled` in TypeScript. How does TypeScript type their return values?
- **Expected Answer**: `Promise.all` fails on first error, `Promise.allSettled` waits for all.
- **Strong Answer**: `Promise.all` takes a tuple of promises `[Promise<T1>, Promise<T2>]` and returns a `Promise<[T1, T2]>`. If any promise rejects, the entire aggregate promise immediately rejects. `Promise.allSettled` returns a `Promise<PromiseSettledResult<T>[]>`, where each element is a **Discriminated Union**: `{ status: "fulfilled", value: T } | { status: "rejected", reason: any }`. TypeScript requires inspecting `status === "fulfilled"` before accessing `.value`, making it impossible to accidentally read values from failed promises.

---

## 9. 5-Minute Active Recall
1. What does `Promise.allSettled` return for each promise?
2. What is the return type of an `async` function that returns `42`?
3. How does TypeScript type `await Promise.all([Promise.resolve("a"), Promise.resolve(1)])`?

<details>
<summary>[RECALL] Check Answers</summary>

1. A discriminated union: `{ status: "fulfilled", value: T } | { status: "rejected", reason: any }`.
2. `Promise<number>`.
3. A tuple: `[string, number]`.
</details>
