/**
 * REFERENCE SOLUTION: Exercise 13.1
 * Async TypeScript & Concurrency
 */

export interface BatchSummary<T> {
  successful: T[];
  failedErrors: Error[];
}

export async function processBatchSettled<T>(
  tasks: (() => Promise<T>)[]
): Promise<BatchSummary<T>> {
  const promises = tasks.map((fn) => fn());
  const settled = await Promise.allSettled(promises);

  const successful: T[] = [];
  const failedErrors: Error[] = [];

  for (const item of settled) {
    if (item.status === "fulfilled") {
      successful.push(item.value);
    } else {
      const err =
        item.reason instanceof Error
          ? item.reason
          : new Error(String(item.reason));
      failedErrors.push(err);
    }
  }

  return { successful, failedErrors };
}

// Verification
async function verify() {
  const tasks = [
    () => Promise.resolve(10),
    () => Promise.reject(new Error("Network glitch")),
    () => Promise.resolve(20),
  ];

  const res = await processBatchSettled(tasks);
  console.assert(res.successful.length === 2);
  console.assert(res.successful[0] === 10);
  console.assert(res.failedErrors.length === 1);
  console.assert(res.failedErrors[0]?.message === "Network glitch");
  console.log("[PASS] Exercise 13.1 Solution Verified Successfully!");
}

verify();
