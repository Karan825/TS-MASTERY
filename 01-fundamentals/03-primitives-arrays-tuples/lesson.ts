/**
 * Lesson 01.3: Primitives, Arrays & Tuples
 * Run with: npx tsx 01-fundamentals/03-primitives-arrays-tuples/lesson.ts
 */

console.log("=== 1. Tuples vs Arrays ===");

// Homogeneous Array: length can vary
const scores: number[] = [95, 88, 72];
scores.push(100);

// Heterogeneous Labeled Tuple: length and types per index are fixed
type EndpointResult = readonly [statusCode: number, payload: string, isCached: boolean];

const result: EndpointResult = [200, '{"data": "ok"}', true];

const [statusCode, payload, isCached] = result;
console.log({ statusCode, payload, isCached });

console.log("\n=== 2. Variadic Tuple Types (Rest Elements) ===");

// A tuple with leading string, followed by any number of numbers
type EventMetric = [eventName: string, ...values: number[]];

const latencyMetric: EventMetric = ["db_query", 12, 14, 11, 15];
console.log("Metric name:", latencyMetric[0]);
console.log("Recorded values:", latencyMetric.slice(1));
