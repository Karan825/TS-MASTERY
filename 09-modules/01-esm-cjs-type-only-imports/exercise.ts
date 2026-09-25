/**
 * EXERCISE 09.1: ES Modules & Type-Only Imports
 * Run with: npx tsx 09-modules/01-esm-cjs-type-only-imports/exercise.ts
 */

// TASK: Re-export types and values cleanly
// 1. Import `Equal` and `Expect` as type-only from `../../shared/type-utils.js`
// 2. Export an interface `ModuleContract`
// 3. Export a runtime constant `MODULE_VERSION = "1.0.0"`
// 4. Re-export `ModuleContract` as a type-only export

export interface ModuleContract {
  name: string;
}

export const MODULE_VERSION = "1.0.0";

function runTests() {
  console.log("[PASS] Exercise 09.1 structure ready");
}

runTests();
