/**
 * REFERENCE SOLUTION: Exercise 00.4
 * Event Loop, Microtasks & Promises
 */

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timerId: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, timeoutMs);
  });

  try {
    // Race user promise against timeout
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    // Clear timer so Node event loop doesn't stay open unnecessarily
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
  }
}

// Verification
async function verify() {
  const result = await withTimeout(delay(20).then(() => "success"), 100);
  console.assert(result === "success");

  let caught = false;
  try {
    await withTimeout(delay(150), 50);
  } catch (err: any) {
    caught = true;
    console.assert(err.message === "Operation timed out");
  }
  console.assert(caught, "Timeout must throw!");
  console.log("[PASS] Exercise 00.4 Solution Verified Successfully!");
}

verify();
