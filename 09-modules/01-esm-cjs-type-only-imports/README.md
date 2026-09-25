# Lesson 09.1: ES Modules, Type-Only Imports & Module Resolution

## 1. What is it?
- **ES Modules (ESM)**: The official JavaScript standard for modular code using `import` and `export` statements.
- **CommonJS (CJS)**: The legacy Node.js module system using `require()` and `module.exports`.
- **Type-Only Imports (`import type`)**: A syntax instructing the compiler that an import is strictly for type analysis and must never emit a runtime JavaScript `import` or `require`.
- **`verbatimModuleSyntax`**: Modern TypeScript compiler flag that treats non-type imports as literal runtime imports, making bundling predictable.

---

## 2. Why does it exist?
### The "Ghost Dependency" & Cyclic Dependency Problem:
If you write `import { User } from "./models.js"` where `User` is an interface:
- A standard bundler or compiler has to inspect the AST to figure out if `User` is a runtime class or a compile-time interface.
- If you have two files that only reference each other's types, an accidental runtime circular dependency can be introduced!
- With `import type { User } from "./models.js"`, you explicitly declare: *"This is a phantom type. Strip this import completely from emitted JS!"*

---

## 3. Syntax: Type-Only Imports & Exports
```ts
// 1. Dedicated Type Import (whole line is erased in JS emit)
import type { DatabaseConfig, ConnectionStatus } from "./config.js";

// 2. Inline Type Import (mixed runtime value and compile-time type)
import { connectDatabase, type ConnectionPool } from "./db.js";

// 3. Type-Only Re-export
export type { UserSession } from "./session.js";
```

---

## 4. Module Resolution: `NodeNext` vs `Bundler`
In modern `tsconfig.json`:
- `"moduleResolution": "NodeNext"`: Enforces explicit file extensions in imports (e.g. `import { foo } from "./foo.js"` even when authoring `foo.ts`). This guarantees compatibility with native Node.js ESM.
- `"moduleResolution": "Bundler"`: Designed for tools like Vite, Webpack, or Next.js that resolve file extensions automatically.

---

## 5. Barrel Files (`index.ts`) Trade-offs
A barrel file gathers exports from multiple files:
```ts
// src/components/index.ts
export * from "./Button.js";
export * from "./Modal.js";
export * from "./Card.js";
```
- **Pros**: Clean import paths (`import { Button } from "./components"`).
- **Cons**: Can dramatically slow down dev servers and bundlers (since importing one component forces loading every file in the directory) and trigger cyclic dependency bugs.

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Omission of .js extension under NodeNext:
// import { util } from "./util"; // [FAIL] Error under NodeNext: Relative import paths require an explicit file extension!
import { util } from "./util.js"; // [PASS] Points to the emitted JS file!
```

---

## 7. Exercise
Open [exercise.ts](./exercise.ts) and configure type-only imports and exports across simulated multi-file modules.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 8. Technical Interview Questions

### Question: Why was `import type` added to TypeScript, and what is `verbatimModuleSyntax`?
- **Expected Answer**: To make sure types are erased and don't produce runtime imports.
- **Strong Answer**: In earlier versions of TypeScript, the compiler used heuristic type-directed elision to guess whether an import was a type or a value. When using standalone compilers that don't perform type checking (such as Babel, SWC, or esbuild), the tool cannot know whether `import { Foo } from './foo'` is a type or a value, which often resulted in either broken imports of non-existent runtime identifiers or retained circular dependencies. `import type` provides unambiguous syntax: any identifier imported with `type` is guaranteed to be dropped. `verbatimModuleSyntax` (replacing `importsNotUsedAsValues`) strictly enforces this: any regular `import` is emitted verbatim into the JS output, and any `import type` is completely erased.

---

## 9. 5-Minute Active Recall
1. What happens to `import type { X } from './y.js'` in the compiled JavaScript output?
2. Why must relative imports use `.js` extensions under `"moduleResolution": "NodeNext"` even when authoring `.ts` files?
3. What is a potential performance downside of barrel files?

<details>
<summary>[RECALL] Check Answers</summary>

1. It is completely removed.
2. Because Node.js's native ES module loader requires explicit file extensions matching the emitted files.
3. They can cause bundlers and testing tools to parse dozens of unrelated files, increasing compile times and triggering circular dependencies.
</details>
