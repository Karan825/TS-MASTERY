# Lesson 01.4: Set Theory in Types: Unions, Intersections & Literals

## 1. What is it?
In TypeScript, **types are sets of values**.
- **Literal Type**: A set containing exactly one specific value (e.g. `"paid"` or `404`).
- **Union (`A | B`)**: A value that belongs to Set A **OR** Set B.
- **Intersection (`A & B`)**: A value that satisfies Set A **AND** Set B simultaneously.

---

## 2. Why does it exist?
Real applications do not deal in raw unbounded strings or numbers. A status is not just "any string"—it is strictly `"pending" | "processing" | "completed" | "failed"`.
Set theory allows you to:
1. Prevent illegal values from ever compiling.
2. Combine interfaces and capabilities modularly without messy inheritance hierarchies.

---

## 3. Mental Model: Venn Diagrams & Set Operations
```
       UNION (A | B)                    INTERSECTION (A & B)
   ┌─────────┐   ┌─────────┐            ┌─────────┐   ┌─────────┐
   │ Set A   │   │ Set B   │            │ Set A   │   │ Set B   │
   │  {a: 1} │   │  {b: 2} │            │         │███│         │
   └─────────┴───┴─────────┘            └─────────┴───┴─────────┘
     Accepts A, B, or both.               Must have BOTH properties.
```

### The Counter-Intuitive Property Rule:
Beginners often find this confusing:
- For primitive values:
  - `string | number`: Accepts strings OR numbers (larger set).
  - `string & number`: `never` (no value is both string and number).
- For object types:
  - `TypeA | TypeB`: You can only safely access properties that exist on **both** types without narrowing!
  - `TypeA & TypeB`: You can access properties from **both** TypeA and TypeB (composite object)!

---

## 4. Syntax
```ts
// 1. String Literal Union
type PaymentStatus = "pending" | "settled" | "refunded";

// 2. Object Unions
interface CardPayment {
  method: "card";
  cardNumber: string;
}

interface CryptoPayment {
  method: "crypto";
  walletAddress: string;
}

type PaymentMethod = CardPayment | CryptoPayment;

// 3. Object Intersections
interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

interface UserEntity {
  id: string;
  email: string;
}

type PersistedUser = UserEntity & Timestamps;
```

---

## 5. TypeScript vs JavaScript Comparison
In JavaScript, checking that an argument is one of three valid statuses requires manual runtime checking:
```js
if (!["pending", "settled", "refunded"].includes(status)) throw new Error("Invalid status");
```
In TypeScript, `status: PaymentStatus` enforces this at compile time across the entire codebase with autocomplete and zero runtime cost.

---

## 6. Common Mistakes
```ts
interface Dog {
  bark(): void;
  run(): void;
}

interface Cat {
  meow(): void;
  run(): void;
}

function handlePet(pet: Dog | Cat) {
  pet.run(); // [PASS] Valid: 'run' is present in BOTH Dog and Cat.
  // pet.bark(); // [FAIL] TS Error: Property 'bark' does not exist on type 'Cat'.
  // Even though it's a union, you cannot call 'bark' until you narrow the type!
}
```

---

## 7. Real-World Production Usage
Composable domain entities in backend services:
```ts
export type Auditable<T> = T & {
  readonly createdBy: string;
  readonly createdAt: Date;
  readonly version: number;
};
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and construct:
1. Composable entity types using intersection.
2. An exhaustive union handler that safely processes payment methods.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
type Action = "start" | "stop";
type Direction = "up" | "down";

type Command = Action & Direction;
// What is the type of Command, and what values can be assigned to it?
```
**Diagnosis**: `Command` is `never`! No string can be `"start"` and `"up"` simultaneously. The intersection of disjoint literal types is the empty set (`never`).

---

## 10. Technical Interview Questions

### Question: Why can you only access common properties on a union of objects without narrowing?
- **Expected Answer**: Because TypeScript doesn't know which object you have at runtime.
- **Strong Answer**: In TypeScript's set theory, a union `A | B` represents the set of all values that satisfy *either* `A` or `B`. For a property access to be safe, it must be valid for *every single member* of that set. If TypeScript permitted accessing a property that only exists on `A`, but the caller passed an instance of `B`, the JavaScript engine would return `undefined` or throw an error. Therefore, until the union is narrowed using a discriminator or type guard, only the intersection of properties across all union members is safely accessible.

---

## 11. 5-Minute Active Recall
1. What is the result of `'admin' & 'user'`?
2. If `type A = { id: string; name: string }` and `type B = { id: string; age: number }`, what properties can you access on `val: A | B` without narrowing?
3. What is the difference between a union of primitive types vs an intersection of object types?

<details>
<summary>[RECALL] Check Answers</summary>

1. `never`.
2. Only `val.id`, because it is the only property common to both members.
3. A union of primitives accepts either type; an intersection of objects merges required fields into a composite type.
</details>
