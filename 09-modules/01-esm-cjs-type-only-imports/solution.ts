/**
 * REFERENCE SOLUTION: Exercise 09.1
 * ES Modules & Type-Only Imports
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

interface ModuleContract {
  name: string;
}

export const MODULE_VERSION = "1.0.0";

// Re-export as type-only:
export type { ModuleContract };

// Type check:
type _Test = Expect<Equal<typeof MODULE_VERSION, "1.0.0">>;

console.log("[PASS] Exercise 09.1 Solution Verified Successfully! Module version:", MODULE_VERSION);
