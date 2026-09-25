# Lesson 21.1: Testing TypeScript — Compile-Time & Runtime Test Suites

## 1. What is it?
In TypeScript, testing is divided into two distinct dimensions:
1. **Runtime Testing (Vitest / Jest)**: Verifying that functions compute the correct values, handle edge cases, and throw/return proper errors at runtime.
2. **Compile-Time Type Testing**: Verifying that your complex types, generic transformations, and utility types compute the exact intended types without accidentally degrading into `any`, `unknown`, or `never`.

---

## 2. Why does it exist?
If you author a library or reusable generic utility (like `DeepReadonly` or `Pick`), a runtime test can pass even if the type system is completely broken and emits `any`!
Compile-time type testing ensures that refactoring a type does not introduce silent type regressions.

---

## 3. The `Expect<Equal<A, B>>` Type Testing Pattern
```ts
import type { Equal, Expect } from "../../shared/type-utils.js";

type MyType = string | number;
type Expected = number | string;

// If MyType !== Expected, TypeScript emits a compile error here:
type _Test = Expect<Equal<MyType, Expected>>;
```

---

## 4. Running the Tests
To run all runtime and compile-time tests in this module:
```bash
npm run test:types
```

---

## 5. Technical Interview Questions

### Question: Why aren't runtime tests sufficient for testing generic TypeScript utility types?
- **Expected Answer**: Because types are erased at runtime; runtime tests don't check the compiler's inferred types.
- **Strong Answer**: Runtime tests execute emitted JavaScript code. Because type erasure strips all generic parameters, interfaces, and conditional types, a runtime test can only assert on physical values. If a developer accidentally writes a generic utility that evaluates to `any`, runtime assertions like `expect(result.length).toBe(3)` will pass without error, even though the utility has silently destroyed type safety for all consumers. Compile-time type testing (using utilities like `Expect<Equal<Actual, Expected>>` or `tsd`) is required to verify type-level computations directly in the compiler AST.
