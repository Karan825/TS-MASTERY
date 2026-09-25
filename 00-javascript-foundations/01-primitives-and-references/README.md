# Lesson 00.1: Primitives vs References & Mutability

## 1. What is it?
In JavaScript (and by extension TypeScript), every value belongs to one of two categories:
1. **Primitive values**: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.
2. **Reference values (Objects)**: Plain objects `{...}`, arrays `[...]`, functions, Maps, Sets, Dates, RegExp.

Primitives are immutable and compared by **value**. References are mutable by default and compared by **identity (memory address)**.

---

## 2. Why do I need to understand this before TypeScript?
TypeScript checks types at compile time, but it **never alters JavaScript's runtime memory model**.
- In TypeScript, marking an array as `readonly number[]` stops *TypeScript* from allowing `.push()`, but at JavaScript runtime it is still an ordinary, mutable JS Array!
- Beginners frequently write:
  ```ts
  const user = { name: "Alice" };
  user.name = "Bob"; // Works in JS and TS! 'const' prevents re-assigning 'user', not mutating its contents!
  ```
- If you don't understand how references behave in memory, you will write buggy type definitions that assume immutability where mutation is occurring, or vice versa.

---

## 3. Mental Model
Think of memory as:
- **Call Stack (Values)**: When you create a primitive `let a = 42;`, the box labeled `a` holds the bits for `42`. If you do `let b = a;`, `b` gets a brand new copy of `42`.
- **Heap (Pointers)**: When you create an object `const user = { name: "Alice" };`, the object is allocated on the heap at memory address `0x10A`. The variable `user` on the stack only stores the pointer `0x10A`.
- If you pass `user` to a function, JavaScript copies the **pointer**, not the object. Any mutation through that pointer alters the single object on the heap!

---

## 4. Syntax
```ts
// Primitives: Copied by value
let score1 = 100;
let score2 = score1;
score2 = 200;
console.log(score1); // Still 100

// References: Copied by pointer
const config1 = { theme: "dark" };
const config2 = config1;
config2.theme = "light";
console.log(config1.theme); // "light" — mutated!

// TypeScript 'as const' creates a compile-time deeply readonly literal type
const immutableConfig = { theme: "dark" } as const;
// immutableConfig.theme = "light"; // [FAIL] TS Error: Cannot assign to 'theme' because it is a read-only property.
```

---

## 5. TypeScript vs JavaScript Comparison
| Concept | JavaScript Runtime | TypeScript Compile-Time |
| :--- | :--- | :--- |
| `const x = 5` | Cannot reassign `x`. | Infers type as literal `5` (not generic `number`). |
| `const obj = { a: 1 }` | `obj` cannot point to a new object, but `obj.a` can be changed. | Infers `{ a: number }`. Allows property mutation. |
| `as const` | Erased completely! Generates plain JS object. | Freezes types deeply: infers `{ readonly a: 1 }`. |
| `Object.freeze(obj)` | Runtime throws/ignores mutations in strict mode (shallow only). | TS infers `Readonly<T>` (shallow). |

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE 1: Thinking const makes an object immutable
const user = { id: "u_1", roles: ["admin"] };
user.roles.push("superadmin"); // Totally allowed by both JS and TS!

// [FAIL] MISTAKE 2: Thinking Object.freeze is deep
const settings = Object.freeze({
  db: { host: "localhost" }
});
settings.db.host = "production"; // MUTATES! Object.freeze is shallow!
```

---

## 7. Real-World Production Usage
In production TypeScript, you frequently defend against unintentional state mutation in Redux/Zustand stores, React state, or functional pipelines using `readonly` and `as const`:

```ts
export interface AppState {
  readonly currentUser: Readonly<{ id: string; name: string }> | null;
  readonly permissions: readonly string[];
}
```

---

## 8. Exercise (Self-Testing)

### Problem
You are designing a cache store for a high-frequency trading application.
1. Define a helper function `createSnapshot<T>(data: T): T` that performs a shallow clone of an object to prevent caller mutations from affecting the snapshot.
2. In TypeScript, demonstrate why mutating a nested property still leaks mutation unless deep immutability or deep cloning is used.

### Your Task
Open [exercise.ts](./exercise.ts) and implement the missing logic.

<details>
<summary> Click to view hints</summary>

- For shallow cloning, use the object spread syntax `{ ...data }` or array spread `[...data]`.
- For deeply frozen configurations, investigate how TypeScript's `as const` prevents compiler-level reassignment of nested properties.
</details>

<details>
<summary>[HINT] Click to view solution & architectural explanation</summary>

See [solution.ts](./solution.ts) for full code and trade-off analysis.
</details>

---

## 9. Debugging Challenge
Inspect this broken code:
```ts
function updateUserRole(user: { id: string; roles: string[] }, newRole: string) {
  const updated = user;
  updated.roles.push(newRole);
  return updated;
}
```
**Why is this dangerous in production?**
`updated` points to the exact same memory address as `user`. Calling this mutates the caller's input object directly, causing insidious side effects across concurrent operations.

---

## 10. Technical Interview Questions

### Question 1: What is the difference between `const` in JavaScript and `readonly` in TypeScript?
- **Expected Answer**: `const` is a JavaScript runtime keyword that prevents variable identifier reassignment. `readonly` is a TypeScript compile-time modifier that prevents property reassignment on an object or array.
- **Strong Answer**: `const` applies to variable bindings in execution contexts. It does not prevent mutation of the heap object that the identifier points to. `readonly` is a type-system compile-time annotation. It instructs the TypeScript compiler to reject member assignments (`obj.prop = val`). Crucially, `readonly` is erased during compilation; it produces zero JavaScript code and provides no runtime mutation prevention unless paired with `Object.freeze()` or persistent data structures.
- **Common Weak Answer**: "They both make things constant and prevent changes."

---

## 11. 5-Minute Active Recall
1. Why does `const arr = [1, 2]; arr.push(3);` succeed in JavaScript?
2. Does `Object.freeze()` prevent mutating nested objects?
3. What happens to the `readonly` keyword when TypeScript is compiled to JavaScript?

<details>
<summary>[RECALL] Check Recall Answers</summary>

1. Because `const` protects the variable binding `arr`, not the array instance in heap memory.
2. No, `Object.freeze` is shallow. Properties that point to other objects still hold mutable references.
3. It is erased completely. JavaScript engines have no concept of TypeScript `readonly`.
</details>

---

## 12. Spaced Repetition Trigger
In Module 02, we will see how TypeScript treats `readonly` types differently during subtyping and assignability checks. Remember: *A mutable type cannot be safely assigned to where immutability is guaranteed, and vice versa!*
