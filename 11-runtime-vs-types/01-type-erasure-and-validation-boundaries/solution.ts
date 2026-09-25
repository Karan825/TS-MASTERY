/**
 * REFERENCE SOLUTION: Exercise 11.1
 * Runtime Boundaries & Validation
 */

export interface WebhookEvent {
  eventId: string;
  eventType: "order_created" | "order_cancelled";
  payload: {
    orderId: string;
    totalUsd: number;
  };
}

export function validateWebhook(data: unknown): WebhookEvent {
  if (typeof data !== "object" || data === null) {
    throw new Error("Webhook payload must be a non-null object");
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.eventId !== "string" || obj.eventId.trim() === "") {
    throw new Error("Missing or invalid 'eventId'");
  }

  if (obj.eventType !== "order_created" && obj.eventType !== "order_cancelled") {
    throw new Error("Invalid 'eventType'");
  }

  if (typeof obj.payload !== "object" || obj.payload === null) {
    throw new Error("Missing or invalid 'payload' object");
  }

  const payloadObj = obj.payload as Record<string, unknown>;

  if (typeof payloadObj.orderId !== "string" || payloadObj.orderId.trim() === "") {
    throw new Error("Missing or invalid 'payload.orderId'");
  }

  if (typeof payloadObj.totalUsd !== "number" || !Number.isFinite(payloadObj.totalUsd)) {
    throw new Error("Missing or invalid 'payload.totalUsd'");
  }

  return {
    eventId: obj.eventId,
    eventType: obj.eventType,
    payload: {
      orderId: payloadObj.orderId,
      totalUsd: payloadObj.totalUsd,
    },
  };
}

// Verification
const valid = {
  eventId: "evt_1",
  eventType: "order_created",
  payload: {
    orderId: "ord_99",
    totalUsd: 145.5,
  },
};

const parsed = validateWebhook(valid);
console.assert(parsed.eventId === "evt_1");
console.assert(parsed.payload.totalUsd === 145.5);

let caught = false;
try {
  validateWebhook({ eventId: "evt_2", eventType: "unknown" });
} catch {
  caught = true;
}
console.assert(caught, "Malformed event must throw!");
console.log("[PASS] Exercise 11.1 Solution Verified Successfully!");
