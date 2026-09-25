# Technical Interview Guide: Beginner Questions

---

## Question 1: What is TypeScript, and how does it relate to JavaScript at runtime?

### Expected Answer:
TypeScript is a typed superset of JavaScript that compiles down to JavaScript. It adds static types, but types are erased at compile time and don't exist at runtime.

### Strong Answer:
TypeScript is a statically typed syntactic superset of JavaScript designed to provide compile-time verification and tooling support (such as intelligent autocompletion and refactoring). Crucially, TypeScript does not introduce a runtime virtual machine; instead, the compiler transpiles TypeScript source code into standard ECMAScript and performs **Type Erasure**, removing all interfaces, type aliases, type annotations, and assertions. At runtime, a standard JavaScript engine executes the code with zero type overhead or native knowledge of TypeScript contracts.

### Common Weak Answer:
"TypeScript is a completely different programming language from JavaScript that makes JavaScript code strongly typed and prevents all runtime errors."

### Follow-Up Question:
*If TypeScript types are erased at runtime, what happens if an API returns data that doesn't match our interface?*
- **Response**: The application will accept the data without error at the boundary, but may subsequently crash at runtime when attempting to access expected properties or methods that do not physically exist. Runtime schema validation (using tools like Zod or custom type guards) is required at system boundaries.

### Deeper Follow-Up:
*Are there any TypeScript language features that do NOT get erased and actually emit runtime JavaScript code?*
- **Response**: Yes: TypeScript `enum`s, namespaces (in legacy code), and class declarations using parameter properties (e.g. `constructor(public id: string)`) emit executable JavaScript functions and property assignments.

---

## Question 2: What is the difference between `any` and `unknown`?

### Expected Answer:
`any` turns off type checking completely, while `unknown` is safe and requires you to check or narrow the type before doing anything with it.

### Strong Answer:
Both `any` and `unknown` are top types in TypeScript's type lattice, meaning any value in JavaScript can be assigned to them. However, their assignability *from* them is radically different:
- `any` acts as an escape hatch. It can be assigned to any other type (except `never`) and allows arbitrary property access, function invocations, and method calls without compiler checks. It is contagious and disables type safety.
- `unknown` is the type-safe top type. While you can assign anything *to* `unknown`, TypeScript strictly prohibits reading properties, calling methods, or assigning an `unknown` value to any other type until it has been narrowed through Control-Flow Analysis (`typeof`, `instanceof`, or custom type predicates).

```ts
let a: any = "hello";
a.nonExistentMethod(); // Compiles! Crashes at runtime!

let u: unknown = "hello";
// u.toUpperCase();    // [FAIL] Compile error: Object is of type 'unknown'.
if (typeof u === "string") {
  u.toUpperCase();     // [PASS] Safe! Narrowed to string.
}
```

### Common Weak Answer:
"`unknown` is just a newer version of `any` that you should use when you don't know the type."

---

## Question 3: What is the difference between `type` and `interface`?

### Expected Answer:
Interfaces can be extended and merged; types can represent unions and primitives.

### Strong Answer:
Both construct named object shapes, but they have distinct capabilities:
1. **Declaration Merging**: Multiple interface declarations with the same name in the same scope merge their properties into a single interface. Type aliases cannot merge and will throw a duplicate identifier error.
2. **Type Expression Variety**: Type aliases can name primitives (`type ID = string`), unions (`type Status = "a" | "b"`), tuples, and mapped types. Interfaces can only define object shapes or callable signatures.
3. **Collision Handling**: `interface B extends A` reports an immediate compile-time error if a property type conflicts with `A`. A type intersection `A & B` resolves conflicting property types into `never`.
4. **Compiler Performance**: Interfaces create cached flat shapes in the compiler's type checker, often resulting in slightly faster compilation in large object-oriented hierarchies.

### Follow-Up Question:
*When would you deliberately choose an `interface` over a `type` alias?*
- **Response**: When building public SDKs or libraries where consumers might need to augment definitions via declaration merging, or when defining class contracts using `implements`.

---

## Question 4: What is `never`, and where is it used?

### Expected Answer:
`never` is the type for values that never happen, like functions that always throw or infinite loop.

### Strong Answer:
`never` is the **bottom type** in TypeScript's type lattice, representing the empty set ($\emptyset$). No value can ever be assigned to `never` (except another `never`). It appears naturally in two places:
1. As the return type of functions that never reach their endpoint (such as functions that throw unconditionally or run infinite loops).
2. As the result of narrowing a union down to zero remaining possibilities.
In production, `never` is predominantly used for **Compile-Time Exhaustive Checking** in `switch` and `if` ladders.

```ts
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}
```

### Follow-Up Question:
*What does `string & number` evaluate to, and why?*
- **Response**: `never`, because in set theory, the intersection of two disjoint sets contains zero elements. No value in JavaScript can simultaneously be both a string and a number.
