# Architectural Walkthrough: JavaScript to Production TypeScript

---

## 1. Eliminating Input Mutation
In `legacy-code.js`:
```js
orderData.totalAmount = total; // Mutates caller's memory!
```
In `refactored.ts`, `OrderRequest` has all fields marked `readonly`. TypeScript enforces that `processCustomerOrder` cannot alter the caller's request object. Instead, calculations return a brand new `OrderReceipt`.

---

## 2. Replacing Optional Booleans with Discriminated Unions
In `legacy-code.js`:
```js
{ success: true, data: { status: "completed", charged: total } }
// vs
{ success: true, data: { status: "pending_invoice", netDays: 30 } }
```
In `refactored.ts`, `OrderReceipt` is a discriminated union keyed on `status`:
- When `status === "charged"`, `transactionId` is guaranteed to exist.
- When `status === "invoice_sent"`, `dueInDays` is guaranteed to exist.
The caller never has to check `if (data.transactionId)` because the compiler knows it based on `status`.

---

## 3. Financial Precision
In `legacy-code.js`, float arithmetic (`price * qty`) was used, which causes IEEE 754 floating point rounding bugs (e.g. `$0.10 + $0.20 = $0.30000000000000004`).
In `refactored.ts`, all financial fields are modeled as integer cents (`priceCents`, `totalCents`).

---

## 4. Compile-Time Exhaustiveness
In `refactored.ts`, the `const _exhaustive: never = order.payment;` guard ensures that if an engineer adds `{ method: "crypto" }` to `PaymentDetails` in the future, the compiler will refuse to build until this processor explicitly handles crypto payments.
