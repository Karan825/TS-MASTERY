# Lesson 17.1: Advanced TypeScript Design Patterns — Type-Safe Builders & State Machines

## 1. What is it?
This lesson focuses on patterns that leverage the TypeScript type system to guarantee correctness:
1. **The Type-Safe Builder Pattern (Phantom State Accumulation)**: A builder that *refuses to compile `.build()`* until all mandatory fields have been set.
2. **Finite State Machines (FSM)**: Enforcing legal transitions between states at the type level.
3. **The Strategy Pattern**: Pluggable typed algorithms.

---

## 2. Why does it exist?
In traditional OOP builders, if a caller forgets to call `.setHost()`, the `.build()` method either throws a runtime exception or returns a half-baked object with `undefined`.
Using **Phantom Type Parameters**, TypeScript can track which builder steps have been completed directly in the type system! `.build()` only exists on `Builder<true, true>`!

---

## 3. Mental Model: The Checklist Lock
```
New Builder:             ConfigBuilder<false, false>   (.build() DOES NOT EXIST)
                              │
Call .setHost():         ConfigBuilder<true, false>    (.build() DOES NOT EXIST)
                              │
Call .setPort():         ConfigBuilder<true, true>     (.build() UNLOCKED! 🔓)
```

---

## 4. Syntax: The Type-Safe Builder
```ts
interface ServerConfig {
  host: string;
  port: number;
}

class SafeServerBuilder<HasHost extends boolean = false, HasPort extends boolean = false> {
  private hostVal?: string;
  private portVal?: number;

  setHost(host: string): SafeServerBuilder<true, HasPort> {
    const next = new SafeServerBuilder<true, HasPort>();
    next.hostVal = host;
    next.portVal = this.portVal;
    return next;
  }

  setPort(port: number): SafeServerBuilder<HasHost, true> {
    const next = new SafeServerBuilder<HasHost, true>();
    next.hostVal = this.hostVal;
    next.portVal = port;
    return next;
  }

  // .build() is ONLY callable when BOTH HasHost and HasPort are true!
  build(this: SafeServerBuilder<true, true>): ServerConfig {
    return {
      host: this.hostVal!,
      port: this.portVal!,
    };
  }
}
```

---

## 5. Exercise
Open [exercise.ts](./exercise.ts) and verify the builder pattern.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 6. Technical Interview Questions

### Question: How can you enforce at compile time that mandatory builder methods are called before `.build()` is invoked?
- **Expected Answer**: Use phantom type parameters on the builder class.
- **Strong Answer**: We parameterize the builder class with boolean flags representing each required property (e.g. `Builder<HasA extends boolean = false, HasB extends boolean = false>`). Each setter method returns a new builder instance where its corresponding type flag is flipped to `true`. Finally, we use an explicit `this` parameter annotation on `.build(this: Builder<true, true>)`. If the caller attempts to invoke `.build()` without setting all required fields, TypeScript's compiler rejects the call with an error stating that the `this` context is not assignable, completely eliminating uninitialized object bugs at compile time.

---

## 7. 5-Minute Active Recall
1. How does `this: Builder<true, true>` prevent calling `.build()` prematurely?
2. What is a "phantom type"?
3. When should you avoid overusing complex type-level state machines?

<details>
<summary>[RECALL] Check Answers</summary>

1. It restricts the method's calling context so that only an instance with both flags set to `true` can invoke it.
2. A type parameter that is used only to track compile-time constraints and does not correspond to a physical runtime property.
3. When simple runtime validation in `.build()` is sufficient and the extra type complexity slows down compiler evaluation and confuses teammates.
</details>
