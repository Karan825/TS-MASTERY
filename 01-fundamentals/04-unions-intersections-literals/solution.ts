/**
 * REFERENCE SOLUTION: Exercise 01.4
 * Unions, Intersections & Literals
 */

export interface BaseEntity {
  id: string;
  createdAt: Date;
}

export interface SoftDeletable {
  isDeleted: boolean;
  deletedAt?: Date;
}

// TASK 1 SOLUTION:
export type AuditedEntity<T> = BaseEntity & SoftDeletable & T;

// TASK 2 SOLUTION:
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

export function formatPaymentSummary(payment: Payment): string {
  // Discriminated union narrowing:
  switch (payment.kind) {
    case "cash":
      return `Cash: ${payment.amount} ${payment.currency}`;
    case "card":
      return `Card ending in ${payment.lastFourDigits}: ${payment.amount} ${payment.currency}`;
  }
}

// Verification
const cash: Payment = { kind: "cash", amount: 50, currency: "USD" };
const card: Payment = { kind: "card", amount: 150, currency: "EUR", lastFourDigits: "1122" };

console.assert(formatPaymentSummary(cash) === "Cash: 50 USD");
console.assert(formatPaymentSummary(card) === "Card ending in 1122: 150 EUR");
console.log("[PASS] Exercise 01.4 Solution Verified Successfully!");
