/**
 * EXERCISE 14.1: Type-Safe API Design & DTOs
 * Run with: npx tsx 14-api-design/01-type-safe-contracts-and-dtos/exercise.ts
 */

export interface ProductEntity {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  stockCount: number;
  internalSupplierCost: number;
}

// TASK 1: Create `CreateProductDto`
// Excludes `id`, requires all other fields except `stockCount` (which defaults to optional).
export type CreateProductDto = any; // TODO: Implement

// TASK 2: Create `PublicProductDto`
// Must exclude `internalSupplierCost` to prevent leaking confidential margins.
export type PublicProductDto = any; // TODO: Implement

function runTests() {
  console.log("Run solution.ts for verification");
}

// runTests();
