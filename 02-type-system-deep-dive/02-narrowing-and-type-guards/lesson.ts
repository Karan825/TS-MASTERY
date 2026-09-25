/**
 * Lesson 02.2: Narrowing, Control-Flow Analysis & Type Predicates
 * Run with: npx tsx 02-type-system-deep-dive/02-narrowing-and-type-guards/lesson.ts
 */

console.log("=== 1. Control-Flow Analysis with Built-in Guards ===");

function formatMetric(val: string | number | Date | null): string {
  if (val === null) {
    return "N/A"; // val is null
  }

  if (typeof val === "number") {
    return val.toFixed(2); // val is number
  }

  if (typeof val === "string") {
    return val.toUpperCase(); // val is string
  }

  // Compiler knows only Date remains!
  return val.toISOString();
}

console.log("Number metric:", formatMetric(3.14159));
console.log("Date metric:", formatMetric(new Date()));

console.log("\n=== 2. Custom Type Predicates in Collection Filtering ===");

const rawList: (string | null | undefined)[] = ["alpha", null, "beta", undefined, "gamma"];

function isNonNullable<T>(item: T | null | undefined): item is T {
  return item !== null && item !== undefined;
}

// Result is inferred as string[], NOT (string | null | undefined)[]
const cleanList: string[] = rawList.filter(isNonNullable);
console.log("Filtered clean list:", cleanList);

console.log("\n=== 3. Assertion Functions ===");

interface ValidatedUser {
  id: string;
  token: string;
}

function assertValidSession(user: unknown): asserts user is ValidatedUser {
  if (
    typeof user !== "object" ||
    user === null ||
    !("id" in user) ||
    !("token" in user)
  ) {
    throw new Error("Invalid session token payload");
  }
}

const candidate: unknown = { id: "u_99", token: "tok_secure_123" };
assertValidSession(candidate);
// From here down, TypeScript knows candidate is ValidatedUser!
console.log("Session verified:", candidate.id, candidate.token);
