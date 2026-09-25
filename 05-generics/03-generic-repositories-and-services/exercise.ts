/**
 * EXERCISE 05.3: Generic Repositories & Services
 * Run with: npx tsx 05-generics/03-generic-repositories-and-services/exercise.ts
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

// TASK: Implement `GenericPaginatedStore<T extends BaseRecord>`
// Methods:
// - `insert(item: T): void`
// - `query(pagination: PaginatedQuery): PaginatedResult<T>`
//   - page starts at 1.
//   - slice items correctly based on (page - 1) * pageSize to page * pageSize.
export class GenericPaginatedStore<T extends BaseRecord> {
  // TODO: Implement
}

function runTests() {
  console.log("Running Exercise 05.3 Tests...");
  interface UserRecord extends BaseRecord {
    username: string;
  }

  const store = new GenericPaginatedStore<UserRecord>();
  // @ts-ignore
  if (typeof store.insert !== "function") {
    console.error("[FAIL] insert method missing");
    return;
  }
}

// runTests();
