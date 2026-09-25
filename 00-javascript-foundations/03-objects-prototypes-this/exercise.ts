/**
 * EXERCISE 00.3: Prototypes & 'this' Safety
 * Run with: npx tsx 00-javascript-foundations/03-objects-prototypes-this/exercise.ts
 */

export interface TransactionContext {
  txId: string;
  isCommitted: boolean;
  commit(this: TransactionContext): void;
  rollback(this: TransactionContext): void;
}

// TASK 1: Implement createTransaction
// Creates and returns a TransactionContext object with `txId` initialized,
// `isCommitted` set to false, and methods `commit` and `rollback` enforcing
// the `this: TransactionContext` compile-time parameter.
export function createTransaction(txId: string): TransactionContext {
  // TODO: Implement
  throw new Error("Not implemented");
}

// TASK 2: Subclass FluentBuilder
// Create `OrderedQueryBuilder` extending `BaseQueryBuilder` that adds an `.orderBy(column: string)` method,
// ensuring the method returns polymorphic `this` so chaining works cleanly with parent methods.
export class BaseQueryBuilder {
  protected tableName: string = "";

  table(name: string): this {
    this.tableName = name;
    return this;
  }

  getSql(): string {
    return `FROM ${this.tableName}`;
  }
}

export class OrderedQueryBuilder extends BaseQueryBuilder {
  protected orderColumn: string = "";

  // TODO: Add orderBy(column: string): this
}

function runTests() {
  console.log("Running Exercise 00.3 Tests...");
  try {
    const tx = createTransaction("tx_99");
    if (tx.isCommitted) throw new Error("Should start uncommitted");
    tx.commit();
    if (!tx.isCommitted) throw new Error("Commit failed");
    console.log("[PASS] Task 1 Passed!");
  } catch (err: any) {
    console.error("[FAIL] Task 1 Failed:", err.message);
  }
}

// runTests();
