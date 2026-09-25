# Lesson 01.3: Primitives, Arrays & Tuples

## 1. What is it?
- **Primitives**: The foundational building blocks (`string`, `number`, `boolean`, `symbol`, `bigint`, `null`, `undefined`).
- **Arrays (`T[]` or `Array<T>`)**: Variable-length lists where every element shares a common type.
- **Tuples (`[TypeA, TypeB]`)**: Fixed-length arrays where each position has a specific, distinct type.

---

## 2. Why does it exist?
In JavaScript, an array is an untyped heterogeneous list: `[200, "OK", true]`. In TypeScript, if you type this as an array, it infers `(string | number | boolean)[]`, meaning:
- You lose information about the **length** of the array.
- You lose information about which **position** holds what type (e.g. index 0 could be a boolean).

**Tuples solve this**: `[status: number, message: string, isOk: boolean]` locks down both the length and positional types!

---

## 3. Mental Model: Array vs Tuple
- **Array (`T[]`)**: A conveyor belt of items of type `T`. It can have 0 items, 10 items, or 10,000 items.
- **Tuple (`[A, B]`)**: A rigid record with indexed slots, like coordinates `[x: number, y: number]` or React's `[state, setState]`.

---

## 4. Syntax: Tuples in Detail
```ts
// 1. Basic Tuple
type Coordinates = [latitude: number, longitude: number];
const loc: Coordinates = [37.7749, -122.4194];

// 2. Optional Tuple Elements
type HttpHeader = [name: string, value?: string];
const h1: HttpHeader = ["Content-Type", "application/json"];
const h2: HttpHeader = ["X-Trace-Id"]; // Valid!

// 3. Rest Elements in Tuples
type StringThenNumbers = [string, ...number[]];
const data: StringThenNumbers = ["scores", 98, 85, 100];

// 4. Readonly Tuple (via as const)
const httpMethods = ["GET", "POST", "PUT", "DELETE"] as const;
// Type is: readonly ["GET", "POST", "PUT", "DELETE"]
```

---

## 5. TypeScript vs JavaScript Comparison
| Concept | JavaScript Runtime | TypeScript Compile-Time |
| :--- | :--- | :--- |
| `[1, "two"]` | Regular Array. `.push()` can add anything. | Tuple `[number, string]`. Type checker enforces position 0 is number, position 1 is string. |
| `const t = [1, 2] as const` | Regular Array. | Inferred as `readonly [1, 2]`. `.push()` is disallowed. |

---

## 6. Common Mistakes: The `.push()` Tuple Trap!
```ts
// [WARNING] BEWARE: In older/standard TypeScript, .push() on mutable tuples is permitted!
const pair: [string, number] = ["alpha", 1];
pair.push(2); // [FAIL] In TS, .push() doesn't error on mutable tuples because of historical Array inheritance!
console.log(pair.length); // 3! Broke tuple invariant!

// [PASS] PRODUCTION FIX: Always use readonly tuples for immutable records:
const safePair: readonly [string, number] = ["alpha", 1];
// safePair.push(2); // [FAIL] TS Error: Property 'push' does not exist on type 'readonly [string, number]'
```

---

## 7. Real-World Production Usage
Custom React hooks and multi-return functions:
```ts
export function useToggle(initial: boolean = false): readonly [boolean, () => void] {
  let state = initial;
  const toggle = () => { state = !state; };
  return [state, toggle] as const;
}
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. A strongly typed CSV row parser that returns a labeled tuple: `[id: string, age: number, isActive: boolean]`.
2. A tuple utility that prepends a timestamp to arbitrary argument tuples.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
function getOrigin() {
  return [0, 0];
}

const [x, y] = getOrigin();
// Why does TypeScript infer x as number, rather than tuple length 2?
```
**Diagnosis**: TypeScript defaults to inferring `number[]` for array literals to allow mutation. To infer a tuple, you must either annotate `function getOrigin(): [number, number]` or return `[0, 0] as const`.

---

## 10. Technical Interview Questions

### Question: How does TypeScript implement tuples under the hood?
- **Expected Answer**: As arrays with fixed length and typed indices.
- **Strong Answer**: Tuples in TypeScript are subtypes of `Array<T>`, where numeric index properties (`0`, `1`, etc.) are assigned specific element types, and the `length` property is typed as a numeric literal (e.g. `2`) instead of `number`. This allows tuple types to participate in structural subtyping with arrays while still providing positional type guarantees and compile-time bounds checking.
- **Follow-up**: *What is the difference between `[string, number]` and `readonly [string, number]`?*  
  *Answer*: The mutable tuple inherits mutating array methods like `.push()`, `.pop()`, and `.splice()`. The `readonly` tuple omits all mutating methods, providing genuine compile-time immutability.

---

## 11. 5-Minute Active Recall
1. How do you declare a tuple with an optional second element?
2. Why is `[string, ...number[]]` useful?
3. What happens if you call `.push()` on a `readonly [number, number]`?

<details>
<summary>[RECALL] Check Answers</summary>

1. `[string, number?]`.
2. It allows fixed initial element types followed by an arbitrary number of homogeneous tail elements.
3. TypeScript emits a compiler error because `readonly` tuples do not have mutating methods.
</details>
