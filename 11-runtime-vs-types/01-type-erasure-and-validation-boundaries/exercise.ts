/**
 * EXERCISE 11.1: Runtime Boundaries & Validation
 * Run with: npx tsx 11-runtime-vs-types/01-type-erasure-and-validation-boundaries/exercise.ts
 */

export interface WebhookEvent {
  eventId: string;
  eventType: "order_created" | "order_cancelled";
  payload: {
    orderId: string;
    totalUsd: number;
  };
}

// TASK: Implement `validateWebhook`
// Validates an untrusted input `data: unknown`.
// If valid, returns the typed `WebhookEvent`.
// If invalid or malformed, throws an Error detailing what failed.
export function validateWebhook(data: unknown): WebhookEvent {
  // TODO: Implement thorough runtime schema validation
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 11.1 Tests...");
  const valid = {
    eventId: "evt_1",
    eventType: "order_created",
    payload: {
      orderId: "ord_99",
      totalUsd: 145.5,
    },
  };

  try {
    const parsed = validateWebhook(valid);
    if (parsed.eventId === "evt_1" && parsed.payload.totalUsd === 145.5) {
      console.log("[PASS] Exercise 11.1 Passed!");
    }
  } catch (err: any) {
    console.error("[FAIL] Exercise 11.1 Failed:", err.message);
  }
}

// runTests();
