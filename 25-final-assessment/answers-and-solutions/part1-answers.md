# 📖 Final Assessment Answer Key — Part 1: Conceptual Mastery

### Section A: JavaScript Foundations & Memory Model
1. **Primitives vs References**: Primitives are immutable and compared by value (bit identity on the stack). Objects are mutable reference types stored on the heap and compared by memory address pointer identity.
2. **`const` Object Mutation**: `const` prevents reassigning the variable identifier to point to a new heap address. It does not prevent mutation of the heap object's properties.
3. **`Object.freeze()` vs `readonly`**: `Object.freeze()` is a runtime JavaScript method that prevents shallow mutation at runtime. `readonly` is a compile-time TypeScript annotation that is completely erased at runtime. Both are shallow by default.
4. **Closures**: A closure pairs a function with its surrounding lexical environment. Variables remain in heap memory because the inner function holds an active reference, preventing garbage collection.
5. **Event Loop Microtasks**: Microtasks (Promise jobs, `queueMicrotask`) have higher execution priority than the macrotask queue (`setTimeout`, I/O). The event loop drains the entire microtask queue before picking the next macrotask.
6. **`this` Binding Rules**: (1) `new` binding, (2) Explicit binding (`call`/`apply`/`bind`), (3) Implicit binding (`obj.method()`), (4) Default binding (`undefined` in strict mode).
7. **Arrow Functions and `this`**: Arrow functions do not possess a `this` binding; they resolve `this` lexically from their enclosing scope like a normal variable.

### Section B: TypeScript Fundamentals & Type Lattice
8. **Type Erasure & Performance**: `tsc` strips all types, interfaces, and assertions during compilation. Runtime performance cost is strictly zero.
9. **When to Annotate**: Annotate public boundaries (function parameters, exported API return types, complex types). Let TypeScript infer local variables and return types of simple functions.
10. **Union vs Intersection in Set Theory**: Union (`A | B`) is the mathematical union of values (value belongs to set A or set B). Intersection (`A & B`) requires a value to satisfy all constraints of both set A and set B simultaneously.
11. **Object Properties in Union vs Intersection**: To safely access a property on `A | B`, it must exist on *all* union members. In `A & B`, the composite object contains properties from both members.
12. **`any` vs `unknown`**: `any` disables all type checking and allows calling arbitrary methods. `unknown` accepts any value but forbids all property accesses and function calls until narrowed through type guards.
13. **`never` & Disjoint Intersections**: `never` is the empty set ($\emptyset$). Because no value can be both a string and a number, `string & number` collapses to `never`.
14. **`() => void` vs `() => undefined`**: `() => void` instructs callers to ignore the return value (allowing implementations to return anything). `() => undefined` strictly forces implementations to return `undefined`.
15. **Labeled Tuples & Readonly**: A labeled tuple provides descriptive parameter names (`[lat: number, lng: number]`). `readonly` removes mutating methods (`.push()`, `.splice()`), providing compile-time immutability.

### Section C: The Type System & Control-Flow Analysis
16. **Nominal vs Structural**: Nominal systems check types by explicit class/type name. Structural systems check compatibility by shape and properties.
17. **Excess Property Check**: Fresh object literals at call sites undergo excess property checks to catch typos. Variable references are assumed to have independent lifecycles and use standard structural subtyping.
18. **Control-Flow Analysis**: Traces variable assignments, conditional branches, returns, and throws to compute the refined type of a variable at each line of code.
19. **Type Predicates**: `function isUser(x: unknown): x is User`. Tells the compiler that if the function returns `true`, the argument is of type `User`.
20. **Assertion Functions**: `asserts x is T`. Returns `void` (or throws) and narrows `x` for all subsequent lines in the current block without needing an `if` statement.
21. **Discriminated Union Requirements**: (1) A union of object types, (2) A shared common property key, (3) Distinct literal types for that key across variants.
22. **Literal Discriminant Requirement**: If the discriminant is broad (`string`), TypeScript cannot differentiate variants during Control-Flow Analysis.
23. **`const _exhaustive: never = val`**: If any union variant is unhandled, `val` holds that remaining type. Assigning a non-empty type to `never` raises a compile error.

### Section D: Functions & Variance
24. **Return Type Covariance**: Function return types are covariant because returning a subtype fulfills the contract of returning the supertype.
25. **Parameter Contravariance**: Function parameter types are contravariant under `--strictFunctionTypes` because a function accepting a broader supertype can safely process any narrower subtype passed to it.
26. **Method Shorthand Bivariance**: For backwards compatibility with legacy JavaScript patterns (like `Array.prototype.push`).
27. **Overload vs Implementation Signature**: Overload signatures define the public API. The implementation signature contains the runtime code and is hidden from callers.
28. **Direct Invocation of Implementation**: No, external callers can only invoke matching overload signatures.
29. **Explicit `this` Typing**: Pass `this: ExpectedType` as the first parameter of the function declaration.
30. **No Checked Exceptions in TS**: JavaScript allows throwing arbitrary values, and Promises unwrap errors asynchronously across microtask queues where static exception tracking breaks down.

### Section E: Generics & Type Parameter Constraints
31. **Generic Relationship Preservation**: Links input types to output types (e.g. passing `T` returns `T`), preventing type decay into `any`.
32. **`<T extends object>`**: Constrains `T` to non-primitive objects, unlocking property operations and spreads.
33. **Default Generics**: `<T = DefaultType>`. Provides a fallback type if the caller does not specify one.
34. **All-or-Nothing Rule**: You cannot supply some generic arguments explicitly while letting the compiler infer the remainder; you must provide all or none.
35. **Currying for Partial Inference**: Wrap the function in a higher-order function where the outer function takes the explicit type and the inner function infers arguments.
36. **Useless Generics**: When a type parameter appears only once in the parameter list and is never returned or linked to another parameter.
37. **Generic Repositories**: By typing queries and saves with entity parameter `TEntity`, models retain their strict types without manual type casting.

### Section F: Advanced Types & Type-Level Programming
38. **`keyof T`**: Produces a union of all property keys (`string | number | symbol`) of type `T`.
39. **Indexed Access (`T[K]`)**: Looks up property value types. `T[number]` on arrays extracts the union of array element types.
40. **Mapped Type**: Iterates over keys to construct a new object type: `[K in Keys]: ValueType`.
41. **Stripping Modifiers**: Use `-readonly` and `-?`.
42. **Key Remapping with `as`**: Remaps key names or filters them out by mapping to `never`.
43. **Distributive Conditionals**: When a naked type parameter `T` is checked (`T extends U ? X : Y`), unions split and evaluate each branch independently.
44. **Stopping Distributivity**: Wrap both sides in tuples: `[T] extends [U] ? X : Y`.

### Section G: Compiler, Boundaries & Enterprise Architecture
45. **The `infer` Keyword**: Declares a temporary type variable in the `extends` clause of a conditional type to pattern match and extract types.
46. **Branded Types**: Intersects a primitive with a unique symbol tag (`T & { readonly [Brand]: 'Tag' }`) to enforce nominal typing and eliminate primitive obsession.
47. **`Omit<T, K>` Implementation**: `Pick<T, Exclude<keyof T, K>>`.
48. **`private` vs `#private`**: `private` is a compile-time check erased in JS output. `#private` is an ECMAScript engine feature providing hard runtime privacy.
49. **`noUncheckedIndexedAccess`**: Adds `undefined` to all array index and dictionary key lookups (`T | undefined`).
50. **Typing Boundary Inputs as `unknown`**: Because TypeScript types provide zero runtime guarantees, typing external inputs as `unknown` forces developers to validate shapes before using them.
