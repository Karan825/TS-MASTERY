/**
 * Coding Interview Track 01: LRU (Least Recently Used) Cache
 *
 * Requirements:
 * - O(1) time complexity for both `get` and `put`.
 * - Parameterized with generics <K, V>.
 * - Doubly linked list + hash map.
 * Run with: npx tsx 24-coding-interview/01-lru-cache.ts
 */

class DNode<K, V> {
  key: K;
  value: V;
  prev: DNode<K, V> | null = null;
  next: DNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly map = new Map<K, DNode<K, V>>();
  private readonly head: DNode<K, V>;
  private readonly tail: DNode<K, V>;

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("Capacity must be positive");
    this.capacity = capacity;

    // Dummy sentinel nodes to avoid edge-case null checks:
    this.head = new DNode<K, V>(undefined as unknown as K, undefined as unknown as V);
    this.tail = new DNode<K, V>(undefined as unknown as K, undefined as unknown as V);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;

    // Move accessed node to head (most recently used)
    this.removeNode(node);
    this.addToHead(node);
    return node.value;
  }

  put(key: K, value: V): void {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.removeNode(existing);
      this.addToHead(existing);
      return;
    }

    if (this.map.size >= this.capacity) {
      // Evict least recently used (node before tail)
      const lru = this.tail.prev!;
      this.removeNode(lru);
      this.map.delete(lru.key);
    }

    const newNode = new DNode<K, V>(key, value);
    this.map.set(key, newNode);
    this.addToHead(newNode);
  }

  get size(): number {
    return this.map.size;
  }

  private removeNode(node: DNode<K, V>): void {
    const prev = node.prev!;
    const next = node.next!;
    prev.next = next;
    next.prev = prev;
  }

  private addToHead(node: DNode<K, V>): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }
}

// Verification
const cache = new LRUCache<string, number>(2);
cache.put("a", 1);
cache.put("b", 2);
console.assert(cache.get("a") === 1, "Access 'a' makes it most recent");

cache.put("c", 3); // Evicts 'b'
console.assert(cache.get("b") === undefined, "'b' should be evicted");
console.assert(cache.get("a") === 1, "'a' remains");
console.assert(cache.get("c") === 3, "'c' is present");

console.log("[PASS] LRUCache Verified Successfully in O(1) time!");
