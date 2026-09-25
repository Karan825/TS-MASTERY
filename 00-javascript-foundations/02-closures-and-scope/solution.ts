/**
 * REFERENCE SOLUTION: Exercise 00.2
 * Closures, Lexical Scope & Encapsulation
 */

export interface TokenBucket {
  consume(tokens: number): boolean;
  getRemainingTokens(): number;
  refill(): void;
}

export function createTokenBucket(maxCapacity: number): TokenBucket {
  // Enclosed state in the function's lexical scope:
  let tokens = maxCapacity;

  return {
    consume(requested: number): boolean {
      if (requested <= 0) return true;
      if (tokens >= requested) {
        tokens -= requested;
        return true;
      }
      return false;
    },

    getRemainingTokens(): number {
      return tokens;
    },

    refill(): void {
      tokens = maxCapacity;
    },
  };
}

// Verification
const bucket = createTokenBucket(10);
console.assert(bucket.getRemainingTokens() === 10);
console.assert(bucket.consume(4) === true);
console.assert(bucket.getRemainingTokens() === 6);
console.assert(bucket.consume(7) === false);
bucket.refill();
console.assert(bucket.getRemainingTokens() === 10);
console.log("[PASS] Exercise 00.2 Solution Verified!");
