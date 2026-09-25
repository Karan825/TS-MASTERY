/**
 * Lesson 11.1: Runtime Boundaries & Validation
 * Run with: npx tsx 11-runtime-vs-types/01-type-erasure-and-validation-boundaries/lesson.ts
 */

console.log("=== 1. Simulating Unsafe Boundary Parsing ===");

interface PaymentPayload {
  transactionId: string;
  amountCents: number;
}

// Simulated external API response (malformed)
const mockApiResponse = '{"error": "Rate limit exceeded", "status": 429}';

function unsafeParse(json: string): PaymentPayload {
  // Lying to the compiler with 'as':
  return JSON.parse(json) as PaymentPayload;
}

const parsedUnsafe = unsafeParse(mockApiResponse);
console.log("TypeScript believes this is PaymentPayload:", parsedUnsafe);
// Accessing expected fields:
console.log("parsedUnsafe.amountCents:", parsedUnsafe.amountCents); // undefined!
// If we did: parsedUnsafe.amountCents.toFixed(2) -> CRASH!

console.log("\n=== 2. Safe Runtime Boundary Defense ===");

function safeParsePayment(json: string): PaymentPayload {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON string");
  }

  if (typeof raw !== "object" || raw === null) {
    throw new Error("Payload must be a non-null object");
  }

  const candidate = raw as Record<string, unknown>;

  if (typeof candidate.transactionId !== "string") {
    throw new Error("Invalid or missing 'transactionId'");
  }

  if (typeof candidate.amountCents !== "number" || !Number.isFinite(candidate.amountCents)) {
    throw new Error("Invalid or missing 'amountCents'");
  }

  return {
    transactionId: candidate.transactionId,
    amountCents: candidate.amountCents,
  };
}

try {
  safeParsePayment(mockApiResponse);
} catch (err: any) {
  console.log("Safely caught boundary failure at runtime:", err.message);
}
