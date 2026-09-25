# Level 00: JavaScript Foundations Needed for TypeScript
 
Before mastering TypeScript's advanced structural type system, generics, and compiler mechanics, you must have an instinctive, rock-solid grasp of **how JavaScript actually executes at runtime**.
 
TypeScript does not alter runtime behavior—it strips away at compile time and leaves pure JavaScript. If you do not understand variable declarations, functions, memory references, closures, or the event loop, TypeScript will feel confusing instead of empowering.
 
---
 
## Lesson Directory
 
| Lesson | Focus | What You Will Master |
| :--- | :--- | :--- |
| **[00. Variables, Functions & Syntax](./00-variables-and-functions/README.md)** | Ground Zero | `const` vs `let` (and why not `var`), template literals (`` `Hello ${name}` ``), function declarations, arrow functions, default/optional parameters, and `void` returns. |
| **[01. Primitives vs References](./01-primitives-and-references/README.md)** | Memory Model | Stack vs heap, pointer sharing, mutation traps, shallow vs deep copying, and compile-time immutability with `as const`. |
| **[02. Closures & Scope](./02-closures-and-scope/README.md)** | Lexical Scope | Lexical environments, scope chains, closure mechanics, private state encapsulation, and memory leak prevention. |
| **[03. Objects, Prototypes & `this`](./03-objects-prototypes-this/README.md)** | Prototype Chain | Prototype inheritance, `__proto__` vs `prototype`, `this` binding rules (default, implicit, explicit with `call`/`apply`/`bind`, and lexical arrow functions). |
| **[04. Async JavaScript & The Event Loop](./04-async-event-loop/README.md)** | Async Execution | Call stack, Web APIs / libuv, Microtask queue (`Promise`), Macrotask queue (`setTimeout`), starvation, and event loop ordering. |
 
---
 
## Recommended Starting Point
 
If you are coming from Python or have never written JavaScript functions and variables before, start directly with:
-> **[Lesson 00.0: Variables, Functions & Syntax Fundamentals](./00-variables-and-functions/README.md)**
 
To run the ground-zero lesson code:
```bash
npx tsx 00-javascript-foundations/00-variables-and-functions/lesson.ts
```
