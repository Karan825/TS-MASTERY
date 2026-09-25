# Lesson 10.1: TSConfig Deep Dive — The Architect's Compiler Guide

## 1. What is it?
`tsconfig.json` controls the TypeScript compiler (`tsc`). It governs:
1. **Language & Environment**: Which JavaScript version to emit (`target`), which built-in APIs exist (`lib`).
2. **Module System**: How files import each other (`module`, `moduleResolution`).
3. **Type-Checking Strictness**: How forgiving or bulletproof the type checker is (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
4. **Emit & Artifacts**: Generating `.js`, source maps (`sourceMap`), and declaration files (`declaration`, `declarationMap`).

---

## 2. Why does it exist?
A team can write TypeScript with zero safety if `strict: false` is set.
Understanding `tsconfig.json` is the difference between a codebase that merely has the appearance of types and a codebase with rigorous compile-time guarantees.

---

## 3. The Comprehensive Compiler Flags Guide

| Flag | What It Does | When to Enable in Production |
| :--- | :--- | :--- |
| `"strict": true` | Umbrella flag that enables `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`. | **Always**. Non-negotiable for new production projects. |
| `"noUncheckedIndexedAccess": true` | Forces indexed access lookups (`obj[key]`, `arr[i]`) to include `undefined` in their type. | Highly recommended for backends and financial systems to prevent out-of-bounds indexing bugs. |
| `"exactOptionalPropertyTypes": true` | Distinguishes between a property being omitted vs being explicitly assigned `undefined` (`{ a?: number }` vs `{ a?: number \| undefined }`). | Enable when precision in database updates or JSON serialization is critical. |
| `"useUnknownInCatchVariables": true` | Changes default catch variable type from `any` to `unknown`. | **Always**. Included by default under `"strict": true` in modern TS. |
| `"noImplicitOverride": true` | Requires subclass methods that override superclass methods to use the `override` keyword. | **Always**. Prevents silently orphaned overrides during refactoring. |
| `"esModuleInterop": true` | Emits compatibility helpers for importing CommonJS packages with default imports (`import express from 'express'`). | **Always** when interacting with legacy CJS packages. |
| `"declaration": true` | Emits `.d.ts` declaration files for consumers. | **Mandatory** when publishing libraries or shared internal packages. |
| `"declarationMap": true` | Generates `.d.ts.map` source maps linking `.d.ts` directly back to the original `.ts` source files. | **Mandatory** in monorepos; allows "Go to Definition" in IDEs to jump straight to source code. |

---

## 4. Mental Model: The Strictness Gradient
```
Level 0:  "strict": false
          (any everywhere, null is ignored, no implicit checks - essentially fancy JS)
          ▲
Level 1:  "strict": true
          (The standard professional baseline)
          ▲
Level 2:  "strict": true + "noUncheckedIndexedAccess": true
          (Eliminates out-of-bounds crashes)
          ▲
Level 3:  "strict": true + "noUncheckedIndexedAccess": true + "exactOptionalPropertyTypes": true
          (Maximum mathematical safety)
```

---

## 5. Common Configuration Traps
```json
// [FAIL] TRAP 1: Forgetting moduleResolution with modern modules
{
  "compilerOptions": {
    "module": "NodeNext"
    // Missing "moduleResolution": "NodeNext"!
    // Can cause bizarre module lookup failures!
  }
}

// [FAIL] TRAP 2: Specifying 'paths' without matching runtime resolution
{
  "compilerOptions": {
    "paths": { "@/*": ["src/*"] }
  }
}
// 'paths' only teaches TypeScript how to find files at compile time!
// It does NOT rewrite the emitted JS paths unless a bundler (Vite, Webpack) handles it!
```

---

## 6. Exercise
Open [exercise.ts](./exercise.ts) and demonstrate how `noUncheckedIndexedAccess` changes runtime safety.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 7. Technical Interview Questions

### Question: What is the impact of enabling `noUncheckedIndexedAccess`, and why is it not part of `"strict": true` by default?
- **Expected Answer**: It adds `undefined` to index lookups. It's not in strict mode because it would break existing codebases.
- **Strong Answer**: In JavaScript, reading an array out of bounds (`[1, 2][99]`) or looking up a non-existent dictionary key returns `undefined`. Under standard `"strict": true`, TypeScript unsoundly types `const x = arr[0]` as `number` (not `number | undefined`). Enabling `noUncheckedIndexedAccess` repairs this type-system unsoundness by forcing all indexed lookups to include `undefined` (`T | undefined`). The TypeScript team chose not to include it inside `"strict": true` because doing so would instantly cause thousands of compile errors across virtually every existing codebase and tutorial, requiring explicit bounds checks or non-null assertions on every standard array loop.

---

## 8. 5-Minute Active Recall
1. Name three flags included inside `"strict": true`.
2. What does `"declarationMap": true` do in a monorepo?
3. Does configuring `"paths"` in `tsconfig.json` alter the emitted JavaScript paths?

<details>
<summary>[RECALL] Check Answers</summary>

1. `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`.
2. It generates source maps linking `.d.ts` declaration files back to their `.ts` source files for IDE navigation.
3. No! `tsc` never rewrites module import specifiers; path aliases require a bundler or runtime loader.
</details>
