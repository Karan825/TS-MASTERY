/**
 * EXERCISE 02.4: Type Compatibility & Variance
 * Run with: npx tsx 02-type-system-deep-dive/04-type-compatibility-and-variance/exercise.ts
 */

export interface BaseEvent {
  timestamp: number;
}

export interface ClickEvent extends BaseEvent {
  x: number;
  y: number;
}

// TASK 1: Implement `createEventListenerRegistry`
// An event listener for `ClickEvent` expects a handler `(e: ClickEvent) => void`.
// Can we register a generic handler `(e: BaseEvent) => void` as a click listener?
// Implement the registration function showing that contravariance safely allows this.
export type EventHandler<T> = (event: T) => void;

export function registerClickListener(
  handler: EventHandler<ClickEvent>
): string {
  // TODO: Execute handler with dummy click event and return "registered"
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 02.4 Tests...");
  const baseHandler: EventHandler<BaseEvent> = (e) => {
    console.log("Base handler received timestamp:", e.timestamp);
  };

  // Must accept baseHandler due to contravariance:
  try {
    const res = registerClickListener(baseHandler);
    if (res === "registered") console.log("[PASS] Exercise 02.4 Passed!");
  } catch (err: any) {
    console.error("[FAIL] Exercise 02.4 Failed:", err.message);
  }
}

// runTests();
