/**
 * EXERCISE 12.1: Error Handling & Unknown Errors
 * Run with: npx tsx 12-error-handling/01-result-patterns-and-unknown-errors/exercise.ts
 */

export interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL: string;
}

// TASK: Implement `loadEnvConfig`
// Accepts an environment dictionary `env: Record<string, string | undefined>`.
// Validates:
// - PORT exists and parses to positive integer.
// - NODE_ENV is one of "development" | "production" | "test".
// - DATABASE_URL exists and is non-empty.
// If any validation fails, throws an Error listing ALL missing/invalid variables.
// If valid, returns typed `EnvConfig`.
export function loadEnvConfig(env: Record<string, string | undefined>): EnvConfig {
  // TODO: Implement
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 12.1 Tests...");
  const valid = {
    PORT: "3000",
    NODE_ENV: "production",
    DATABASE_URL: "postgres://localhost/main",
  };

  try {
    const cfg = loadEnvConfig(valid);
    if (cfg.PORT === 3000 && cfg.NODE_ENV === "production") {
      console.log("[PASS] Exercise 12.1 Passed!");
    }
  } catch (err: any) {
    console.error("[FAIL] Exercise 12.1 Failed:", err.message);
  }
}

// runTests();
