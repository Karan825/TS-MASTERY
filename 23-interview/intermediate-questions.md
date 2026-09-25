# Technical Interview Guide: Intermediate Questions

---

## Question 1: What is Structural Typing (Duck Typing), and how does it differ from Nominal Typing?

### Expected Answer:
Nominal typing matches types based on their explicit name or class, while structural typing matches types based purely on their shape and properties.

### Strong Answer:
In nominal type systems (such as Java, C#, or C++), type compatibility is established by explicit declarations. Two classes with identical fields and methods cannot be assigned to each other unless one explicitly inherits from the other.
TypeScript uses **structural subtyping** (often called compile-time duck typing). Type compatibility is determined exclusively by the shape (members, property names, and types) of the object. If type $A$ contains all required properties of type $B$ with compatible types, $A$ is a subtype of $B$ and can be assigned to $B$, regardless of how or where $A$ was declared.

### Follow-Up Question:
*If TypeScript is structurally typed, why does assigning an object literal with extra properties throw an error, while assigning a variable with the same extra properties succeeds?*
- **Response**: This is TypeScript's **Excess Property Check**. Because developers passing fresh object literals at call sites are usually making a typo if they provide unknown properties, TypeScript enforces that fresh object literals can only specify known properties. When passing an existing variable reference, TypeScript assumes the object has an independent lifecycle and falls back to standard structural subtyping.

---

## Question 2: What is a Discriminated Union, and why is it preferred for application state?

### Expected Answer:
It is a union of objects sharing a common property tag with literal types. It helps avoid impossible states.

### Strong Answer:
A discriminated union (or tagged union) is an algebraic data type formed by combining multiple object variants that each possess a common, single-literal property known as the **discriminant** (or tag).
In UI and business logic, developers frequently fall into the "Bag of Optionals" anti-pattern (e.g. `{ isLoading: boolean; isError: boolean; data?: Data; error?: Error }`). This allows invalid, impossible states (such as `isLoading: true` AND `isError: true` simultaneously).
A discriminated union makes invalid states unrepresentable:
```ts
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: Data }
  | { status: "error"; error: Error };
```
Control-flow analysis automatically narrows the payload based on inspecting `state.status`.

---

## Question 3: What is a custom type predicate (`arg is T`), and when should you use an assertion function (`asserts arg is T`) instead?

### Expected Answer:
A type predicate returns a boolean and narrows the argument if true. An assertion function throws an error if false and narrows without an if block.

### Strong Answer:
- A **Custom Type Predicate** (`function isUser(x: unknown): x is User`) has a boolean return type. When used in a conditional statement (`if (isUser(val))`), TypeScript's Control-Flow Analysis narrows the type of `val` to `User` within the true branch, and preserves the remaining types in the `else` branch.
- An **Assertion Function** (`function assertUser(x: unknown): asserts x is User`) returns `void` (or throws). If the function finishes execution without throwing an exception, TypeScript narrows `x` to `User` for all subsequent lines of code in the current lexical block, avoiding the need for nested `if` statements.

```ts
function assertString(val: unknown): asserts val is string {
  if (typeof val !== "string") throw new Error("Expected string");
}

const input: unknown = "hello";
assertString(input);
// From here down, input is typed as string!
console.log(input.toUpperCase());
```

---

## Question 4: How does `keyof` work, and how does it relate to indexed access types (`T[K]`)?

### Expected Answer:
`keyof` produces a union of an object's keys. `T[K]` looks up the property type for that key.

### Strong Answer:
`keyof T` queries the type space and returns a union of all property keys (strings, numbers, or symbols) declared on type `T`. For example, `keyof { id: string; count: number }` evaluates to `"id" | "count"`.
An **Indexed Access Type** (`T[K]`) performs a type-level lookup, returning the value type of property `K` on type `T`. When combined in a generic constraint `<T, K extends keyof T>`, it allows functions to guarantee that a key belongs to an object, and that the return value matches the exact type of that property:
```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```
