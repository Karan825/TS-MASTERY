# Course Progress Tracker

Use this checklist to track your mastery journey across all topics.  
Do not mark a topic as **Mastered** until you have:
1. Implemented the exercise in `exercise.ts` without viewing `solution.ts`.
2. Passed the debugging challenge.
3. Answered the 5-minute active recall questions without checking notes.
4. Articulated the mental model in your own words.

**Status Legend:**
- [NOT STARTED] `Not Started`
- [INTERMEDIATE] `Learning` (Reading lesson & running code)
- [PRACTICING] `Practicing` (Attempting exercise & debugging)
- [ESSENTIAL] `Comfortable` (Solved exercise, checked solution)
-  `Mastered` (Can explain in an interview & build from memory)

---

## Level 00 — JavaScript Foundations Needed for TypeScript
- [ ] **00-variables-and-functions** (Ground zero: const vs let, template literals, function declarations, arrow functions, parameter & return typing) `Status: [NOT STARTED]`
- [ ] **01-primitives-and-references** (Memory model, values vs references, mutation) `Status: [NOT STARTED]`
- [ ] **02-closures-and-scope** (Lexical scope, closure mechanics, module patterns) `Status: [NOT STARTED]`
- [ ] **03-objects-prototypes-this** (Prototypes, prototype chain, `this` binding) `Status: [NOT STARTED]`
- [ ] **04-async-event-loop** (Call stack, microtasks, macrotasks, Promises) `Status: [NOT STARTED]`

## Level 01 — TypeScript Fundamentals
- [ ] **01-compile-time-vs-runtime** (Type erasure, AST, transpilation) `Status: [NOT STARTED]`
- [ ] **02-type-annotations-and-inference** (When to annotate vs when to infer) `Status: [NOT STARTED]`
- [ ] **03-primitives-arrays-tuples** (Tuples, readonly arrays, literal inference) `Status: [NOT STARTED]`
- [ ] **04-unions-intersections-literals** (Set theory in types, unions vs intersections) `Status: [NOT STARTED]`
- [ ] **05-any-unknown-never-void** (Top and bottom types, safe type casting) `Status: [NOT STARTED]`

## Level 02 — Type System Deep Dive
- [ ] **01-structural-typing-and-excess-properties** (Duck typing, object literal checks) `Status: [NOT STARTED]`
- [ ] **02-narrowing-and-type-guards** (Control-flow analysis, custom predicates `is`) `Status: [NOT STARTED]`
- [ ] **03-discriminated-unions-exhaustive-never** (Discriminated unions, exhaustive `assertNever`) `Status: [NOT STARTED]`
- [ ] **04-type-compatibility-and-variance** (Covariance, contravariance, function variance) `Status: [NOT STARTED]`

## Level 03 — Functions
- [ ] **01-function-signatures-and-callbacks** (Callable types, optional params, rest tuples) `Status: [NOT STARTED]`
- [ ] **02-function-overloads** (Overload signatures vs implementation signature) `Status: [NOT STARTED]`
- [ ] **03-this-parameters-and-predicates** (Typing `this`, assertion functions `asserts`) `Status: [NOT STARTED]`

## Level 04 — Interfaces and Type Aliases
- [ ] **01-interfaces-vs-type-aliases** (Trade-offs, performance, when to use which) `Status: [NOT STARTED]`
- [ ] **02-declaration-merging-and-index-signatures** (Extending third-party types, index safety) `Status: [NOT STARTED]`

## Level 05 — Generics
- [ ] **01-generic-fundamentals-and-constraints** (Type parameters, `extends` constraint) `Status: [NOT STARTED]`
- [ ] **02-multiple-type-parameters-and-inference** (Argument inference, default generics) `Status: [NOT STARTED]`
- [ ] **03-generic-repositories-and-services** (Generic CRUD store, relationship preservation) `Status: [NOT STARTED]`

## Level 06 — Advanced Types
- [ ] **01-keyof-typeof-indexed-access** (Type queries, property lookup `T[K]`) `Status: [NOT STARTED]`
- [ ] **02-mapped-types-and-key-remapping** (`in keyof`, modifiers `-readonly`, `as` clause) `Status: [NOT STARTED]`
- [ ] **03-conditional-types-distributivity-infer** (`T extends U ? X : Y`, naked type distributivity, `infer`) `Status: [NOT STARTED]`
- [ ] **04-template-literals-and-branded-types** (String manipulation types, nominal branding) `Status: [NOT STARTED]`

## Level 07 — Built-in Utility Types
- [ ] **01-object-transformation-utilities** (`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`) `Status: [NOT STARTED]`
- [ ] **02-union-function-promise-utilities** (`Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Awaited`) `Status: [NOT STARTED]`

## Level 08 — Classes and OOP
- [ ] **01-classes-access-modifiers-parameter-properties** (`private` vs `#`, parameter properties) `Status: [NOT STARTED]`
- [ ] **02-abstract-classes-vs-interfaces** (Inheritance vs composition, polymorphic design) `Status: [NOT STARTED]`

## Level 09 — Modules and Project Structure
- [ ] **01-esm-cjs-type-only-imports** (`import type`, `verbatimModuleSyntax`, barrel files) `Status: [NOT STARTED]`

## Level 10 — TSConfig and Compiler
- [ ] **01-strict-compiler-flags** (`noUncheckedIndexedAccess`, `strictNullChecks`, emit controls) `Status: [NOT STARTED]`

## Level 11 — Runtime vs Type System
- [ ] **01-type-erasure-and-validation-boundaries** (Boundary validation, parsing untrusted JSON) `Status: [NOT STARTED]`

## Level 12 — Error Handling and External Data
- [ ] **01-result-patterns-and-unknown-errors** (Result monad, handling `catch (error: unknown)`) `Status: [NOT STARTED]`

## Level 13 — Async TypeScript
- [ ] **01-promises-concurrent-async-typed-fetch** (`Promise.allSettled`, generic typed client) `Status: [NOT STARTED]`

## Level 14 — Type-Safe API Design
- [ ] **01-type-safe-contracts-and-dtos** (Request/response DTOs, endpoint schema contracts) `Status: [NOT STARTED]`

## Level 15 — TypeScript with Node.js
- [ ] **01-typed-services-and-env-config** (Config validation, service/repository architecture) `Status: [NOT STARTED]`

## Level 16 — TypeScript with React
- [ ] **01-props-state-hooks-discriminated-ui** (Discriminated UI states, typed hooks, generic components) `Status: [NOT STARTED]`

## Level 17 — TypeScript Design Patterns
- [ ] **01-builders-state-machines-results** (Fluent builder, finite state machine, typed event bus) `Status: [NOT STARTED]`

## Level 18 — Code Reading
- [ ] **01-predict-the-type-complex-signatures** (Reading advanced open-source type definitions) `Status: [NOT STARTED]`

## Level 19 — Refactoring JavaScript to TypeScript
- [ ] **01-messy-js-to-bulletproof-ts** (Eliminating `any`, adding typesafe models) `Status: [NOT STARTED]`

## Level 20 — Debugging TypeScript
- [ ] **01-compiler-errors-and-fixes** (Narrowing failures, generic mismatch, excess property traps) `Status: [NOT STARTED]`

## Level 21 — Testing TypeScript
- [ ] **01-type-level-and-unit-testing** (Compile-time type assertions and Vitest tests) `Status: [NOT STARTED]`

## Level 22 — Capstone Real Project
- [ ] **workflow-compliance-engine** (Production type-safe event-driven workflow engine) `Status: [NOT STARTED]`

## Level 23 — Interview Preparation
- [ ] **beginner-questions** `Status: [NOT STARTED]`
- [ ] **intermediate-questions** `Status: [NOT STARTED]`
- [ ] **advanced-questions** `Status: [NOT STARTED]`

## Level 24 — Coding Interview Track
- [ ] **01-lru-cache** `Status: [NOT STARTED]`
- [ ] **02-type-safe-event-emitter** `Status: [NOT STARTED]`
- [ ] **03-binary-search-tree** `Status: [NOT STARTED]`
- [ ] **04-trie** `Status: [NOT STARTED]`

## Level 25 — Final Assessment
- [ ] **Part 1: Conceptual (50 Questions)** `Status: [NOT STARTED]`
- [ ] **Part 2: Type Prediction (20 Problems)** `Status: [NOT STARTED]`
- [ ] **Part 3: Debugging (10 Broken Programs)** `Status: [NOT STARTED]`
- [ ] **Part 4: Implementation (10 Tasks)** `Status: [NOT STARTED]`
- [ ] **Part 5: Advanced Types (10 Challenges)** `Status: [NOT STARTED]`
- [ ] **Part 6: Architecture Case Studies** `Status: [NOT STARTED]`
- [ ] **Part 7: Mock Interview Simulation** `Status: [NOT STARTED]`
