/**
 * EXERCISE 08.1: Classes & Parameter Properties
 * Run with: npx tsx 08-oop/01-classes-access-modifiers-parameter-properties/exercise.ts
 */

// TASK: Implement `BankAccount`
// Requirements:
// 1. Parameter properties: `public readonly accountId: string`, `public readonly ownerName: string`.
// 2. Private state: `#balance: number` (initialized to `initialBalance: number` in constructor).
// 3. Methods:
//    - `getBalance(): number`
//    - `deposit(amount: number): void` (must reject <= 0 amounts)
//    - `withdraw(amount: number): boolean` (returns true if sufficient funds, false otherwise)
export class BankAccount {
  // TODO: Implement using parameter properties and #private balance
}

function runTests() {
  console.log("Running Exercise 08.1 Tests...");
  // @ts-ignore
  const acc = new BankAccount("acc_1", "Alice", 100);
  // @ts-ignore
  if (typeof acc.deposit === "function") {
    console.log("[PASS] Exercise 08.1 structure present");
  }
}

// runTests();
