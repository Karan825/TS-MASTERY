# Lesson 08.1: Classes, Access Modifiers & Parameter Properties

## 1. What is it?
TypeScript enhances ES6 classes with static type-checking features:
1. **Access Modifiers**: `public` (default), `protected` (accessible in class and subclasses), `private` (accessible only in defining class).
2. **`#private` (ECMAScript Private)**: Native JavaScript runtime privacy.
3. **Parameter Properties**: A concise shorthand that declares and initializes class members directly in the constructor arguments.
4. **`readonly` Fields**: Properties that can only be written during constructor execution.
5. **The `override` Keyword**: Guarantees that a subclass method actually overrides a superclass method.

---

## 2. Why does it exist?
In vanilla JavaScript, declaring class fields requires boilerplate: declaring fields at the top, passing arguments to the constructor, and doing `this.x = x; this.y = y;`.
Parameter properties collapse this boilerplate into a single line.
Furthermore, access modifiers enforce encapsulation across large engineering teams.

---

## 3. `private` vs `#private`: The Critical Distinction
| Feature | TypeScript `private` | JavaScript `#private` |
| :--- | :--- | :--- |
| **Enforcement** | Compile-time only. | Runtime hard privacy (V8 engine). |
| **After Emit** | Transpiles to a normal JS property (`this.name`). | Transpiles to `#name` or a private WeakMap. |
| **Inspectable at Runtime?** | [PASS] Yes! (`obj["privateProp"]` works at runtime). | [FAIL] No! Cannot be accessed or inspected from outside. |

---

## 4. Syntax: Parameter Properties & The `override` Keyword
```ts
class BaseService {
  // Parameter properties: declares and assigns this.serviceName & this.timeoutMs automatically!
  constructor(
    public readonly serviceName: string,
    protected timeoutMs: number = 3000
  ) {}

  start(): void {
    console.log(`Starting ${this.serviceName}`);
  }
}

class ApiService extends BaseService {
  #secretApiKey: string; // Native private field!

  constructor(serviceName: string, apiKey: string) {
    super(serviceName);
    this.#secretApiKey = apiKey;
  }

  // With 'noImplicitOverride' enabled, 'override' ensures you didn't typo the super method!
  override start(): void {
    super.start();
    console.log("Configuring API auth token...");
  }
}
```

---

## 5. Common Mistakes
```ts
// [FAIL] MISTAKE: Duplicating field declaration and parameter property:
class BadAccount {
  userId: string; // [FAIL] Redundant!
  constructor(public userId: string) {} // Already declares and assigns userId!
}
```

---

## 6. Exercise
Open [exercise.ts](./exercise.ts) and implement a secure `PaymentProcessor` with parameter properties, `#private` encryption key, and `override` methods.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 7. Technical Interview Questions

### Question: What is the difference between TypeScript's `private` keyword and JavaScript's `#` private fields?
- **Expected Answer**: `private` is checked at compile-time; `#` is checked at runtime.
- **Strong Answer**: TypeScript's `private` modifier is an access check performed entirely by the type checker at compile time. It is erased during transpilation, meaning the emitted property is a standard, enumerable public JavaScript property accessible via bracket notation `obj["secret"]` or reflection at runtime. JavaScript `#` private identifiers, by contrast, are enforced by the JavaScript engine itself via private brand checks. They are completely inaccessible from outside the class lexical scope, even via `Object.keys()` or bracket notation.

---

## 8. 5-Minute Active Recall
1. What does `constructor(public readonly id: string)` do?
2. Does TypeScript's `private` keyword prevent someone from reading the field at JavaScript runtime?
3. What error does the `override` keyword prevent?

<details>
<summary>[RECALL] Check Answers</summary>

1. It automatically declares `public readonly id: string` on the class and assigns `this.id = id`.
2. No, it is purely a compile-time check.
3. It prevents bugs where a superclass method is renamed or deleted, leaving a subclass method orphaned without warning.
</details>
