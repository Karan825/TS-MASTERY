/**
 * REFERENCE SOLUTION: Exercise 01.2
 * Type Annotations vs Inference
 */

// TASK 1 SOLUTION: Let TypeScript infer primitives from literal assignments
export const port = 8080;
export const serverName = "api-gateway";
export const isDebug = false;

// TASK 2 SOLUTION: Explicitly annotate boundary signatures
export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * taxRate;
}

// TASK 3 SOLUTION: Explicitly annotate empty collection types
export const eventLog: string[] = [];

// Verification
console.assert(calculateTax(100, 0.08) === 8);
eventLog.push("server_started");
console.assert(eventLog.length === 1);
console.log("[PASS] Exercise 01.2 Solution Verified Successfully!");
