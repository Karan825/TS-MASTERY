/**
 * Lesson 00.4: Event Loop, Microtasks & Promises
 * Run with: npx tsx 00-javascript-foundations/04-async-event-loop/lesson.ts
 */

console.log("=== 1. Execution Order Demonstration ===");

function demonstrateQueuePriority() {
  console.log("1: Synchronous call stack start");

  setTimeout(() => {
    console.log("5: Timer macrotask executed");
  }, 0);

  Promise.resolve()
    .then(() => {
      console.log("3: Microtask 1 resolved");
    })
    .then(() => {
      console.log("4: Microtask 2 resolved (chained)");
    });

  console.log("2: Synchronous call stack end");
}

demonstrateQueuePriority();

console.log("\n=== 2. Async/Await & Recursive Promise Unwrapping ===");

// Notice how TypeScript types unwrapping with Awaited<T>
type NestedPromise = Promise<Promise<Promise<number>>>;
type Unwrapped = Awaited<NestedPromise>; // Evaluates to 'number'!

async function fetchNumericMetric(): Promise<number> {
  return 42;
}

async function runner() {
  const result: number = await fetchNumericMetric();
  console.log("Awaited unwrapped value:", result);
}

runner();
