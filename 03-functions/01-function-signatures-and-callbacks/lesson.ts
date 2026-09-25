/**
 * Lesson 03.1: Function Signatures, Callables & Rest Tuples
 * Run with: npx tsx 03-functions/01-function-signatures-and-callbacks/lesson.ts
 */

console.log("=== 1. Callable Object Interfaces ===");

interface CounterFunction {
  (): number; // Call signature
  reset(): void; // Attached method
}

function createCounter(): CounterFunction {
  let count = 0;
  const fn = function () {
    return ++count;
  };
  fn.reset = function () {
    count = 0;
  };
  return fn as CounterFunction;
}

const counter = createCounter();
console.log("Count:", counter()); // 1
console.log("Count:", counter()); // 2
counter.reset();
console.log("After reset:", counter()); // 1

console.log("\n=== 2. Tuple-Typed Rest Parameters ===");

type AuditLogger = [actor: string, action: string, ...tags: string[]];

function logAuditEvent(...[actor, action, ...tags]: AuditLogger) {
  console.log(`[AUDIT] ${actor} performed ${action}. Tags: ${tags.join(", ")}`);
}

logAuditEvent("admin@co.com", "UPDATE_CONFIG", "security", "infra", "v2");
