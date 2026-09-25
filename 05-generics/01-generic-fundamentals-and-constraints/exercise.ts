/**
 * EXERCISE 05.1: Generic Fundamentals & Constraints
 * Run with: npx tsx 05-generics/01-generic-fundamentals-and-constraints/exercise.ts
 */

export interface TimestampedEntity {
  id: string;
  createdAt: Date;
}

// TASK 1: Implement `updateTimestamp`
// Takes an entity `entity: T` (which must extend `TimestampedEntity`).
// Returns a new object of type `T` where `createdAt` is updated to the current date,
// while preserving all other properties and the exact type `T`.
export function updateTimestamp<T extends TimestampedEntity>(entity: T): T {
  // TODO: Implement
  throw new Error("Not implemented");
}

// TASK 2: Implement generic `ImmutableStack<T>`
// Methods:
// - `push(item: T): ImmutableStack<T>` (returns new stack instance with item on top)
// - `pop(): readonly [T | undefined, ImmutableStack<T>]` (returns popped item and new stack)
// - `peek(): T | undefined`
// - `size(): number`
export class ImmutableStack<T> {
  // TODO: Implement using readonly array
}

function runTests() {
  console.log("Running Exercise 05.1 Tests...");
  interface User extends TimestampedEntity {
    name: string;
    role: string;
  }

  const u: User = { id: "1", createdAt: new Date(0), name: "Karan", role: "admin" };
  const updated = updateTimestamp(u);

  if (updated.name === "Karan" && updated.createdAt.getTime() > 0) {
    console.log("[PASS] Task 1 Passed!");
  } else {
    console.error("[FAIL] Task 1 Failed!");
  }
}

// runTests();
