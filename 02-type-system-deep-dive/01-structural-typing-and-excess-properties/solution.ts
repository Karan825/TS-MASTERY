/**
 * REFERENCE SOLUTION: Exercise 02.1
 * Structural Typing & Excess Property Checks
 */

export interface StrictHeader {
  contentType: string;
  authorization: string;
}

export function acceptHeader(header: StrictHeader): string {
  return `${header.contentType} | ${header.authorization}`;
}

export interface OpenPayload {
  id: string;
  type: string;
  [key: string]: unknown; // Explicit index signature allows open extension
}

// Verification
const full = {
  contentType: "application/json",
  authorization: "Bearer token",
  userAgent: "Antigravity/1.0",
};

console.assert(acceptHeader(full) === "application/json | Bearer token");

// OpenPayload permits direct object literals with excess properties:
const payload: OpenPayload = {
  id: "evt_1",
  type: "user_signup",
  ipAddress: "10.0.0.1",
  durationMs: 45,
};
console.assert(payload.id === "evt_1");
console.log("[PASS] Exercise 02.1 Solution Verified Successfully!");
