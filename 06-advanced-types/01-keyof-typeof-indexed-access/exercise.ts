/**
 * EXERCISE 06.1: keyof, typeof & Indexed Access Types
 * Run with: npx tsx 06-advanced-types/01-keyof-typeof-indexed-access/exercise.ts
 */

export const HTTP_ERROR_MAP = {
  BAD_REQUEST: { code: 400, message: "Invalid payload parameters" },
  UNAUTHORIZED: { code: 401, message: "Missing authorization token" },
  FORBIDDEN: { code: 403, message: "Insufficient permissions" },
  NOT_FOUND: { code: 404, message: "Requested resource not found" },
} as const;

// TASK 1: Derive `ErrorKey` type from HTTP_ERROR_MAP
// Should evaluate to: "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND"
export type ErrorKey = any; // TODO: Implement

// TASK 2: Derive `ErrorCode` type
// Should evaluate to: 400 | 401 | 403 | 404
export type ErrorCode = any; // TODO: Implement

// TASK 3: Implement `getErrorMessage(key: ErrorKey): string`
export function getErrorMessage(key: ErrorKey): string {
  // TODO: Implement
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 06.1 Tests...");
  try {
    const msg = getErrorMessage("FORBIDDEN");
    if (msg === "Insufficient permissions") {
      console.log("[PASS] Exercise 06.1 Passed!");
    } else {
      console.error("[FAIL] Exercise 06.1 Failed! Got:", msg);
    }
  } catch (err: any) {
    console.error("[FAIL] Exercise 06.1 Failed:", err.message);
  }
}

// runTests();
