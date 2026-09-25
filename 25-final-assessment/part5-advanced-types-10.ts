/**
 *  Final Assessment — Part 5: 10 Advanced Type Challenges
 *
 * Implement the 10 type aliases below.
 * Solutions & tests are in answers-and-solutions/part5-solutions.ts.
 */

// CHALLENGE 1: DeepReadonly<T>
export type DeepReadonly<T> = any; // TODO

// CHALLENGE 2: DeepPartial<T>
export type DeepPartial<T> = any; // TODO

// CHALLENGE 3: TupleToUnion<T extends readonly unknown[]>
export type TupleToUnion<T extends readonly unknown[]> = any; // TODO

// CHALLENGE 4: PickByType<T, ValueType>
// Picks only properties in T whose value extends ValueType
export type PickByType<T, ValueType> = any; // TODO

// CHALLENGE 5: RequiredKeys<T>
// Extracts a union of all keys in T that are required (not optional)
export type RequiredKeys<T> = any; // TODO

// CHALLENGE 6: OptionalKeys<T>
// Extracts a union of all keys in T that are optional
export type OptionalKeys<T> = any; // TODO

// CHALLENGE 7: Flatten<T>
// Unpacks 1 level of nested array
export type Flatten<T> = any; // TODO

// CHALLENGE 8: UnionToIntersection<U>
export type UnionToIntersection<U> = any; // TODO

// CHALLENGE 9: Brand<T, B extends string>
export type Brand<T, B extends string> = any; // TODO

// CHALLENGE 10: Head<T extends readonly unknown[]>
// Extracts the first element of a tuple, or never if empty
export type Head<T extends readonly unknown[]> = any; // TODO
