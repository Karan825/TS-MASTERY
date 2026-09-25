/**
 * Lesson 05.1: Generic Fundamentals & Constraints
 * Run with: npx tsx 05-generics/01-generic-fundamentals-and-constraints/lesson.ts
 */

console.log("=== 1. Preserving Relationships with Generics ===");

// Preserves the EXACT type of the argument:
function identity<T>(value: T): T {
  return value;
}

const str = identity("hello"); // Inferred as "hello" (or string)
const num = identity(42);      // Inferred as 42 (or number)
console.log({ str, num });

console.log("\n=== 2. Generic Constraints with 'extends' ===");

interface HasLength {
  length: number;
}

// T must satisfy HasLength: string, Array, Map, etc.
function logWithLength<T extends HasLength>(item: T): T {
  console.log(`Length is: ${item.length}`);
  return item; // Preserves the exact subtype T!
}

logWithLength("TypeScript Mastery");
logWithLength([10, 20, 30, 40]);

console.log("\n=== 3. Generic Classes ===");

class StateContainer<T> {
  private state: T;

  constructor(initial: T) {
    this.state = initial;
  }

  get(): T {
    return this.state;
  }

  set(next: T): void {
    this.state = next;
  }
}

const numContainer = new StateContainer<number>(100);
numContainer.set(250);
console.log("Container value:", numContainer.get());
