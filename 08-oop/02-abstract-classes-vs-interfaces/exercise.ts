/**
 * EXERCISE 08.2: Abstract Classes vs Interfaces
 * Run with: npx tsx 08-oop/02-abstract-classes-vs-interfaces/exercise.ts
 */

export interface PaymentRequest {
  amount: number;
  currency: string;
}

export interface PaymentReceipt {
  transactionId: string;
  success: boolean;
  timestamp: Date;
}

// TASK: Implement `BasePaymentGateway` (Abstract Class) and `StripeGateway` (Concrete Class)
// BasePaymentGateway:
// - `process(req: PaymentRequest): Promise<PaymentReceipt>`:
//   1. validates that amount > 0 (throws Error if not)
//   2. calls abstract `executeTransaction(req: PaymentRequest): Promise<string>`
//   3. returns PaymentReceipt with the generated transactionId, success: true, timestamp: new Date()
export abstract class BasePaymentGateway {
  // TODO: Implement
}

export class StripeGateway extends BasePaymentGateway {
  // TODO: Implement executeTransaction
}

function runTests() {
  console.log("Running Exercise 08.2 Tests...");
}

// runTests();
