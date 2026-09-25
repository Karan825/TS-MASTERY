/**
 * EXERCISE 01.4: Unions, Intersections & Literals
 * Run with: npx tsx 01-fundamentals/04-unions-intersections-literals/exercise.ts
 */

// TASK 1: Define a composable Entity type
// Combine `BaseEntity` and `SoftDeletable` into `AuditedEntity<T>`
export interface BaseEntity {
  id: string;
  createdAt: Date;
}

export interface SoftDeletable {
  isDeleted: boolean;
  deletedAt?: Date;
}

export type AuditedEntity<T> = any; // TODO: Replace 'any' with intersection of BaseEntity, SoftDeletable, and T

// TASK 2: Implement `formatPaymentSummary`
export interface CashPayment {
  kind: "cash";
  amount: number;
  currency: string;
}

export interface CreditCardPayment {
  kind: "card";
  amount: number;
  currency: string;
  lastFourDigits: string;
}

export type Payment = CashPayment | CreditCardPayment;

// Return string format:
// For cash: "Cash: $100 USD"
// For card: "Card ending in 4242: $100 USD"
export function formatPaymentSummary(payment: Payment): string {
  // TODO: Use discriminator 'kind' to narrow payment and format summary
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 01.4 Tests...");
  const cash: Payment = { kind: "cash", amount: 50, currency: "USD" };
  const card: Payment = { kind: "card", amount: 150, currency: "EUR", lastFourDigits: "1122" };

  if (
    formatPaymentSummary(cash) === "Cash: 50 USD" &&
    formatPaymentSummary(card) === "Card ending in 1122: 150 EUR"
  ) {
    console.log("[PASS] Exercise 01.4 Passed!");
  } else {
    console.error("[FAIL] Exercise 01.4 Failed!");
  }
}

// runTests();
