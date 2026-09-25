# Final Assessment — Part 7: Mock Technical Interview Simulation

> **Context**: This is a realistic 45-minute simulation of a Senior / Staff TypeScript Engineer technical interview.
> Read the candidate answers and evaluate them against the **Interviewer Rubric**.

---

## Transcript

### Round 1: Fundamentals & Type Erasure (10 min)

**Interviewer**: *"Welcome! Let's start with a foundational question. Can you walk me through what happens to TypeScript types between when you write them in your editor and when Node.js runs the code?"*

**Candidate**:
> *"When I write TypeScript, the compiler parses my code into an AST and type-checks assignments and call signatures against my declared interfaces. Once type checking completes without errors, the compiler performs Type Erasure. All interfaces, type aliases, generic parameter declarations, and type assertions are completely removed. The output is standard JavaScript. When Node executes this JavaScript in V8, there are no types in memory, and zero performance overhead from TypeScript."*

**Interviewer**: *"Great. If types are completely erased, what happens if an API returns unexpected data?"*

**Candidate**:
> *"TypeScript provides zero runtime guarantees for external data. If an API returns `{ error: 'Rate limit' }` when my code expected a `User` entity, TypeScript won't catch it. The application will execute until it attempts to access a property that doesn't exist on that object, throwing a runtime `TypeError`. To prevent this, experienced engineers enforce a runtime boundary using schema validators like Zod or custom type predicates to parse `unknown` payloads before casting them into internal domain models."*

**Interviewer Evaluation**: ⭐⭐⭐⭐⭐ **Strong Pass**. Candidate understands type erasure, performance implications, and boundary hazards without hesitation.

---

### Round 2: Type System Mechanics & Structural Typing (15 min)

**Interviewer**: *"Take a look at this snippet. Why does the second line fail, but the third line succeeds?"*
```ts
interface User { name: string }
function printUser(u: User) {}

printUser({ name: "Alice", age: 30 }); // [FAIL] Fails!
const person = { name: "Alice", age: 30 };
printUser(person); // [PASS] Succeeds!
```

**Candidate**:
> *"TypeScript is fundamentally structurally typed—if an object has all required properties of a target type, it is assignable. `person` has `name` (and also `age`), so it is a structural subtype of `User` and can be passed safely.*
> *However, fresh object literals undergo **Excess Property Checks**. When a developer writes an inline object literal at a call site, any extra property is almost certainly a typo or dead code, because the function signature has no way to access it. TypeScript triggers a compiler error to save the developer from typos. But when referencing an existing variable like `person`, TypeScript treats it as having an independent lifecycle and falls back to pure structural subtyping."*

**Interviewer Evaluation**: ⭐⭐⭐⭐⭐ **Strong Pass**. Perfect explanation of the Excess Property Check nuance.

---

### Round 3: Advanced Types & Generics (20 min)

**Interviewer**: *"How is the standard utility type `Omit<T, K>` implemented under the hood, and why is `K` constrained to `keyof any` rather than `keyof T`?"*

**Candidate**:
> *"In the TypeScript standard library, `Omit<T, K>` is implemented as: `type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>`.*
> *First, `keyof T` extracts all keys of `T`. `Exclude` uses a distributive conditional type `U extends K ? never : U` to filter out any keys matching `K`. Finally, `Pick` iterates over the remaining keys using a homomorphic mapped type.*
> *The reason `K` extends `keyof any` (`string | number | symbol`) instead of `keyof T` is to allow omitting keys from open objects or unions where some variants might not have that specific key. If `K` were constrained to `keyof T`, attempting to omit a key that only exists on one member of a union would produce a compile-time error."*

**Interviewer Evaluation**: ⭐⭐⭐⭐⭐ **Staff-Level Mastery**.
