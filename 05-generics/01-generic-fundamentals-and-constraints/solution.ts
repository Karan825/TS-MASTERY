/**
 * REFERENCE SOLUTION: Exercise 05.1
 * Generic Fundamentals & Constraints
 */

export interface TimestampedEntity {
  id: string;
  createdAt: Date;
}

export function updateTimestamp<T extends TimestampedEntity>(entity: T): T {
  // Returns new shallow clone with updated createdAt, preserving exact type T:
  return {
    ...entity,
    createdAt: new Date(),
  };
}

export class ImmutableStack<T> {
  private readonly items: readonly T[];

  constructor(initialItems: readonly T[] = []) {
    this.items = initialItems;
  }

  push(item: T): ImmutableStack<T> {
    return new ImmutableStack<T>([item, ...this.items]);
  }

  pop(): readonly [T | undefined, ImmutableStack<T>] {
    if (this.items.length === 0) {
      return [undefined, this] as const;
    }
    const [top, ...rest] = this.items;
    return [top, new ImmutableStack<T>(rest)] as const;
  }

  peek(): T | undefined {
    return this.items[0];
  }

  size(): number {
    return this.items.length;
  }
}

// Verification
interface User extends TimestampedEntity {
  name: string;
}

const originalUser: User = { id: "u_1", createdAt: new Date(0), name: "Karan" };
const updated = updateTimestamp(originalUser);
console.assert(updated.name === "Karan");
console.assert(updated.createdAt.getTime() > 0);

const s1 = new ImmutableStack<number>();
const s2 = s1.push(10).push(20);
console.assert(s2.size() === 2);
console.assert(s2.peek() === 20);

const [popped, s3] = s2.pop();
console.assert(popped === 20);
console.assert(s3.size() === 1);
console.log("[PASS] Exercise 05.1 Solution Verified Successfully!");
