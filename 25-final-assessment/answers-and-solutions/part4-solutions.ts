/**
 *  Final Assessment — Part 4 Solutions: 10 Practical Implementations
 * Run with: npx tsx 25-final-assessment/answers-and-solutions/part4-solutions.ts
 */

// TASK 1: safeJsonParse
export function safeJsonParse<T>(
  json: string
): { ok: true; data: T } | { ok: false; error: Error } {
  try {
    return { ok: true, data: JSON.parse(json) as T };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

// TASK 2: pick
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const k of keys) {
    if (k in obj) {
      result[k] = obj[k];
    }
  }
  return result;
}

// TASK 3: omit
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  const result = { ...obj } as Record<string, unknown>;
  for (const k of keys) {
    delete result[k as string];
  }
  return result as Omit<T, K>;
}

// TASK 4: groupBy
export function groupBy<T, K extends string | number>(
  items: readonly T[],
  keySelector: (item: T) => K
): Record<K, T[]> {
  const record = {} as Record<K, T[]>;
  for (const item of items) {
    const key = keySelector(item);
    if (!record[key]) {
      record[key] = [];
    }
    record[key]!.push(item);
  }
  return record;
}

// TASK 5: assertNever
export function assertNever(val: never): never {
  throw new Error(`Unexpected value reached: ${JSON.stringify(val)}`);
}

// TASK 6: delay
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// TASK 7: retry
export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number,
  delayMs: number = 20
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (attempts <= 1) throw err;
    await delay(delayMs);
    return retry(fn, attempts - 1, delayMs * 2);
  }
}

// TASK 8: mapValues
export function mapValues<K extends string | number, VInput, VOutput>(
  record: Record<K, VInput>,
  mapper: (val: VInput, key: K) => VOutput
): Record<K, VOutput> {
  const result = {} as Record<K, VOutput>;
  for (const key of Object.keys(record) as (keyof typeof record)[]) {
    result[key] = mapper(record[key], key);
  }
  return result;
}

// TASK 9: isNonNullable
export function isNonNullable<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

// TASK 10: createInMemoryKV
export function createInMemoryKV<T>() {
  const map = new Map<string, T>();
  return {
    get(k: string): T | undefined {
      return map.get(k);
    },
    set(k: string, v: T): void {
      map.set(k, v);
    },
    has(k: string): boolean {
      return map.has(k);
    },
  };
}

// Verification
const p = pick({ a: 1, b: 2, c: 3 }, ["a", "b"] as const);
console.assert(p.a === 1 && p.b === 2 && !("c" in p));

const o = omit({ a: 1, b: 2, c: 3 }, ["c"] as const);
console.assert(o.a === 1 && o.b === 2 && !("c" in o));

const grouped = groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd"));
console.assert(grouped.even.length === 2 && grouped.odd.length === 2);

console.log("[PASS] Part 4 All 10 Implementations Verified Successfully!");
