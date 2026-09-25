# TypeScript Mastery Learning Roadmap

This roadmap outlines the recommended progression through all 26 modules. It is designed to move systematically from runtime JavaScript mechanics to type modeling, advanced generics, compiler architecture, and production engineering.

---

## Milestone Overview

```
Phase 1: Foundations & Type Mechanics (Levels 00 - 04)
   │
   ▼
Phase 2: Generics & The Advanced Type System (Levels 05 - 07)
   │
   ▼
Phase 3: Architecture, Compiler, & Boundaries (Levels 08 - 14)
   │
   ▼
Phase 4: Real-World Ecosystems & Patterns (Levels 15 - 17)
   │
   ▼
Phase 5: Practical Mastery, Refactoring & Debugging (Levels 18 - 21)
   │
   ▼
Phase 6: Production Capstone & Interview Mastery (Levels 22 - 25)
```

---

## Detailed Stage-by-Stage Plan

### Stage 1: Runtime Reality & Core Mechanics (Est. 8 - 12 hours)
*Goal: Understand JavaScript runtime truth and how TypeScript layers type checking on top.*
- [x] **00. JavaScript Foundations Needed for TypeScript**
  - Ground-zero: `const` vs `let`, template literals, function declarations, and arrow functions
  - Primitives vs references & memory models
  - Closures, lexical environment, and scope chains
  - Objects, prototypes, prototype inheritance, and `this` binding
  - The Event Loop, Promises, and Microtask queue
- [x] **01. TypeScript Fundamentals**
  - Compile-time vs runtime (Type Erasure)
  - Type annotations vs Type inference
  - Primitives, arrays, readonly arrays, and tuples
  - Unions, intersections, and literal types
  - `any` vs `unknown` vs `never` vs `void`
- [x] **02. Type System Deep Dive**
  - Structural typing (duck typing) vs Nominal typing
  - Excess property checks (object literals vs references)
  - Type narrowing, control-flow analysis, and custom type predicates
  - Discriminated unions & exhaustive checking with `never`
  - Function compatibility and variance (covariance & contravariance)

### Stage 2: Functions, Object Modeling & Generics (Est. 12 - 16 hours)
*Goal: Model complex application logic and build reusable, typesafe abstractions.*
- [x] **03. Functions**
  - Call signatures, optional/default/rest parameters
  - Function overloads vs unions
  - `this` parameter typing and callable object signatures
- [x] **04. Interfaces and Type Aliases**
  - Interface vs Type: In-depth architectural trade-offs
  - Declaration merging and index signatures
  - Recursive object modeling
- [x] **05. Generics (The Core of Reusability)**
  - Why generics exist: Preserving relationships vs `any`
  - Constraints with `extends`
  - Multiple type parameters and inference
  - Generic repositories and service patterns

### Stage 3: The Type-Level Programming Engine (Est. 14 - 18 hours)
*Goal: Write types that compute other types at compile time.*
- [x] **06. Advanced Types**
  - `keyof`, `typeof` in type positions, and indexed access types
  - Mapped types and key remapping (`as`)
  - Conditional types, distributivity over unions, and `infer`
  - Template literal types and branded / nominal types
- [x] **07. Built-in Utility Types**
  - Re-implementing and mastering `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`
  - Re-implementing `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited`

### Stage 4: Architecture, Compiler, & System Boundaries (Est. 10 - 14 hours)
*Goal: Structure real projects, tame the compiler, and defend runtime boundaries.*
- [x] **08. Classes and OOP**
  - Access modifiers (`public`, `private`, `protected`), `#private`, parameter properties
  - Abstract classes vs Interfaces & Composition vs Inheritance
- [x] **09. Modules and Project Structure**
  - ESM vs CJS, type-only imports (`import type`), barrel files, and circular dependencies
- [x] **10. TSConfig & Compiler Flags**
  - `strict`, `strictNullChecks`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, emit flags
- [x] **11. Runtime vs Type System**
  - Why TypeScript cannot validate API responses at runtime
  - Type boundary defenses and runtime schema validation
- [x] **12. Error Handling & External Data**
  - Safe error handling with `unknown` in catch variables
  - Result / Either patterns vs throwing exceptions
- [x] **13. Async TypeScript**
  - `Promise<T>`, typed fetch patterns, `Promise.allSettled`, concurrent pipelines
- [x] **14. Type-Safe API Design**
  - DTOs, request/response models, pagination, query params, generic client architecture

### Stage 5: Frameworks, Patterns & Engineering Skills (Est. 12 - 16 hours)
*Goal: Apply TypeScript in modern application stacks and master design patterns.*
- [x] **15. TypeScript with Node.js**
  - Service/Controller/Repository layers, environment configuration validation
- [x] **16. TypeScript with React**
  - Component props, hooks, discriminated unions for UI state, generic components, event typing
- [x] **17. TypeScript Design Patterns**
  - Discriminated state machines, Builder pattern, Strategy pattern, Strongly typed event bus
- [x] **18. TypeScript Code Reading**
  - Deconstructing unfamiliar generic and conditional codebases, predicting complex types
- [x] **19. Refactoring JavaScript to TypeScript**
  - Step-by-step conversion of unsafe dynamic code into sound, strict TypeScript
- [x] **20. Debugging TypeScript**
  - Diagnosing cryptic compiler errors: narrowing failures, generic mismatch, excess property traps
- [x] **21. Testing TypeScript**
  - Compile-time type assertions (`Expect<Equal<A, B>>`) and unit tests with Vitest

### Stage 6: Capstone Project & Career Mastery (Est. 15 - 20 hours)
*Goal: Build a full software project and achieve interview readiness.*
- [x] **22. Capstone Project: Workflow & Compliance Engine**
  - Production-grade workflow engine with typed schemas, validators, rule engine, and repository
- [x] **23. Interview Track**
  - Beginner, Intermediate, and Advanced interview questions with weak vs strong answers
- [x] **24. Coding Interview Track**
  - High-performance data structures in TypeScript (LRU Cache, Typed Event Emitter, BST, Trie)
- [x] **25. Final Assessment**
  - 7-part exam: Conceptual (50), Prediction (20), Debugging (10), Implementation (10), Advanced (10), Architecture, Simulated Interview
