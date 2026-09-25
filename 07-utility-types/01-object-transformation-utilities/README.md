# Lesson 07.1: Object Transformation Utilities — Under the Hood

## 1. What is it?
TypeScript ships with built-in utility types that transform object types. In this lesson, we demystify and **re-implement from scratch**:
- `Partial<T>`
- `Required<T>`
- `Readonly<T>`
- `Record<K, T>`
- `Pick<T, K>`
- `Omit<T, K>`

---

## 2. Why does it exist?
In real applications, you almost never use an entity in only one form:
- When creating a user, the ID is missing.
- When patching a user, all fields are optional.
- When auditing a user, all fields are readonly.
Utility types eliminate the need to write and maintain dozens of repetitive interfaces.

---

## 3. Re-implementing the Utilities From Scratch

### 1. `Partial<T>`:
Makes all properties optional.
```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
```
*TS features used*: Homomorphic mapped type, `keyof`, `?` modifier.

### 2. `Required<T>`:
Removes optionality from all properties.
```ts
type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};
```
*TS features used*: `-?` modifier.

### 3. `Readonly<T>`:
Makes all properties immutable.
```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
```
*TS features used*: `readonly` modifier.

### 4. `Record<K, T>`:
Constructs an object type whose keys are `K` and property values are `T`.
```ts
type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};
```
*TS features used*: Type parameter constraint `K extends keyof any` (`string | number | symbol`).

### 5. `Pick<T, K>`:
Picks a subset of properties `K` from type `T`.
```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```
*TS features used*: Constraint `K extends keyof T`, indexed access `T[P]`.

### 6. `Omit<T, K>`:
Constructs a type with the properties of `T` except for those in `K`.
```ts
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```
*TS features used*: Composition of `Pick` and `Exclude`.

---

## 4. Why is `Omit<T, K extends keyof any>` instead of `extends keyof T`?
Notice that `Omit` constrains `K` to `keyof any` rather than `keyof T`!
Why? Because `Omit` is often used to defensively remove keys from unions or open shapes where some union variants might not have the key! If it were constrained to `keyof T`, omitting a property that only exists on one union branch would throw a compile error.

---

## 5. Common Mistakes
```ts
// [FAIL] MISTAKE: Thinking Partial is deep:
interface UserProfile {
  name: string;
  settings: {
    theme: string;
  };
}

const update: Partial<UserProfile> = {
  settings: {} // [FAIL] TS Error: Property 'theme' is missing in type '{}'!
};
// Partial is SHALLOW! To make nested fields optional, you need a recursive DeepPartial!
```

---

## 6. Exercise
Open [exercise.ts](./exercise.ts) and implement `MyPick`, `MyOmit`, and a recursive `DeepPartial<T>`.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 7. Technical Interview Questions

### Question: How is `Omit<T, K>` implemented in TypeScript's standard library?
- **Expected Answer**: It uses `Pick` and `Exclude`.
- **Strong Answer**: `Omit<T, K>` is implemented as `Pick<T, Exclude<keyof T, K>>`. First, `keyof T` extracts the union of all keys from type `T`. Next, the distributive conditional type `Exclude<Union, K>` filters out the keys matching `K`. Finally, `Pick<T, RemainingKeys>` iterates over the remaining keys using a homomorphic mapped type to construct the final object shape.

---

## 8. 5-Minute Active Recall
1. Which modifier strips optionality in mapped types?
2. What is `keyof any` equal to?
3. Is built-in `Readonly<T>` shallow or deep?

<details>
<summary>[RECALL] Check Answers</summary>

1. `-?`.
2. `string | number | symbol`.
3. Shallow.
</details>
