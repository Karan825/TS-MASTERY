/**
 * EXERCISE 00.0: Variables, Functions & Syntax Fundamentals
 *
 * Instructions:
 * 1. Define variables and updateProgress.
 * 2. Implement formatGreeting with optional title and template literals.
 * 3. Implement calculateDiscount as an arrow function with a default parameter.
 * 4. Implement isEven as a concise arrow function.
 *
 * Run your code to test:
 * npx tsx 00-javascript-foundations/00-variables-and-functions/exercise.ts
 */

// ==========================================
// TASK 1: Variables & Reassignment
// ==========================================
// 1. Declare a constant named COURSE_TITLE with type string and value "TypeScript Mastery"
// 2. Declare a variable named completionPercent with type number and initial value 0
// 3. Write a function updateProgress(increaseBy: number): void that increments completionPercent

export const COURSE_TITLE: string = "TypeScript Mastery";
export let completionPercent: number = 0;

export function updateProgress(increaseBy: number): void {
  // TODO: Add increaseBy to completionPercent
  throw new Error("Not implemented");
}

// ==========================================
// TASK 2: Function Declaration & Optional Parameter
// ==========================================
// Write a function formatGreeting that accepts:
// - name: string (required)
// - title?: string (optional)
// Returns:
// - If title is provided: `Hello, ${title} ${name}!`
// - If title is NOT provided: `Hello, ${name}!`
export function formatGreeting(name: string, title?: string): string {
  // TODO: Replace with implementation using template literals (``)
  throw new Error("Not implemented");
}

// ==========================================
// TASK 3: Arrow Function & Default Parameter
// ==========================================
// Write an arrow function calculateDiscount that accepts:
// - price: number
// - discountRate: number with default value 0.10 (10% discount)
// Returns the final price after discount: price * (1 - discountRate)
export const calculateDiscount = (
  price: number,
  discountRate: number = 0.1
): number => {
  // TODO: Replace with implementation
  throw new Error("Not implemented");
};

// ==========================================
// TASK 4: Concise Arrow Function
// ==========================================
// Write a one-line arrow function isEven that returns true if n is even, false otherwise.
export const isEven = (n: number): boolean => {
  // TODO: Replace with implementation (e.g. n % 2 === 0)
  throw new Error("Not implemented");
};

// ==========================================
// TEST SUITE (Self-Verification)
// ==========================================
function runTests() {
  console.log("Running Exercise 00.0 Tests...\n");

  try {
    updateProgress(25);
    if ((completionPercent as number) !== 25) throw new Error(`Expected completionPercent 25, got ${completionPercent}`);
    updateProgress(15);
    if ((completionPercent as number) !== 40) throw new Error(`Expected completionPercent 40, got ${completionPercent}`);
    console.log("[PASS] Task 1 Passed: Variables & updateProgress");
  } catch (err: any) {
    console.error("[FAIL] Task 1 Failed:", err.message);
  }

  try {
    const withoutTitle = formatGreeting("Karan");
    if (withoutTitle !== "Hello, Karan!") throw new Error(`Expected 'Hello, Karan!', got '${withoutTitle}'`);
    const withTitle = formatGreeting("Karan", "Dr.");
    if (withTitle !== "Hello, Dr. Karan!") throw new Error(`Expected 'Hello, Dr. Karan!', got '${withTitle}'`);
    console.log("[PASS] Task 2 Passed: formatGreeting");
  } catch (err: any) {
    console.error("[FAIL] Task 2 Failed:", err.message);
  }

  try {
    const discounted = calculateDiscount(100); // Uses default 0.10 -> 90
    if (discounted !== 90) throw new Error(`Expected 90, got ${discounted}`);
    const customDiscount = calculateDiscount(200, 0.25); // 200 * 0.75 -> 150
    if (customDiscount !== 150) throw new Error(`Expected 150, got ${customDiscount}`);
    console.log("[PASS] Task 3 Passed: calculateDiscount");
  } catch (err: any) {
    console.error("[FAIL] Task 3 Failed:", err.message);
  }

  try {
    if (!isEven(4)) throw new Error("Expected 4 to be even");
    if (isEven(7)) throw new Error("Expected 7 not to be even");
    console.log("[PASS] Task 4 Passed: isEven");
  } catch (err: any) {
    console.error("[FAIL] Task 4 Failed:", err.message);
  }

  console.log("\nExercise 00.0 test run finished.");
}

runTests();
