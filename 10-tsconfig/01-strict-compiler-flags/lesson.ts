/**
 * Lesson 10.1: TSConfig Strict Flags Demonstration
 * Run with: npx tsx 10-tsconfig/01-strict-compiler-flags/lesson.ts
 */

console.log("=== 1. Demonstration: noUncheckedIndexedAccess ===");

const primes = [2, 3, 5, 7, 11];

// Because our project has "noUncheckedIndexedAccess": true in tsconfig.json:
// 'first' is inferred as 'number | undefined'!
const first = primes[0];
const outOfBounds = primes[99];

console.log("First prime:", first);
console.log("Out of bounds prime:", outOfBounds); // Evaluates to undefined!

// Safe narrowing:
if (first !== undefined) {
  console.log("Safely narrowed prime value:", first.toFixed(0));
}

console.log("\n=== 2. useUnknownInCatchVariables ===");

try {
  throw new Error("Simulated database timeout");
} catch (err) {
  // 'err' is automatically typed as 'unknown' in strict mode:
  if (err instanceof Error) {
    console.log("Safely extracted error message:", err.message);
  } else {
    console.log("Unknown error:", String(err));
  }
}
