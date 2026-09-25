/**
 * REFERENCE SOLUTION: Exercise 06.1
 * keyof, typeof & Indexed Access Types
 */

export const HTTP_ERROR_MAP = {
  BAD_REQUEST: { code: 400, message: "Invalid payload parameters" },
  UNAUTHORIZED: { code: 401, message: "Missing authorization token" },
  FORBIDDEN: { code: 403, message: "Insufficient permissions" },
  NOT_FOUND: { code: 404, message: "Requested resource not found" },
} as const;

// TASK 1 SOLUTION:
export type ErrorKey = keyof typeof HTTP_ERROR_MAP;

// TASK 2 SOLUTION:
export type ErrorCode = (typeof HTTP_ERROR_MAP)[ErrorKey]["code"];

// TASK 3 SOLUTION:
export function getErrorMessage(key: ErrorKey): string {
  return HTTP_ERROR_MAP[key].message;
}

// Verification
console.assert(getErrorMessage("FORBIDDEN") === "Insufficient permissions");
console.assert(getErrorMessage("BAD_REQUEST") === "Invalid payload parameters");

// Type check:
const testCode: ErrorCode = 404;
console.log("[PASS] Exercise 06.1 Solution Verified Successfully! (Code:", testCode, ")");
