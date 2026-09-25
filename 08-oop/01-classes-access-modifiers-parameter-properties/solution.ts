/**
 * REFERENCE SOLUTION: Exercise 08.1
 * Classes & Parameter Properties
 */

export class BankAccount {
  #balance: number;

  constructor(
    public readonly accountId: string,
    public readonly ownerName: string,
    initialBalance: number
  ) {
    if (initialBalance < 0) {
      throw new Error("Initial balance cannot be negative");
    }
    this.#balance = initialBalance;
  }

  getBalance(): number {
    return this.#balance;
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
    this.#balance += amount;
  }

  withdraw(amount: number): boolean {
    if (amount <= 0 || amount > this.#balance) {
      return false;
    }
    this.#balance -= amount;
    return true;
  }
}

// Verification
const acc = new BankAccount("acc_99", "Alice", 100);
console.assert(acc.accountId === "acc_99");
console.assert(acc.getBalance() === 100);

acc.deposit(50);
console.assert(acc.getBalance() === 150);

const ok = acc.withdraw(40);
console.assert(ok === true);
console.assert(acc.getBalance() === 110);

const failed = acc.withdraw(1000);
console.assert(failed === false);
console.assert(acc.getBalance() === 110);

console.log("[PASS] Exercise 08.1 Solution Verified Successfully!");
