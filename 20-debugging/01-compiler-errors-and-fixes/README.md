# Level 20: Debugging Cryptic TypeScript Compiler Errors

## Objective
Debuggers don't guess—they understand why the compiler rejected the AST.
This module gives you 5 realistic compiler breakdowns in [`broken-cases.ts`](./broken-cases.ts).

---

## Debugging Framework
For each broken case:
1. **Read the Error Message Closely**:
   - Don't just look at the red squiggly line. Read the *type difference*:
   *"Type 'X' is not assignable to type 'Y'. Property 'Z' is missing in type 'X'."*
2. **Identify the Compiler's Perspective**:
   - What invariant is the compiler trying to protect?
   - Is it preventing mutation? Protecting contravariant function parameters? Catching typos via excess property checks?
3. **Formulate a Minimal Fix**:
   - The fastest way to satisfy the compiler.
4. **Formulate the Production-Grade Fix**:
   - The architectural fix that makes the code cleaner, safer, and maintainable.

---

## 📖 Solutions & Diagnostics
After analyzing the broken cases, open [`diagnosis-and-fixes.ts`](./diagnosis-and-fixes.ts) to review the in-depth architectural diagnostics.
