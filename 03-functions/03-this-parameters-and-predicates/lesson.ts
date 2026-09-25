/**
 * Lesson 03.3: 'this' Parameters, Type Predicates & Typed Error Patterns
 * Run with: npx tsx 03-functions/03-this-parameters-and-predicates/lesson.ts
 */

console.log("=== 1. Typed Error Handling via Result Monad ===");

export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

interface User {
  id: string;
  name: string;
}

function parseUserPayload(raw: string): Result<User, string> {
  try {
    const data = JSON.parse(raw);
    if (!data.id || !data.name) {
      return err("Missing 'id' or 'name' in user payload");
    }
    return ok({ id: data.id, name: data.name });
  } catch {
    return err("Malformed JSON input");
  }
}

const successCase = parseUserPayload('{"id": "u_1", "name": "Karan"}');
if (successCase.ok) {
  console.log("Parsed user successfully:", successCase.value.name);
} else {
  console.error("Error occurred:", successCase.error);
}

const failureCase = parseUserPayload("invalid json string");
if (!failureCase.ok) {
  console.log("Caught expected error safely:", failureCase.error);
}
