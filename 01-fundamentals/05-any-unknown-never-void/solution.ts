/**
 * REFERENCE SOLUTION: Exercise 01.5
 * any vs unknown vs never vs void
 */

export function parseNumber(input: unknown): number | undefined {
  if (typeof input === "number" && !Number.isNaN(input)) {
    return input;
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed === "") return undefined;
    const parsed = Number(trimmed);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

export type NotificationChannel = "email" | "sms" | "push";

export function dispatchNotification(channel: NotificationChannel): string {
  switch (channel) {
    case "email":
      return "Email dispatched";
    case "sms":
      return "SMS dispatched";
    case "push":
      return "Push dispatched";
    default: {
      const _exhaustiveCheck: never = channel;
      throw new Error(`Unhandled channel: ${_exhaustiveCheck}`);
    }
  }
}

// Verification
console.assert(parseNumber(42) === 42);
console.assert(parseNumber("123.45") === 123.45);
console.assert(parseNumber("bad") === undefined);
console.assert(dispatchNotification("email") === "Email dispatched");
console.log("[PASS] Exercise 01.5 Solution Verified Successfully!");
