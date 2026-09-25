# Lesson 05.1: Generic Fundamentals & Type Parameter Constraints

## 1. What is it?
A **generic** is a type parameter—a placeholder for a type that is specified when a function, interface, or class is instantiated or called.
Instead of locking code to a concrete type (like `number`) or forfeiting all type safety with `any`, generics allow you to write reusable code that adapts to any type while **strictly preserving type relationships**.

---

## 2. Why does it exist? (The "Why Not `any`?" Rule)

### The Beginner's Question:
> *"Why write `function identity<T>(arg: T): T` when I could just write `function identity(arg: any): any`?"*

### The Two Mandatory Answers:
1. **What relationship does this generic preserve?**
   - With `<T>(arg: T): T`, TypeScript records that the **return type is identical to the input argument's type**. If you pass a `string`, you get a `string`. If you pass a `User`, you get a `User`.
   - With `any`, that relationship is completely annihilated. The return type is `any`, which disables autocomplete, permits calling invalid methods, and infects downstream variables.
2. **What problem does it prevent?**
   ```ts
   // With 'any':
   const valAny = identity("hello"); // valAny is 'any'
   valAny.nonExistentMethod(); // [FAIL] Compiles without error! Crashes at runtime!

   // With generic <T>:
   const valGeneric = identity("hello"); // valGeneric is 'string'
   // valGeneric.nonExistentMethod(); // [FAIL] TS Error: Property 'nonExistentMethod' does not exist on type 'string'.
   ```

---

## 3. Mental Model: The Variable for Types
Just as a standard function parameter `(x: number)` is a placeholder for a **runtime value**, a generic type parameter `<T>` is a placeholder for a **compile-time type**.
- `boxValue(42)` -> `T` is instantiated as `number`.
- `boxValue("antigravity")` -> `T` is instantiated as `string`.

---

## 4. Syntax & Constraints with `extends`

### Unconstrained Generic:
```ts
function wrapInBox<T>(item: T): { value: T } {
  return { value: item };
}
```

### Constrained Generic (`extends`):
An unconstrained generic `T` can be literally anything. Because of that, you cannot access properties on `T` (e.g. `item.id`), because `T` might be a primitive `number` or `null`.
To unlock property access, use the `extends` keyword to declare a **type constraint**:
```ts
interface HasId {
  id: string;
}

// T can be ANY type, AS LONG AS it has at least 'id: string'!
function printEntityId<T extends HasId>(entity: T): string {
  return `Entity ID: ${entity.id}`; // [PASS] Safe to access .id!
}
```

### Default Type Parameters:
```ts
interface ApiEnvelope<TData = unknown> {
  statusCode: number;
  data: TData;
}

// If no type is provided, TData defaults to 'unknown':
const genericEnvelope: ApiEnvelope = { statusCode: 200, data: "anything" };
```

---

## 5. TypeScript vs JavaScript Comparison
In JavaScript, functions take whatever is passed to them. In TypeScript, generics provide a mathematical contract: whatever type flows into slot $A$ must flow out of slot $B$.

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE 1: Over-specifying generics (The "Generic Smell")
function logString<T extends string>(s: T): void {
  console.log(s);
}
// Why is this bad? If T is only used once and you never return it or link it
// to another parameter, you don't need a generic! Just write: (s: string) => void!

// [FAIL] MISTAKE 2: Trying to instantiate a generic:
function createInstance<T>(): T {
  // return new T(); // [FAIL] TS Error: 'T' only refers to a type, but is being used as a value here.
}
```

---

## 7. Real-World Production Usage
Generic event bus payload handling:
```ts
export interface EventPayload<TType extends string, TData> {
  readonly type: TType;
  readonly payload: TData;
  readonly timestamp: number;
}
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. `pluckProperty<T, K>`: Safely extract a property from an object while preserving type relationships.
2. Generic `Stack<T>` data structure with immutability guarantees.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
function mergeObjects<T, U>(objA: T, objB: U): T & U {
  // [FAIL] TS Error: Spread types may only be created from object types.
  // return { ...objA, ...objB };
  return Object.assign({}, objA, objB) as any;
}
```
**Diagnosis**: In an unconstrained generic `<T, U>`, `T` and `U` could be primitives (`string`, `number`) which cannot be spread into a new object. Fix: constrain them: `<T extends object, U extends object>(objA: T, objB: U): T & U => ({ ...objA, ...objB })`.

---

## 10. Technical Interview Questions

### Question: What is a generic constraint (`extends`), and why would you use one?
- **Expected Answer**: It limits what types can be passed to a generic.
- **Strong Answer**: By default, a type parameter `<T>` is unconstrained, meaning it represents the entire universe of possible types (including primitives, null, and symbols). Because TypeScript has no guarantee of what members exist on `T`, it prevents accessing any properties on a variable of type `T`. By adding a constraint `<T extends BaseShape>`, we enforce that any type argument passed for `T` must be a structural subtype of `BaseShape`. This grants the function body full type-safe access to the properties defined on `BaseShape`, while still allowing the return type to preserve the more specific, derived subtype `T` passed by the caller.

---

## 11. 5-Minute Active Recall
1. Why is `function fn<T>(x: T): T` superior to `function fn(x: any): any`?
2. How do you constrain a type parameter `T` to have a `.length` property?
3. What is a "useless generic", and how do you spot one?

<details>
<summary>[RECALL] Check Answers</summary>

1. Because it preserves the precise type of the argument throughout the function and return value, preventing type erasure and `any` contamination.
2. `<T extends { length: number }>`.
3. A generic parameter that appears only once in the parameter list and is never used to link inputs to outputs or other parameters.
</details>
