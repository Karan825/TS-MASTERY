/**
 * Lesson 13.1: Async TypeScript & Concurrency
 * Run with: npx tsx 13-async/01-promises-concurrent-async-typed-fetch/lesson.ts
 */

console.log("=== 1. Promise.all Tuple Inference ===");

async function getUserId(): Promise<string> {
  return "usr_42";
}

async function getScore(): Promise<number> {
  return 980;
}

async function runParallel() {
  // Inferred as Promise<[string, number]>:
  const [id, score] = await Promise.all([getUserId(), getScore()]);
  console.log(`Parallel load: User ${id} has score ${score}`);
}

runParallel();

console.log("\n=== 2. Discriminated Union in Promise.allSettled ===");

async function runSettled() {
  const p1 = Promise.resolve("Success payload");
  const p2 = Promise.reject(new Error("Connection timeout"));

  const results = await Promise.allSettled([p1, p2]);

  for (const res of results) {
    if (res.status === "fulfilled") {
      console.log("Fulfilled with value:", res.value);
    } else {
      console.log("Rejected with reason:", (res.reason as Error).message);
    }
  }
}

runSettled();
