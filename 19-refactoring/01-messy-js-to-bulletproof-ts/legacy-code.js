/**
 * LEGACY CODEBASE: Order & Billing Processor (Vanilla JS)
 * Notice the hazards:
 * 1. Bag-of-optionals state (status, isPaid, error, invoiceId can be anything)
 * 2. Unsafe property mutations
 * 3. Implicit assumptions about input shapes
 * 4. Silent failures and lack of validation
 */

function processCustomerOrder(orderData) {
  // Bug 1: No input validation
  const orderId = orderData.id;
  const items = orderData.items;

  let total = 0;
  for (let i = 0; i < items.length; i++) {
    // Bug 2: Assuming item.price is always number
    total += items[i].price * items[i].qty;
  }

  // Bug 3: Mutating the caller's input object!
  orderData.totalAmount = total;

  if (orderData.paymentMethod === "card") {
    if (orderData.cardNumber.length < 16) {
      return { success: false, err: "Invalid card" };
    }
    // Bug 4: Inconsistent return shape
    return {
      success: true,
      data: { orderId: orderId, status: "completed", charged: total }
    };
  } else if (orderData.paymentMethod === "invoice") {
    return {
      success: true,
      data: { orderId: orderId, status: "pending_invoice", netDays: 30 }
    };
  }

  return { success: false, err: "Unknown payment method" };
}

module.exports = { processCustomerOrder };
