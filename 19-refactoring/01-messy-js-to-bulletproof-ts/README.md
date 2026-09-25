# Level 19: Refactoring JavaScript to Production TypeScript

## Objective
Transform the fragile legacy JavaScript file [`legacy-code.js`](./legacy-code.js) into a bulletproof, strictly typed TypeScript module [`refactored.ts`](./refactored.ts).

---

## The Refactoring Checklist
1. **Model Domain Entities**:
   - Split payment methods into a **Discriminated Union** (`CardPayment` vs `InvoicePayment`).
   - Create explicit types for `OrderItem` and `OrderRequest`.
2. **Eliminate Input Mutation**:
   - Never mutate caller objects! Return a new immutable result.
3. **Establish Type Boundaries**:
   - Validate incoming data and guard against `null`/`undefined`.
4. **Use Result Pattern**:
   - Replace inconsistent `{ success: false, err }` shapes with a standard `Result<OrderReceipt, OrderError>`.
5. **Enforce Immutability**:
   - Use `readonly` across entity properties.

---

## 📖 Walkthrough
After attempting the refactoring, read [`walkthrough.md`](./walkthrough.md) for architectural commentary on every design choice.
