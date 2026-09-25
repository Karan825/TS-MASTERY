/**
 * REFERENCE SOLUTION: Exercise 05.3
 * Generic Repositories & Services
 */

export interface BaseRecord {
  id: string;
}

export interface PaginatedQuery {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export class GenericPaginatedStore<T extends BaseRecord> {
  private readonly records = new Map<string, T>();

  insert(item: T): void {
    this.records.set(item.id, item);
  }

  query(pagination: PaginatedQuery): PaginatedResult<T> {
    const all = Array.from(this.records.values());
    const page = Math.max(1, pagination.page);
    const pageSize = Math.max(1, pagination.pageSize);

    const start = (page - 1) * pageSize;
    const paginatedItems = all.slice(start, start + pageSize);

    return {
      items: paginatedItems,
      total: all.length,
      page,
      pageSize,
    };
  }
}

// Verification
interface UserRecord extends BaseRecord {
  username: string;
}

const store = new GenericPaginatedStore<UserRecord>();
store.insert({ id: "1", username: "alice" });
store.insert({ id: "2", username: "bob" });
store.insert({ id: "3", username: "charlie" });

const page1 = store.query({ page: 1, pageSize: 2 });
console.assert(page1.total === 3);
console.assert(page1.items.length === 2);
console.assert(page1.items[0]?.username === "alice");

const page2 = store.query({ page: 2, pageSize: 2 });
console.assert(page2.items.length === 1);
console.assert(page2.items[0]?.username === "charlie");
console.log("[PASS] Exercise 05.3 Solution Verified Successfully!");
