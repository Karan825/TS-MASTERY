/**
 * REFERENCE SOLUTION: Exercise 08.2
 * Abstract Classes vs Interfaces
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

export abstract class BasePaymentGateway {
  async process(req: PaymentRequest): Promise<PaymentReceipt> {
    if (req.amount <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }

    const txId = await this.executeTransaction(req);

    return {
      transactionId: txId,
      success: true,
      timestamp: new Date(),
    };
  }

  protected abstract executeTransaction(req: PaymentRequest): Promise<string>;
}

export class StripeGateway extends BasePaymentGateway {
  protected async executeTransaction(req: PaymentRequest): Promise<string> {
    return `stripe_ch_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Verification
async function verify() {
  const gateway = new StripeGateway();
  const receipt = await gateway.process({ amount: 150, currency: "USD" });
  console.assert(receipt.success === true);
  console.assert(receipt.transactionId.startsWith("stripe_ch_"));
  console.log("[PASS] Exercise 08.2 Solution Verified Successfully!");
}

verify();
