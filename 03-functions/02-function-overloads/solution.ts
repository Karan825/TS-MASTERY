/**
 * REFERENCE SOLUTION: Exercise 03.2
 * Function Overloads vs Unions vs Generics
 */

export interface QueryOptions {
  limit?: number;
  single?: boolean;
}

export interface UserRow {
  id: string;
  name: string;
}

const MOCK_DB: UserRow[] = [
  { id: "u_1", name: "Alice" },
  { id: "u_2", name: "Bob" },
];

export function findUsers(query: string, options: { single: true }): Promise<UserRow | null>;
export function findUsers(query: string, options?: QueryOptions): Promise<UserRow[]>;
export async function findUsers(
  query: string,
  options?: QueryOptions
): Promise<UserRow | null | UserRow[]> {
  const matches = MOCK_DB.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));

  if (options?.single === true) {
    return matches[0] ?? null;
  }

  const limit = options?.limit ?? 100;
  return matches.slice(0, limit);
}

// Verification
async function verify() {
  // Overload 1: returns UserRow | null
  const single = await findUsers("ali", { single: true });
  console.assert(single !== null && single.name === "Alice");

  // Overload 2: returns UserRow[]
  const list = await findUsers("ali");
  console.assert(Array.isArray(list) && list.length === 1);
  console.log("[PASS] Exercise 03.2 Solution Verified Successfully!");
}

verify();
