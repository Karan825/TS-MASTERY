/**
 * REFERENCE SOLUTION: Exercise 03.3
 * 'this' Parameters, Type Predicates & Result Pattern
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

export function isConfigFile(val: unknown): val is ConfigFile {
  if (typeof val !== "object" || val === null) {
    return false;
  }
  const candidate = val as Record<string, unknown>;
  const hasValidVersion = typeof candidate.version === "number" && Number.isFinite(candidate.version);
  const hasValidEnv = candidate.environment === "dev" || candidate.environment === "prod";

  return hasValidVersion && hasValidEnv;
}

export function parseConfigFile(
  jsonString: string
): Result<ConfigFile, "JSON_PARSE_ERROR" | "INVALID_SCHEMA"> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return err("JSON_PARSE_ERROR");
  }

  if (!isConfigFile(parsed)) {
    return err("INVALID_SCHEMA");
  }

  return ok(parsed);
}

// Verification
const resSuccess = parseConfigFile('{"version": 1, "environment": "prod"}');
console.assert(resSuccess.ok === true && resSuccess.value.version === 1);

const resBadJson = parseConfigFile('{invalid json}');
console.assert(resBadJson.ok === false && resBadJson.error === "JSON_PARSE_ERROR");

const resBadSchema = parseConfigFile('{"version": "one", "environment": "prod"}');
console.assert(resBadSchema.ok === false && resBadSchema.error === "INVALID_SCHEMA");

console.log("[PASS] Exercise 03.3 Solution Verified Successfully!");
