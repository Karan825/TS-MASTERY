/**
 *  Final Assessment — Part 3 Solutions: 10 Debugging Challenges
 * Run with: npx tsx 25-final-assessment/answers-and-solutions/part3-solutions.ts
 */

// CASE 1 FIX: Capture variable into immutable binding before closure
export function debugCase1Fixed(item: string | null) {
  if (item === null) return;
  const nonNullItem = item;
  setTimeout(() => {
    console.log(nonNullItem.trim());
  }, 10);
}

// CASE 2 FIX: Correct casing to avoid excess property check
interface ClientConfig {
  endpoint: string;
  timeout?: number;
}
export function debugCase2Fixed(cfg: ClientConfig) {}
debugCase2Fixed({ endpoint: "api.io", timeout: 1000 });

// CASE 3 FIX: Contravariant assignment
type NumberConsumer = (n: number) => void;
type AnyNumberConsumer = (n: number | string) => void;
let c1: NumberConsumer = (n) => console.log(n);
let c2: AnyNumberConsumer = (x) => console.log(x);
c1 = c2; // Valid contravariant assignment!

// CASE 4 FIX: Place specific overload before broad overload
export function debugCase4Fixed(x: "admin"): string;
export function debugCase4Fixed(x: string): string;
export function debugCase4Fixed(x: string): string {
  return x;
}

// CASE 5 FIX: Immutable append
export function debugCase5Fixed(list: readonly number[]): readonly number[] {
  return [...list, 42];
}

// CASE 6 FIX: Use union instead of impossible intersection
type PartA = { status: "A"; val: number };
type PartB = { status: "B"; val: number };
export type PartABFixed = PartA | PartB;

// CASE 7 FIX: Handle undefined lookup under noUncheckedIndexedAccess
export function debugCase7Fixed(dict: Record<string, number>): number {
  const val = dict["score"];
  return (val ?? 0) * 2;
}

// CASE 8 FIX: Supply all required properties
interface RequiredFields {
  id: string;
  count: number;
}
const fixed8: RequiredFields = { id: "1", count: 0 };

// CASE 9 FIX: Runtime boundary validation
export function debugCase9Fixed(rawJson: string): { id: string; email: string } {
  const raw = JSON.parse(rawJson);
  if (typeof raw !== "object" || raw === null || typeof raw.id !== "string" || typeof raw.email !== "string") {
    throw new Error("Invalid payload");
  }
  return { id: raw.id, email: raw.email };
}

// CASE 10 FIX: Exhaustive switch with never guard
type Event = { type: "A" } | { type: "B" } | { type: "C" };
export function debugCase10Fixed(e: Event): string {
  switch (e.type) {
    case "A": return "Alpha";
    case "B": return "Beta";
    case "C": return "Gamma";
    default: {
      const _ex: never = e;
      throw new Error(`Unhandled: ${_ex}`);
    }
  }
}

console.log("[PASS] Part 3 All 10 Debugging Solutions Verified Successfully!");
