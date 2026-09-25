/**
 * REFERENCE SOLUTION: Exercise 14.1
 * Type-Safe API Design & DTOs
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

export interface ProductEntity {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  stockCount: number;
  internalSupplierCost: number;
}

// TASK 1 SOLUTION:
export type CreateProductDto = Omit<ProductEntity, "id" | "stockCount"> & {
  stockCount?: number;
};

// TASK 2 SOLUTION:
export type PublicProductDto = Omit<ProductEntity, "internalSupplierCost">;

// Verification
const publicProd: PublicProductDto = {
  id: "p_1",
  sku: "SKU-99",
  name: "Keyboard",
  priceCents: 9900,
  stockCount: 15,
};

// Verify internalSupplierCost is omitted:
// @ts-expect-error
const _invalidSupplierCost = publicProd.internalSupplierCost;

console.log("[PASS] Exercise 14.1 Solution Verified Successfully!", publicProd.name);
