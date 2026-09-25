# Lesson 06.2: Mapped Types, Modifiers & Key Remapping (`as`)

## 1. What is it?
A **Mapped Type** is a generic type that iterates over keys (often produced by `keyof`) to construct a new object type.
Think of it as `Array.prototype.map()`, but for types:
```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
```
TypeScript also provides **Modifiers** (`+readonly`, `-readonly`, `+?`, `-?`) and **Key Remapping** using `as`.

---

## 2. Why does it exist?
Without mapped types, modifying an existing object contract requires creating duplicate interfaces for every variation:
- `User` vs `PartialUser` vs `ReadonlyUser` vs `UserGetters`.
Mapped types turn TypeScript into a true type-level programming language that computes derivative types programmatically.

---

## 3. Mental Model: The Property Assembly Line
```
Input Type: { name: string; age: number }
                │
                ▼ (keyof T: "name" | "age")
      [ Iterate: K in keyof T ]
       ├── For K = "name": transform key & value
       └── For K = "age":  transform key & value
                │
                ▼
Output Type: { readonly name: string; readonly age: number }
```

---

## 4. Syntax & Modifiers

### 1. Removing Optionality (`-?`):
```ts
// Built-in Required<T> under the hood:
type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};
```

### 2. Key Remapping via `as`:
```ts
// Remap keys to getters:
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person { name: string; age: number }
type PersonGetters = Getters<Person>;
// Evaluates to: { getName: () => string; getAge: () => number }
```

### 3. Filtering Keys via `as never`:
If a key is remapped to `never`, TypeScript completely omits it from the output type!
```ts
// Pick only properties whose value is a function (methods):
type FunctionPropertiesOnly<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K];
};
```

---

## 5. Recursive Mapped Types: `DeepReadonly`
```ts
export type DeepReadonly<T> = T extends Function | boolean | number | string | symbol | null | undefined
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<DeepReadonly<U>>
  : { readonly [K in keyof T]: DeepReadonly<T[K]> };
```

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Trying to use mapped type syntax inside an interface:
// interface Bad<T> {
//   [K in keyof T]: T[K]; // [FAIL] TS Error: An index signature parameter type must be 'string', 'number', 'symbol', or a template literal type.
// }
// Mapped types MUST use 'type' alias syntax!
```

---

## 7. Real-World Production Usage
Automatic ORM entity DTO and update payload generation:
```ts
export type UpdatePayload<T> = {
  [K in keyof T as K extends "id" | "createdAt" ? never : K]?: T[K];
};
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. `DeepReadonly<T>`.
2. A typed event emitter contract generator using key remapping.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Why does Nullable<{ readonly id: string }> preserve the readonly modifier?
```
**Diagnosis**: Homomorphic mapped types (`[K in keyof T]`) automatically copy property modifiers (`readonly` and `?`) from the original type unless you explicitly override them with `-readonly` or `-?`.

---

## 10. Technical Interview Questions

### Question: What is a homomorphic mapped type, and how does key remapping (`as`) affect it?
- **Expected Answer**: A mapped type that preserves modifiers from the original type.
- **Strong Answer**: A homomorphic mapped type is of the form `[K in keyof T]`. Because it operates directly over `keyof T`, TypeScript recognizes that the properties correspond directly to the source type `T` and automatically preserves property modifiers (such as `readonly` and optionality `?`). However, when you introduce key remapping via the `as` clause (`[K in keyof T as NewKey]`), the direct mapping is altered, potentially transforming or filtering keys. Homomorphic mapped types are the engine behind built-in utility types like `Partial`, `Readonly`, and `Pick`.

---

## 11. 5-Minute Active Recall
1. How do you remove the `?` (optional) modifier in a mapped type?
2. How do you filter out a key during key remapping?
3. Can an `interface` be declared directly as a mapped type?

<details>
<summary>[RECALL] Check Answers</summary>

1. Using `-?`.
2. Remap it to `never` using `as (condition ? K : never)`.
3. No, mapped types must be declared with `type` aliases.
</details>
