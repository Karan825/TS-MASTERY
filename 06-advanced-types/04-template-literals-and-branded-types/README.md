# Lesson 06.4: Template Literal Types & Branded / Nominal Types

## 1. What is it?
- **Template Literal Types**: Built on template string syntax (`` `item_${string}` ``), allowing string pattern validation, prefixing, and string manipulation at the type level.
- **Branded Types (Nominal Typing)**: A technique that attaches a phantom compile-time tag to primitive types (like `string` or `number`) so that values with the same underlying primitive cannot be accidentally swapped.

---

## 2. Why does it exist?

### The Primitive Obsession Trap:
In standard TypeScript:
```ts
type UserId = string;
type OrderId = string;

function cancelOrder(orderId: OrderId, userId: UserId) {}

const user: UserId = "usr_123";
const order: OrderId = "ord_999";

cancelOrder(user, order); // [FAIL] SWAPPED! But TypeScript reports ZERO errors!
```
Because TypeScript is structurally typed, both `UserId` and `OrderId` are just `string` under the hood!

### The Solution: Branded Types:
```ts
declare const BrandSymbol: unique symbol;
export type Brand<T, TBrand extends string> = T & { readonly [BrandSymbol]: TBrand };

export type UserId = Brand<string, "UserId">;
export type OrderId = Brand<string, "OrderId">;

// Now cancelOrder(user, order) throws a compile error:
// Argument of type 'UserId' is not assignable to parameter of type 'OrderId'!
```

---

## 3. Mental Model: The Phantom Security Tag
Think of a branded type like an ink tag attached to expensive clothes in a store:
- At runtime, the garment is just ordinary cotton (a JavaScript string).
- But at checkout (compile-time), the scanner refuses to let it pass unless it has the authentic verified security tag.

---

## 4. Syntax: Template Literals & String Transformations
```ts
// 1. String Pattern Validation:
type HttpsUrl = `https://${string}`;
const validUrl: HttpsUrl = "https://api.github.com";
// const invalidUrl: HttpsUrl = "http://insecure.com"; // [FAIL] TS Error!

// 2. Built-in String Intrinsics:
type Direction = "north" | "south" | "east" | "west";
type CapitalizedDirection = Capitalize<Direction>; // "North" | "South" | ...

// 3. Grid coordinates:
type Col = "A" | "B" | "C";
type Row = 1 | 2 | 3;
type ChessSquare = `${Col}${Row}`; // "A1" | "A2" | "A3" | "B1" | ...
```

---

## 5. Smart Constructors for Branded Types
Because branded types cannot be instantiated with a raw string literal directly, you create a **Smart Constructor** or validator:
```ts
export function createUserId(raw: string): UserId {
  if (!raw.startsWith("usr_")) {
    throw new Error(`Invalid user ID: ${raw}`);
  }
  return raw as UserId; // Safe cast at the validation boundary!
}
```

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Adding runtime fields instead of phantom brands:
type BadBrand = string & { brand: "UserId" };
// A runtime string will never actually have a '.brand' property at runtime,
// which confuses developers inspecting objects in debuggers!
// Use a unique symbol so it never conflicts with runtime keys!
```

---

## 7. Real-World Production Usage
Type-safe financial currencies and sanitized SQL/HTML strings:
```ts
export type UsdCents = Brand<number, "UsdCents">;
export type SafeHtml = Brand<string, "SafeHtml">;
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. Branded types for `EmailAddress` and `AccountId` with validating smart constructors.
2. A template literal route matcher.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
type HttpRoute = `/api/${string}`;
const r1: HttpRoute = "/api/v1/users";
let dynamicRoute = "/api/v2/items";
// const r2: HttpRoute = dynamicRoute; // [FAIL] Why does this fail?
```
**Diagnosis**: `dynamicRoute` was declared with `let`, so TypeScript widened its type to generic `string`. A generic `string` is not assignable to the specific template pattern `/api/${string}`. To fix it, annotate `const dynamicRoute = ...` or use `as const`.

---

## 10. Technical Interview Questions

### Question: What are branded types, and what problem do they solve in a structurally typed language?
- **Expected Answer**: They add a phantom property to primitives to make them nominal.
- **Strong Answer**: TypeScript's type system is structural, meaning any type with the same shape is interchangeable. This creates the "Primitive Obsession" vulnerability, where distinct domain concepts represented by the same primitive (such as `UserId`, `OrderId`, or `PositiveNumber`) can be accidentally interchanged without compiler warnings. Branded types solve this by intersecting a primitive with an object type containing a unique symbol tag (`T & { readonly [Brand]: 'Tag' }`). This introduces nominal-like type safety at compile time with zero runtime memory overhead or performance cost.

---

## 11. 5-Minute Active Recall
1. How do you create an event union for domains `user | order` and actions `created | deleted`?
2. What is a "phantom type" in the context of branded types?
3. What happens if you assign a `string` variable to an `EmailAddress` branded type?

<details>
<summary>[RECALL] Check Answers</summary>

1. `` `${"user" | "order"}_${"created" | "deleted"}` ``.
2. A type that exists only at compile-time on the type definition and does not correspond to any physical runtime property.
3. The compiler reports an error because the string lacks the phantom brand symbol.
</details>
