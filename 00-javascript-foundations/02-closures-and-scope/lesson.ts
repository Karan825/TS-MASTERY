/**
 * Lesson 00.2: Closures, Lexical Scope & Encapsulation
 * Run with: npx tsx 00-javascript-foundations/02-closures-and-scope/lesson.ts
 */

console.log("=== 1. Basic Closure Mechanics ===");

function createCounter(initialValue: number = 0) {
  // Private enclosed state
  let current = initialValue;

  return {
    increment: () => ++current,
    decrement: () => --current,
    getValue: () => current,
  };
}

const counter1 = createCounter(10);
const counter2 = createCounter(50);

counter1.increment();
counter1.increment();
console.log("counter1 value:", counter1.getValue()); // 12
console.log("counter2 value:", counter2.getValue()); // 50 (completely independent memory environment!)

console.log("\n=== 2. Contextual Typing in Closures ===");

const numbers = [10, 20, 30];

// In TypeScript, 'n' is contextually typed as 'number' automatically
// because the outer .map() method signature defines callback: (value: number) => U
const doubled = numbers.map((n) => n * 2);
console.log("Doubled values:", doubled);

console.log("\n=== 3. Higher-Order Functions with Typed Closures ===");

interface MetricEvent {
  eventName: string;
  durationMs: number;
}

function createTelemetryTracker(appName: string) {
  const events: MetricEvent[] = [];

  return function record(eventName: string, durationMs: number): MetricEvent {
    const event: MetricEvent = {
      eventName: `${appName}:${eventName}`,
      durationMs,
    };
    events.push(event);
    return event;
  };
}

const trackApi = createTelemetryTracker("auth-service");
const ev = trackApi("login", 45);
console.log("Recorded event via closure:", ev);
