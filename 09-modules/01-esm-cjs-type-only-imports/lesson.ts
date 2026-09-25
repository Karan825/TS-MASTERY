/**
 * Lesson 09.1: ES Modules & Type-Only Imports
 * Run with: npx tsx 09-modules/01-esm-cjs-type-only-imports/lesson.ts
 */

import type { Equal, Expect } from "../../shared/type-utils.js";

// Multi-type definition
export interface AppEnvironment {
  readonly nodeEnv: string;
  readonly port: number;
}

export const loadConfig = (): AppEnvironment => ({
  nodeEnv: "production",
  port: 8080,
});

// Inline type export
export { type Equal, type Expect };

const cfg = loadConfig();
console.log("Config loaded via ES Module:", cfg);
