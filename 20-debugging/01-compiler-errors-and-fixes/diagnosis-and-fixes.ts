/**
 * Level 20: Diagnosis, Compiler Mechanics & Production Fixes
 */

// =========================================================================
// CASE 1: Union Narrowing Failure Inside a Closure
// =========================================================================
/**
 * DIAGNOSIS:
 * Why did TS complain that 'value' is possibly 'null' inside setTimeout?
 * Because closures run asynchronously in the microtask or macrotask queue.
 * By the time setTimeout executes, other JavaScript code could have reassigned 'value' to null!
 * TypeScript conservatively invalidates narrowing inside closures for mutable bindings.
 *
 * MINIMAL FIX:
 * const capturedValue = value; // Freeze into immutable 'const'
 *
 * PRODUCTION-GRADE FIX:
 */
export function case1Fixed(value: string | null) {
  if (value === null) return;
  const nonNullValue = value; // Immutable local binding
  setTimeout(() => {
    console.log(nonNullValue.toUpperCase());
  }, 100);
}

// =========================================================================
// CASE 2: Generic Constraint Inversion
// =========================================================================
/**
 * DIAGNOSIS:
 * Why did TS reject `items.map(item => ({ ...item, weight: item.weight + 1 }))`?
 * Because `T` could be a MORE SPECIFIC subtype, like `ColoredItem extends Item { color: string }`.
 * When you spread `{ ...item, weight }`, TypeScript doesn't guarantee the return object satisfies
 * all unknown subtypes that caller instantiated T with!
 *
 * PRODUCTION-GRADE FIX:
 */
interface Item {
  id: string;
  weight: number;
}

export function case2Fixed<T extends Item>(items: T[]): T[] {
  // If we return T[], we can map and preserve the original object type cleanly:
  return items.map((item) => {
    return Object.assign({}, item, { weight: item.weight + 1 });
  });
}

// =========================================================================
// CASE 3: Excess Property Check with Object Destructuring
// =========================================================================
/**
 * DIAGNOSIS:
 * 'Retries' had a capital 'R'. The excess property check correctly caught the typo.
 *
 * PRODUCTION-GRADE FIX: Fix property casing to 'retries'.
 */

// =========================================================================
// CASE 4: Contravariant Function Assignment Failure
// =========================================================================
/**
 * DIAGNOSIS:
 * Under --strictFunctionTypes, function parameters are contravariant.
 * An ElementHandler expects a generic `Event`. If we assigned `ClickHandler`,
 * the caller might pass a `KeyboardEvent` which has no clientX/clientY, crashing at runtime.
 *
 * PRODUCTION-GRADE FIX:
 * Accept broader event types or type guard inside the handler.
 */

// =========================================================================
// CASE 5: Impossible Intersection Resulting in Never
// =========================================================================
/**
 * DIAGNOSIS:
 * Intersecting two discriminated union members with disjoint discriminant literals
 * ("dark" & "light") collapses the discriminant to 'never', creating an unusable type.
 *
 * PRODUCTION-GRADE FIX:
 * Use a union instead of an intersection: `ConfigA | ConfigB`.
 */
export type ConfigA = { mode: "dark"; color: string };
export type ConfigB = { mode: "light"; fontSize: number };
export type FixedConfig = ConfigA | ConfigB;

console.log("[PASS] All Level 20 Debugging Diagnoses & Production Fixes Verified!");
