# Level 18: Explanations & Mental Compiler Traces

---

## Challenge 1: Union Flattening & Distributivity
```ts
type Mystery1<T> = T extends any ? (arg: T) => void : never;
type Input1 = "read" | "write";
type Result1 = Mystery1<Input1>;
```
### Prediction Answer:
`((arg: "read") => void) | ((arg: "write") => void)`

### Why:
Because `T` is a naked type parameter in `T extends any`, it distributes across the union `"read" | "write"`.
It evaluates:
1. `Mystery1<"read">` -> `(arg: "read") => void`
2. `Mystery1<"write">` -> `(arg: "write") => void`
Result: The union of the two individual function types.

---

## Challenge 2: Deep Path Value Extractor
```ts
type DeepGet<T, P extends string> = ...
type Result2 = DeepGet<NestedObj, "user.address.zip">;
```
### Prediction Answer:
`number`

### Why:
1. First pass: Pattern matches `"user.address.zip"` into `Head = "user"`, `Tail = "address.zip"`.
   - `Head extends keyof NestedObj` matches! Recurses with `T = NestedObj["user"]`, `P = "address.zip"`.
2. Second pass: Pattern matches `"address.zip"` into `Head = "address"`, `Tail = "zip"`.
   - Recurses with `T = NestedObj["user"]["address"]`, `P = "zip"`.
3. Third pass: No dot found. Falls back to `P extends keyof T ? T[P] : never`.
   - `"zip" extends keyof { zip: number }` matches!
   - Returns `{ zip: number }["zip"]` which is `number`!

---

## Challenge 3: Function Inversion with Infer
```ts
type Result3 = Transform<typeof calculateScore>;
```
### Prediction Answer:
`(name: string, rawScore: number) => Promise<boolean>`

### Why:
`typeof calculateScore` is `(name: string, rawScore: number) => boolean`.
The conditional type matches `(...args: infer P) => infer R`:
- `P` is inferred as tuple `[name: string, rawScore: number]`.
- `R` is inferred as `boolean`.
It constructs a new function signature with `(...args: P) => Promise<R>`.

---

## Challenge 4: Non-Homomorphic Key Filtering
```ts
type ExtractMethods<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};
```
### Prediction Answer:
`keyof Result4` is `"execute" | "reset"`

### Why:
The mapped type iterates over all keys of `Schema`: `"id" | "count" | "tags" | "execute" | "reset"`.
For `"id"`, `"count"`, and `"tags"`, the values are `string`, `number`, and `string[]`, which do NOT extend `Function`. Their keys are remapped to `never`, which excludes them.
Only `"execute"` and `"reset"` remain!

---

## Challenge 5: Union to Intersection (The Master Class Trick)
```ts
type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type Result5 = UnionToIntersection<{ a: string } | { b: number }>;
```
### Prediction Answer:
`{ a: string } & { b: number }`

### Why:
This is one of the most famous patterns in advanced TypeScript:
1. `U extends any ? (k: U) => void : never` distributes `U` into a union of functions:
   `((k: { a: string }) => void) | ((k: { b: number }) => void)`
2. Next, the outer conditional checks `extends (k: infer I) => void`.
3. Notice that `infer I` appears in a **function parameter position**!
4. Remember from Lesson 02.4: Function parameters are **CONTRAVARIANT**!
5. When TypeScript infers a candidate from multiple positions in a contravariant location, it takes the **intersection** of the candidates rather than the union!
6. Therefore, `infer I` becomes `{ a: string } & { b: number }`!
