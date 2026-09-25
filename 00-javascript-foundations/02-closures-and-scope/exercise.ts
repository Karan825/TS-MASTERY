/**
 * EXERCISE 00.2: Closures, Lexical Scope & Encapsulation
 * Run with: npx tsx 00-javascript-foundations/02-closures-and-scope/exercise.ts
 */

export interface TokenBucket {
  consume(tokens: number): boolean;
  getRemainingTokens(): number;
  refill(): void;
}

// TASK: Implement createTokenBucket
// Requirements:
// 1. Initial capacity is given by `maxCapacity`.
// 2. Starts full with `maxCapacity` tokens.
// 3. `consume(tokens)` checks if enough tokens exist:
//    - If yes: subtracts tokens, returns true.
//    - If not: returns false without modifying tokens.
// 4. `refill()` restores tokens back to `maxCapacity`.
// 5. The variable holding the token count MUST be private via closure.
export function createTokenBucket(maxCapacity: number): TokenBucket {
  // TODO: Implement using closure
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 00.2 Tests...");
  try {
    const bucket = createTokenBucket(10);
    if (bucket.getRemainingTokens() !== 10) throw new Error("Initial capacity wrong");
    if (!bucket.consume(4)) throw new Error("Should consume 4 tokens");
    if (bucket.getRemainingTokens() !== 6) throw new Error("Remaining should be 6");
    if (bucket.consume(7)) throw new Error("Should not allow overconsumption");
    bucket.refill();
    if (bucket.getRemainingTokens() !== 10) throw new Error("Refill failed");
    console.log("[PASS] Exercise 00.2 Passed!");
  } catch (err: any) {
    console.error("[FAIL] Exercise 00.2 Failed:", err.message);
  }
}

// Uncomment to run:
// runTests();
