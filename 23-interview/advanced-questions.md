# Technical Interview Guide: Advanced Questions

---

## Question 1: Explain Distributive Conditional Types and how to prevent distributivity.

### Expected Answer:
When a naked generic type parameter is used in a conditional type, unions automatically distribute across it. You wrap in brackets `[T]` to stop it.

### Strong Answer:
In TypeScript, when a conditional type of the form `T extends U ? X : Y` acts on a **naked** (unadorned) type parameter `T`, and `T` is instantiated with a union type `A | B | C`, the conditional type automatically distributes over the union members:
`(A | B) extends U ? X : Y` $\implies$ `(A extends U ? X : Y) | (B extends U ? X : Y)`

This mathematical distributivity is the foundation of union-filtering utilities like `Exclude<T, U>`:
```ts
type Exclude<T, U> = T extends U ? never : T;
// Exclude<'a' | 1, number>
// => ('a' extends number ? never : 'a') | (1 extends number ? never : 1)
// => 'a' | never => 'a'
```

To **prevent** distributivity—such as when checking whether an entire union satisfies a type or when checking for `never`—you wrap both sides of the `extends` keyword in single-element tuples:
```ts
type IsNever<T> = [T] extends [never] ? true : false;
type IsUnionString<T> = [T] extends [string] ? true : false;
```

---

## Question 2: How does the `infer` keyword work, and where is it permitted?

### Expected Answer:
`infer` introduces a type variable inside the `extends` clause of a conditional type to pattern match and extract an inner type.

### Strong Answer:
The `infer` keyword is only permitted within the `extends` clause of a conditional type. It instructs the TypeScript compiler to introduce a fresh type variable and deduce its type through pattern matching against the candidate type.
For example, to extract the return type of a function:
```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```
If `T` matches the function shape, the compiler binds `R` to whatever type appears in the return position of `T`.
Multiple `infer` declarations can be used to extract tuple heads, tails, or promise payloads recursively (e.g. `Awaited<T>`).

---

## Question 3: Explain Covariance and Contravariance in TypeScript function types.

### Expected Answer:
Return types are covariant (preserve subtyping direction), while function parameters are contravariant (reverse subtyping direction).

### Strong Answer:
Variance describes how subtyping of component types affects the subtyping of composite types:
- **Covariance (Producers)**: If $A$ is a subtype of $B$ ($A \subseteq B$), then `() => A` is a subtype of `() => B`. A caller expecting a function that produces a generic `Animal` can safely accept a function that produces a specific `Dog`.
- **Contravariance (Consumers)**: If $A$ is a subtype of $B$ ($A \subseteq B$), then `(b: B) => void` is a subtype of `(a: A) => void`. A caller expecting a handler that processes a `Dog` can safely accept a handler that knows how to process *any* `Animal`. The subtyping direction is inverted!
Under TypeScript's `--strictFunctionTypes` compiler flag, function parameter positions are strictly checked for contravariance, preventing runtime type-confusion crashes.

---

## Question 4: How would you design a type-safe API client that guarantees URL paths, query parameters, request bodies, and response types are checked at compile time?

### Expected Answer:
Create an interface mapping route paths to their method, body, and response types, then write a generic fetch wrapper constrained to that map.

### Strong Answer:
I define a centralized **Endpoint Schema Contract** where route paths serve as keys mapping to HTTP methods:
```ts
export interface ApiSchema {
  "/users": {
    GET: { query: { page?: number; limit?: number }; response: UserSummary[] };
    POST: { body: CreateUserDto; response: UserEntity };
  };
  "/users/:id": {
    GET: { params: { id: string }; response: UserEntity };
  };
}
```
Then, I implement a generic API client whose methods are constrained:
```ts
class ApiClient {
  async get<Path extends keyof ApiSchema>(
    path: Path,
    options: ApiSchema[Path]["GET"]["query"]
  ): Promise<ApiSchema[Path]["GET"]["response"]> {
    // runtime implementation
  }
}
```
This guarantees:
1. Invalid route URLs trigger immediate compiler errors.
2. Query parameters and request bodies are strictly typed.
3. Callers receive the exact typed response model without type assertions (`as`).
4. Autocomplete in the IDE lists all valid routes and options.
