/**
 * SOLUTION 00.0: Variables, Functions & Syntax Fundamentals
 * Run with: npx tsx 00-javascript-foundations/00-variables-and-functions/solution.ts
 */

// TASK 1: Variables & Reassignment
export const COURSE_TITLE: string = "TypeScript Mastery";
export let completionPercent: number = 0;

export function updateProgress(increaseBy: number): void {
  completionPercent += increaseBy;
}

// TASK 2: Function Declaration & Optional Parameter
export function formatGreeting(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}!`;
  }
  return `Hello, ${name}!`;
}

// TASK 3: Arrow Function & Default Parameter
export const calculateDiscount = (
  price: number,
  discountRate: number = 0.1
): number => {
  return price * (1 - discountRate);
};

// TASK 4: Concise Arrow Function
export const isEven = (n: number): boolean => n % 2 === 0;

// ==========================================
// TEST SUITE (Verification)
// ==========================================
function runTests() {
  console.log("Running Solution 00.0 Tests...\n");

  updateProgress(25);
  console.assert(completionPercent === 25, "Task 1 failed");
  updateProgress(15);
  console.assert(completionPercent === 40, "Task 1 failed");
  console.log("[PASS] Task 1 Passed: Variables & updateProgress");

  const withoutTitle = formatGreeting("Karan");
  console.assert(withoutTitle === "Hello, Karan!", "Task 2 failed");
  const withTitle = formatGreeting("Karan", "Dr.");
  console.assert(withTitle === "Hello, Dr. Karan!", "Task 2 failed");
  console.log("[PASS] Task 2 Passed: formatGreeting");

  const discounted = calculateDiscount(100);
  console.assert(discounted === 90, "Task 3 failed");
  const customDiscount = calculateDiscount(200, 0.25);
  console.assert(customDiscount === 150, "Task 3 failed");
  console.log("[PASS] Task 3 Passed: calculateDiscount");

  console.assert(isEven(4) === true, "Task 4 failed");
  console.assert(isEven(7) === false, "Task 4 failed");
  console.log("[PASS] Task 4 Passed: isEven");

  console.log("\n[SUCCESS] All 00.0 Solution Tests Passed successfully!");
}

runTests();
