/**
 * Lesson 06.4: Template Literals & Branded Types
 * Run with: npx tsx 06-advanced-types/04-template-literals-and-branded-types/lesson.ts
 */

console.log("=== 1. Template Literal Types ===");

type EventDomain = "order" | "invoice" | "customer";
type EventAction = "created" | "updated" | "deleted";

type DomainEvent = `${EventDomain}.${EventAction}`;
// "order.created" | "order.updated" | ... (9 permutations)

function emitDomainEvent(event: DomainEvent) {
  console.log("Emitting type-checked event:", event);
}

emitDomainEvent("invoice.created");

console.log("\n=== 2. Branded Types in Production ===");

declare const BrandTag: unique symbol;
export type Brand<T, B extends string> = T & { readonly [BrandTag]: B };

export type AccountId = Brand<string, "AccountId">;
export type InvoiceId = Brand<string, "InvoiceId">;

// Smart constructor
function parseAccountId(raw: string): AccountId {
  if (!raw.startsWith("acc_")) {
    throw new Error(`Invalid Account ID format: ${raw}`);
  }
  return raw as AccountId;
}

function processAccountBilling(id: AccountId) {
  console.log("Processing billing for account:", id);
}

const validAccount = parseAccountId("acc_88192");
processAccountBilling(validAccount);

// [FAIL] If we had an invoice ID:
// const inv = "inv_123" as InvoiceId;
// processAccountBilling(inv); // Compile-time error! Types are distinct!
