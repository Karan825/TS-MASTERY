/**
 * REFERENCE SOLUTION: Exercise 01.1
 * Compile-Time vs Runtime & Type Erasure
 */

export interface SystemUser {
  id: string;
  username: string;
  isActive: boolean;
}

export function validateSystemUser(data: unknown): data is SystemUser {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  // Type narrowing object properties safely:
  const candidate = data as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.username === "string" &&
    typeof candidate.isActive === "boolean"
  );
}

// Verification
const valid = { id: "u_1", username: "karan", isActive: true };
const invalid = { id: 123, username: null };

console.assert(validateSystemUser(valid) === true);
console.assert(validateSystemUser(invalid) === false);
console.log("[PASS] Exercise 01.1 Solution Verified Successfully!");
