# Final Assessment — Part 1: Conceptual Mastery (50 Questions)

> **Instructions**: Attempt all questions on paper or in a text document before consulting the answer key in [`answers-and-solutions/part1-answers.md`](./answers-and-solutions/part1-answers.md).
> Passing threshold: 45/50 (90%).

---

### Section A: JavaScript Foundations & Memory Model (Q1 - Q7)
1. What is the fundamental difference in how primitives and object references are stored and compared in JavaScript?
2. If `const config = { maxRetries: 3 }`, why does `config.maxRetries = 5` succeed without error in both JavaScript and TypeScript?
3. How does `Object.freeze()` differ from TypeScript's `readonly` modifier in terms of shallow vs deep immutability and runtime enforcement?
4. Explain what a closure is and why variables captured inside a closure are not garbage-collected when the enclosing function returns.
5. In JavaScript's event loop, why do Promises (microtasks) execute before `setTimeout(..., 0)` (macrotasks)?
6. Name the four standard rules of `this` binding in JavaScript functions.
7. Why do arrow functions ignore `.bind()`, `.call()`, and `.apply()` for `this` context binding?

### Section B: TypeScript Fundamentals & Type Lattice (Q8 - Q15)
8. What does "Type Erasure" mean, and what is the runtime performance cost of TypeScript types?
9. When should you explicitly annotate a type versus allowing TypeScript to infer it?
10. What is the mathematical difference between a union type (`A | B`) and an intersection type (`A & B`) in set theory?
11. Why does an intersection of object types `{ a: string } & { b: number }` contain more accessible properties than a union `{ a: string } | { b: number }`?
12. Contrast `any` and `unknown`: Why is `unknown` considered type-safe while `any` is dangerous?
13. What is the `never` type, and why does `string & number` evaluate to `never`?
14. What is the difference between `() => void` and `() => undefined` in a function type declaration?
15. What is a labeled tuple, and how does `readonly [string, number]` prevent tuple mutations?

### Section C: The Type System & Control-Flow Analysis (Q16 - Q23)
16. Explain the difference between nominal typing and structural typing.
17. What is the Excess Property Check, and why does it trigger on object literals but not on variable references?
18. How does TypeScript's Control-Flow Analysis (CFA) narrow types across conditional branches?
19. What is the exact syntax for a custom type predicate, and what does it tell the compiler?
20. How does an assertion function (`asserts val is T`) differ from a custom type predicate (`val is T`)?
21. What three components are required to form a Discriminated Union?
22. Why must the discriminant property of a Discriminated Union be a literal type rather than a general primitive like `string`?
23. How does the `const _exhaustive: never = val` idiom catch missing switch cases at compile time?

### Section D: Functions & Variance (Q24 - Q30)
24. In TypeScript function compatibility, are return types covariant or contravariant? Explain why.
25. Under `--strictFunctionTypes`, are function parameter types covariant or contravariant? Explain why.
26. Why does TypeScript permit method shorthand syntax (`method(): void`) to remain bivariant?
27. What is the difference between an overload signature and the implementation signature of an overloaded function?
28. Can external callers directly invoke the implementation signature of an overloaded function?
29. How do you type an explicit `this` parameter in a standalone TypeScript function?
30. Why can't TypeScript enforce checked exceptions (like Java's `throws Exception`)?

### Section E: Generics & Type Parameter Constraints (Q31 - Q37)
31. What relationship does a generic parameter `<T>` preserve that `any` destroys?
32. What does `<T extends object>` accomplish, and what operations does it unlock?
33. What is a default generic parameter, and what is its syntax?
34. What is the "All-or-Nothing" generic argument rule in TypeScript function calls?
35. How can you use function currying to work around TypeScript's lack of partial generic inference?
36. Why is `<T extends string>(s: T): void` considered a "useless generic" anti-pattern?
37. How does a generic repository pattern preserve entity types without requiring type assertions?

### Section F: Advanced Types & Type-Level Programming (Q38 - Q44)
38. What does `keyof T` produce for an object type?
39. What is an indexed access type (`T[K]`), and what does `T[number]` produce for an array?
40. Explain the syntax and purpose of a Mapped Type.
41. How do you remove optionality or readonly modifiers in a mapped type?
42. How does key remapping via the `as` clause allow filtering properties out of a mapped type?
43. What is a Distributive Conditional Type, and what causes a conditional type to distribute?
44. How do you stop a conditional type from distributing across a union?

### Section G: Compiler, Boundaries & Enterprise Architecture (Q45 - Q50)
45. How does the `infer` keyword work in conditional types, and where can it be used?
46. What are Branded Types, and what vulnerability (Primitive Obsession) do they eliminate?
47. How is `Omit<T, K>` implemented in TypeScript's standard library?
48. What is the difference between TypeScript's `private` keyword and JavaScript's `#private` fields?
49. What does `"noUncheckedIndexedAccess": true` change in the type of array and dictionary lookups?
50. Why should incoming API response payloads always be typed as `unknown` before validation?

---
*Check your answers against [`answers-and-solutions/part1-answers.md`](./answers-and-solutions/part1-answers.md).*
