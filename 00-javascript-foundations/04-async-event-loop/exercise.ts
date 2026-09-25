/**
 * EXERCISE 00.4: Event Loop, Microtasks & Promises
 * Run with: npx tsx 00-javascript-foundations/04-async-event-loop/exercise.ts
 */

// TASK 1: Implement `withTimeout`
// Wraps a promise in a timeout. If the promise takes longer than `timeoutMs` to resolve/reject,
// the returned promise rejects with an Error("Operation timed out").
// Be sure to clear any timer if the promise resolves first so timers don't leak.
export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  // TODO: Implement using Promise.race and setTimeout
  throw new Error("Not implemented");
}

// TASK 2: Implement `delay`
// Returns a promise that resolves with void after `ms` milliseconds.
export function delay(ms: number): Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}

async function runTests() {
  console.log("Running Exercise 00.4 Tests...");
  try {
    const fastPromise = new Promise<string>((res) => setTimeout(() => res("done"), 50));
    const result = await withTimeout(fastPromise, 200);
    if (result !== "done") throw new Error("Fast promise failed");
    console.log("[PASS] Fast promise test passed");

    const slowPromise = new Promise<string>((res) => setTimeout(() => res("slow"), 200));
    let timedOut = false;
    try {
      await withTimeout(slowPromise, 50);
    } catch {
      timedOut = true;
    }
    if (!timedOut) throw new Error("Slow promise should have timed out");
    console.log("[PASS] Timeout test passed");
  } catch (err: any) {
    console.error("[FAIL] Exercise 00.4 Failed:", err.message);
  }
}

// runTests();
