/**
 * EXERCISE 03.3: 'this' Parameters, Type Predicates & Result Pattern
 * Run with: npx tsx 03-functions/03-this-parameters-and-predicates/exercise.ts
 */

export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export interface ConfigFile {
  version: number;
  environment: "dev" | "prod";
}

// TASK 1: Implement `isConfigFile` custom type predicate
// Validates whether an unknown value is a valid ConfigFile object.
export function isConfigFile(val: unknown): val is ConfigFile {
  // TODO: Implement safe runtime validation
  throw new Error("Not implemented");
}

// TASK 2: Implement `parseConfigFile` using Result pattern
// Parse JSON and validate structure using `isConfigFile`.
// If JSON parsing fails: return err("JSON_PARSE_ERROR")
// If structure validation fails: return err("INVALID_SCHEMA")
// If valid: return ok(parsedConfig)
export function parseConfigFile(jsonString: string): Result<ConfigFile, "JSON_PARSE_ERROR" | "INVALID_SCHEMA"> {
  // TODO: Implement
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 03.3 Tests...");
  const valid = '{"version": 1, "environment": "prod"}';
  const res = parseConfigFile(valid);
  if (res.ok && res.value.environment === "prod") {
    console.log("[PASS] Exercise 03.3 Passed!");
  } else {
    console.error("[FAIL] Exercise 03.3 Failed!");
  }
}

// runTests();
