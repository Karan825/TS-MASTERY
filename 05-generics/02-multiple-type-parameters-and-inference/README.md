# Lesson 05.2: Multiple Type Parameters & Generic Inference

## 1. What is it?
Generic definitions frequently require more than one type variable.
Common patterns include:
- Linking an object type to one of its keys: `<T, K extends keyof T>`
- Mapping input types to output types: `<TInput, TOutput>`
- Handling data and custom error shapes: `<TData, TError = Error>`

---

## 2. Why does it exist?
Functions often operate on two related types. For instance, `getProperty(user, "email")`:
- `T` is the type of `user` (`User`).
- `K` must be a valid key of `User` (not an arbitrary string!).
- The return type must be the exact type of that property (`User["email"]` -> `string`).
Generics with multiple constrained parameters make this compile-time safe!

---

## 3. Mental Model: Constraint Chains
```
    Type T ─────────────> { id: string; age: number }
      │
      ▼
    keyof T ────────────> "id" | "age"
      │
      ▼
    K extends keyof T ──> Can only be "id" or "age"
      │
      ▼
    Return: T[K] ───────> If K is "age", return type is number!
```

---

## 4. Syntax & The `keyof` Constraint
```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30, isAdmin: true };

// Types inferred automatically!
const name = getProperty(user, "name");       // Inferred as string
const age = getProperty(user, "age");         // Inferred as number
// getProperty(user, "nonExistentKey");       // [FAIL] TS Error!
```

---

## 5. The Partial Inference Limitation & Currying
In TypeScript, you **cannot** explicitly supply only one type argument and let the compiler infer the rest (e.g. `fn<string, _>(arg)` is not valid syntax).
You must either provide **all** generic arguments or **none** (and let TS infer all of them).

### Senior Pattern: Currying for Partial Inference:
```ts
// If you want to supply TExplicitly, but infer TImplicit:
const createConverter = <TTarget>() => <TSource>(source: TSource, fn: (s: TSource) => TTarget): TTarget => {
  return fn(source);
};

const toUpper = createConverter<string>()(123, (n) => `Value: ${n}`);
```

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Unnecessary secondary generic:
function badMap<T, U>(arr: T[], fn: (item: T) => U): U[] { ... } // Good!
function badMap2<T, U, R extends U[]>(arr: T[], fn: (item: T) => U): R { ... } // Over-engineered smell!
```

---

## 7. Real-World Production Usage
Generic dictionary transformers:
```ts
export function mapRecord<K extends string | number | symbol, VInput, VOutput>(
  record: Record<K, VInput>,
  transformer: (val: VInput, key: K) => VOutput
): Record<K, VOutput> {
  const result = {} as Record<K, VOutput>;
  for (const [key, val] of Object.entries(record) as [K, VInput][]) {
    result[key] = transformer(val, key);
  }
  return result;
}
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. `pickProps<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`.
2. A generic key-value pair inverter.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
function setProp<T, K extends keyof T>(obj: T, key: K, val: T[K]) {
  obj[key] = val;
}

// Why does passing an object with optional properties sometimes complain
// if val is undefined?
```
**Diagnosis**: If an interface has `age?: number`, its type is `number | undefined`. Passing `undefined` is valid only because the property includes `undefined`. If strict `exactOptionalPropertyTypes` is enabled, setting `undefined` requires the property to explicitly declare `| undefined` rather than just optional `?`.

---

## 10. Technical Interview Questions

### Question: How does TypeScript infer generic parameters, and what is the "All-or-Nothing" generic argument rule?
- **Expected Answer**: It infers generics from function arguments. You have to specify all generic arguments or none.
- **Strong Answer**: TypeScript's compiler infers type parameters through bidirectional unification, examining the types of actual runtime arguments against parameter type expressions. However, when calling a generic function, TypeScript enforces the "All-or-Nothing" rule: if a function has multiple type parameters `<A, B>`, you cannot manually specify `A` and ask the compiler to infer `B`. You must either let TypeScript infer all type arguments from arguments, or specify every single type argument explicitly. Senior engineers work around this using higher-order functions (currying) to separate explicit type instantiation from argument inference.

---

## 11. 5-Minute Active Recall
1. What does `K extends keyof T` mean?
2. What is the return type of `obj[key]` when `key` is `K extends keyof T`?
3. How can you partially provide one generic parameter while letting another infer?

<details>
<summary>[RECALL] Check Answers</summary>

1. `K` is constrained to be one of the literal property keys of object type `T`.
2. Indexed access type `T[K]`.
3. By currying the function into two nested functions, where the outer function takes the explicit type parameter and the inner function infers its type parameter.
</details>
