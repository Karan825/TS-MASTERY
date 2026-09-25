/**
 * EXERCISE 01.5: any vs unknown vs never vs void
 * Run with: npx tsx 01-fundamentals/05-any-unknown-never-void/exercise.ts
 */

// TASK 1: Implement `parseNumber`
// Takes `input: unknown`.
// If input is already a number (and not NaN), return it.
// If input is a string that can be parsed to a finite number, return the parsed number.
// Otherwise return undefined.
export function parseNumber(input: unknown): number | undefined {
  // TODO: Implement safe unknown parsing without any type assertions
  throw new Error("Not implemented");
}

// TASK 2: Exhaustive Switch with `never`
export type NotificationChannel = "email" | "sms" | "push";

// Implement dispatchNotification with exhaustive checking.
// If an unhandled channel is passed, it must cause a compile-time error.
export function dispatchNotification(channel: NotificationChannel): string {
  // TODO: Implement switch with compile-time exhaustive check using `never`
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 01.5 Tests...");
  if (
    parseNumber(42) === 42 &&
    parseNumber("123.45") === 123.45 &&
    parseNumber("invalid") === undefined &&
    parseNumber({}) === undefined
  ) {
    console.log("[PASS] parseNumber passed!");
  } else {
    console.error("[FAIL] parseNumber failed!");
  }

  if (
    dispatchNotification("email") === "Email dispatched" &&
    dispatchNotification("sms") === "SMS dispatched" &&
    dispatchNotification("push") === "Push dispatched"
  ) {
    console.log("[PASS] dispatchNotification passed!");
  } else {
    console.error("[FAIL] dispatchNotification failed!");
  }
}

// runTests();
