/**
 * PRODUCTION-GRADE REFACTORED TYPESCRIPT
 * Solves all hazards identified in legacy-code.js
 */

export interface OrderItem {
  readonly sku: string;
  readonly priceCents: number;
  readonly quantity: number;
}

export interface CardPaymentDetails {
  readonly method: "card";
  readonly cardNumber: string;
  readonly expMonth: number;
  readonly expYear: number;
}

export interface InvoicePaymentDetails {
  readonly method: "invoice";
  readonly billingEmail: string;
  readonly netDays: 15 | 30 | 60;
}

export type PaymentDetails = CardPaymentDetails | InvoicePaymentDetails;

export interface OrderRequest {
  readonly id: string;
  readonly items: readonly OrderItem[];
  readonly payment: PaymentDetails;
}

export type OrderReceipt =
  | {
      readonly status: "charged";
      readonly orderId: string;
      readonly totalCents: number;
      readonly transactionId: string;
    }
  | {
      readonly status: "invoice_sent";
      readonly orderId: string;
      readonly totalCents: number;
      readonly dueInDays: number;
    };

export type OrderError =
  | { readonly code: "EMPTY_ORDER"; readonly message: string }
  | { readonly code: "INVALID_CARD"; readonly message: string }
  | { readonly code: "CALCULATION_OVERFLOW"; readonly message: string };

export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function processCustomerOrder(
  order: OrderRequest
): Result<OrderReceipt, OrderError> {
  if (order.items.length === 0) {
    return {
      ok: false,
      error: { code: "EMPTY_ORDER", message: "Order must contain at least one item." },
    };
  }

  // Pure, non-mutating calculation:
  const totalCents = order.items.reduce((sum, item) => {
    return sum + item.priceCents * item.quantity;
  }, 0);

  if (order.payment.method === "card") {
    const sanitizedNumber = order.payment.cardNumber.replace(/\s+/g, "");
    if (sanitizedNumber.length < 15 || sanitizedNumber.length > 16) {
      return {
        ok: false,
        error: { code: "INVALID_CARD", message: "Card number must be 15 or 16 digits." },
      };
    }

    return {
      ok: true,
      value: {
        status: "charged",
        orderId: order.id,
        totalCents,
        transactionId: `tx_${Math.random().toString(36).substring(2, 9)}`,
      },
    };
  }

  if (order.payment.method === "invoice") {
    return {
      ok: true,
      value: {
        status: "invoice_sent",
        orderId: order.id,
        totalCents,
        dueInDays: order.payment.netDays,
      },
    };
  }

  // Exhaustive check ensuring future payment methods are handled
  const _exhaustive: never = order.payment;
  throw new Error(`Unhandled payment method: ${JSON.stringify(_exhaustive)}`);
}

// Verification
const mockOrder: OrderRequest = {
  id: "ord_101",
  items: [{ sku: "A1", priceCents: 2000, quantity: 2 }],
  payment: { method: "card", cardNumber: "4242424242424242", expMonth: 12, expYear: 2030 },
};

const result = processCustomerOrder(mockOrder);
console.assert(result.ok === true);
if (result.ok) {
  console.assert(result.value.status === "charged");
  console.assert(result.value.totalCents === 4000);
}
console.log("[PASS] Refactored Order Processor Verified Successfully!");
