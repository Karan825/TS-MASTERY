# Lesson 02.1: Structural Typing & The Excess Property Check Trap

## 1. What is it?
- **Nominal Typing** (Java, C#, C++, Rust): Type compatibility is determined by explicit declarations and class names. Two classes with identical fields are completely incompatible unless one explicitly inherits from the other.
- **Structural Typing** (TypeScript, Go): Type compatibility is determined purely by the **shape (members and properties)** of the type. If type $A$ has all the required properties of type $B$ with compatible types, $A$ is assignable to $B$ ($A$ is a subtype of $B$).

---

## 2. Why does it exist?
JavaScript is fundamentally dynamic. Code routinely creates plain object literals, extends prototypes, and passes anonymous dictionaries between modules. Nominal typing would feel like wearing a straitjacket in JavaScript. Structural typing gives JavaScript developers compiler safety while matching the natural flexibility of runtime JS.

---

## 3. Mental Model: Shape Matching & Subtyping
```
Type Point2D = { x: number; y: number }
Type Point3D = { x: number; y: number; z: number }

Is Point3D assignable to Point2D?
YES! Point3D has 'x' and 'y' (and something extra). It satisfies all requirements of Point2D.
Point3D is a SUBTYPE of Point2D (Point3D ⊆ Point2D in value sets).
```

### The "Magic" Explained: Why Do Excess Property Checks Exist?
Why does this happen?
```ts
interface User { name: string }

function printUser(u: User) { console.log(u.name); }

// [FAIL] COMPILE ERROR!
printUser({ name: "Alice", age: 30 });
// Argument of type '{ name: string; age: number; }' is not assignable to parameter of type 'User'.
// Object literal may only specify known properties, and 'age' does not exist in type 'User'.

// [PASS] BUT THIS COMPILES WITHOUT ERROR!
const person = { name: "Alice", age: 30 };
printUser(person); // NO ERROR! Why?!
```

**The Internal Compiler Rationale:**
If TypeScript strictly adhered to structural typing at all times, object literals would silently accept typos!
Imagine writing:
```ts
interface Options { timeoutMs?: number }
function configure(opt: Options) {}
configure({ timeouMs: 5000 }); // Typo!
```
Under pure structural typing, `{ timeouMs: 5000 }` has zero required properties, so it matches `Options`! The typo would cause a silent bug.

To prevent this, TypeScript introduces a special rule:
> **Object literals undergo "Excess Property Checks"** whenever they are assigned directly to a variable or passed as an argument with an explicit target type. If an object literal has any properties not listed in the target type, the compiler treats it as an intentional mistake.
> However, when referencing an existing variable (`person`), TypeScript assumes the variable has its own independent lifecycle and applies standard structural subtyping!

---

## 4. Syntax
```ts
interface EndpointConfig {
  url: string;
  retries?: number;
}

function connect(config: EndpointConfig) {}

// Direct literal: Excess property check active
// connect({ url: "https://api.io", timeout: 1000 }); // [FAIL] Error!

// Existing reference: Standard structural check
const rawConfig = { url: "https://api.io", timeout: 1000 };
connect(rawConfig); // [PASS] Allowed!
```

---

## 5. TypeScript vs JavaScript Comparison
In Python or Java, passing an unexpected class or dictionary key might require reflection or throw `AttributeError`. In TypeScript, structural typing allows polymorphic objects to flow freely, while excess property checking protects the immediate call site from typos.

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Assuming extra properties are stripped or deleted!
function sanitize(input: { id: string }) {
  return input; // At runtime, ANY extra properties passed to input ARE STILL THERE!
}

const malicious = { id: "123", isAdmin: true, secretToken: "xyz" };
const sanitized = sanitize(malicious);
console.log((sanitized as any).isAdmin); // true! TypeScript never alters runtime objects!
```

---

## 7. Real-World Production Usage
Allowing open extension vs strict sealing:
```ts
// Open contract with index signature:
interface ExtensiblePayload {
  readonly eventId: string;
  readonly [extra: string]: unknown; // Allows excess properties explicitly!
}
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and demonstrate structural assignability, excess property check triggers, and how index signatures change the behavior.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
interface WindowOptions {
  width: number;
  height: number;
  title?: string;
}

function createWindow(opts: WindowOptions) {}

// Why does this line fail, and what are two idiomatic ways to fix it?
createWindow({ width: 800, height: 600, Title: "Main Window" });
```
**Diagnosis**: `Title` has a capital `T`. The excess property check caught the typo. Fix 1: Fix the typo to `title`. Fix 2 (if dynamic properties are needed): add `[key: string]: unknown` to `WindowOptions`.

---

## 10. Technical Interview Questions

### Question: What is structural typing, and why does TypeScript allow a variable with excess properties to be passed, but disallows an object literal with the same excess properties?
- **Expected Answer**: Structural typing checks shapes. Object literals get excess property checks to catch typos.
- **Strong Answer**: TypeScript's type system is based on structural subtyping: if type $S$ contains all properties of type $T$, $S$ is a subtype of $T$ and can be substituted for $T$. However, when developers write fresh object literals at call sites, any property not specified in the target type represents either a typo or dead code that cannot be referenced by the receiving function. Therefore, TypeScript applies an **Excess Property Check** on fresh object literals. When a pre-existing variable is passed, TypeScript treats it as a non-fresh reference where additional properties may be legitimately needed elsewhere in the program, falling back to pure structural subtyping.

---

## 11. 5-Minute Active Recall
1. What is the difference between nominal and structural typing?
2. If `TypeA` has `{ x: number, y: number, z: number }` and `TypeB` has `{ x: number }`, is `TypeA` assignable to `TypeB`?
3. Why doesn't TypeScript strip excess properties at runtime?

<details>
<summary>[RECALL] Check Answers</summary>

1. Nominal relies on explicit names/classes; structural relies on shape/properties.
2. Yes, `TypeA` is a subtype of `TypeB` (it has `x`).
3. Because TypeScript types are completely erased; the compiler never emits runtime object filtering code.
</details>
