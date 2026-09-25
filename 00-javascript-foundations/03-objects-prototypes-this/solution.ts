/**
 * REFERENCE SOLUTION: Exercise 00.3
 * Prototypes & 'this' Safety
 */

export interface TransactionContext {
  txId: string;
  isCommitted: boolean;
  commit(this: TransactionContext): void;
  rollback(this: TransactionContext): void;
}

export function createTransaction(txId: string): TransactionContext {
  return {
    txId,
    isCommitted: false,
    commit(this: TransactionContext) {
      this.isCommitted = true;
    },
    rollback(this: TransactionContext) {
      this.isCommitted = false;
    },
  };
}

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

  orderBy(column: string): this {
    this.orderColumn = column;
    return this;
  }

  override getSql(): string {
    return `${super.getSql()} ORDER BY ${this.orderColumn}`;
  }
}

// Verification
const tx = createTransaction("tx_01");
tx.commit();
console.assert(tx.isCommitted === true);

const query = new OrderedQueryBuilder().table("users").orderBy("created_at").getSql();
console.assert(query === "FROM users ORDER BY created_at");
console.log("[PASS] Exercise 00.3 Solution Verified Successfully!");
