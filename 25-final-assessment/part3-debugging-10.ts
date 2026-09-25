/**
 *  Final Assessment — Part 3: 10 Debugging Challenges
 *
 * For each challenge:
 * 1. Read the error description.
 * 2. Diagnose WHY the TypeScript compiler complains.
 * 3. Write your fix in answers-and-solutions/part3-solutions.ts!
 */

// CASE 1: Closure Narrowing Loss
export function debugCase1(item: string | null) {
  if (item !== null) {
    // Problem: In an async callback, item is flagged as possibly null
    // setTimeout(() => { item.trim(); }, 10);
  }
}

// CASE 2: Excess Property on Call Site Literal
interface ClientConfig {
  endpoint: string;
  timeout?: number;
}
export function debugCase2(cfg: ClientConfig) {}
// Call site error: debugCase2({ endpoint: "api.io", Timeout: 1000 });

// CASE 3: Contravariant Function Assignment
type NumberConsumer = (n: number) => void;
type AnyNumberConsumer = (n: number | string) => void;
let c1: NumberConsumer;
let c2: AnyNumberConsumer = (x) => console.log(x);
// Which way fails?
// c2 = c1; // Fails! Why?

// CASE 4: Overload Order Shadowing
export function debugCase4(x: string): string;
export function debugCase4(x: "admin"): string; // Warning: This overload is shadowed by the broad string overload!
export function debugCase4(x: string): string {
  return x;
}

// CASE 5: Readonly Array Mutation
export function debugCase5(list: readonly number[]) {
  // list.push(42); // Error! How do you add an element immutably?
}

// CASE 6: Impossible Property Intersection
type PartA = { status: "A"; val: number };
type PartB = { status: "B"; val: number };
export type PartAB = PartA & PartB; // PartAB['status'] is never!

// CASE 7: Index Access Undefined under noUncheckedIndexedAccess
export function debugCase7(dict: Record<string, number>): number {
  const val = dict["score"];
  // return val * 2; // Error: 'val' is possibly 'undefined'!
  return (val ?? 0) * 2;
}

// CASE 8: Missing Interface Key in Fresh Assignment
interface RequiredFields {
  id: string;
  count: number;
}
// const bad: RequiredFields = { id: "1" }; // Error: Property 'count' is missing!

// CASE 9: Unsound Type Assertion
export function debugCase9(rawJson: string) {
  const user = JSON.parse(rawJson) as { id: string; email: string };
  // Dangerous: user could be null or lack email!
}

// CASE 10: Discriminated Union Unhandled Case
type Event = { type: "A" } | { type: "B" } | { type: "C" };
export function debugCase10(e: Event): string {
  switch (e.type) {
    case "A": return "Alpha";
    case "B": return "Beta";
    // Missing 'C'!
  }
  // Error: Not all code paths return a value!
  return "";
}

console.log("Part 3 Debugging Challenges Loaded. Solutions in answers-and-solutions/part3-solutions.ts");
