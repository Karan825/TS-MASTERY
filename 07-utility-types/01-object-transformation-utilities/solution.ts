/**
 * REFERENCE SOLUTION: Exercise 07.1
 * Object Transformation Utilities Under the Hood
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

// TASK 1 SOLUTION:
export type CustomPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// TASK 2 SOLUTION:
export type CustomOmit<T, K extends keyof any> = CustomPick<T, Exclude<keyof T, K>>;

// TASK 3 SOLUTION:
export type DeepPartial<T> = T extends Function | boolean | number | string | symbol | null | undefined
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : { [K in keyof T]?: DeepPartial<T[K]> };

// Verification
interface Order {
  id: string;
  items: { sku: string; qty: number }[];
  customer: {
    address: {
      city: string;
      zip: string;
    };
  };
}

type _TestPick = Expect<Equal<CustomPick<Order, "id">, Pick<Order, "id">>>;
type _TestOmit = Expect<Equal<CustomOmit<Order, "items">, Omit<Order, "items">>>;

const partialOrder: DeepPartial<Order> = {
  customer: {
    address: {
      city: "San Francisco",
    },
  },
};

console.log("[PASS] Exercise 07.1 Solution Verified Successfully!", partialOrder);
