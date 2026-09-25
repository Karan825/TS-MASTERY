/**
 * REFERENCE SOLUTION: Exercise 02.4
 * Type Compatibility & Variance
 */

export interface BaseEvent {
  timestamp: number;
}

export interface ClickEvent extends BaseEvent {
  x: number;
  y: number;
}

export type EventHandler<T> = (event: T) => void;

export function registerClickListener(
  handler: EventHandler<ClickEvent>
): string {
  // Invoking handler with concrete ClickEvent:
  const dummyClick: ClickEvent = {
    timestamp: Date.now(),
    x: 100,
    y: 200,
  };

  handler(dummyClick);
  return "registered";
}

// Verification
let capturedTimestamp = 0;
const genericHandler: EventHandler<BaseEvent> = (e) => {
  capturedTimestamp = e.timestamp;
};

// Contravariance: EventHandler<BaseEvent> is assignable to EventHandler<ClickEvent>
const status = registerClickListener(genericHandler);
console.assert(status === "registered");
console.assert(capturedTimestamp > 0);
console.log("[PASS] Exercise 02.4 Solution Verified Successfully!");
