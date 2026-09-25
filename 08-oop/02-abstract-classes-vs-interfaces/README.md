# Lesson 08.2: Abstract Classes vs Interfaces & Composition vs Inheritance

## 1. What is it?
- **Interface**: A purely compile-time contract. It emits zero JavaScript code and cannot contain default method implementations or constructor code.
- **Abstract Class**: A base class that cannot be instantiated directly with `new`. It emits real JavaScript code, can maintain state, and can provide both concrete methods and abstract method signatures that subclasses must implement (the Template Method Pattern).

---

## 2. Why does it exist?
Sometimes subclasses share identical setup, teardown, or orchestration code, but differ in one specific step.
An abstract class provides the shared skeleton algorithm while delegating the variable steps to derived classes.

---

## 3. Abstract Class vs Interface Decision Matrix
| Requirement | Choose `interface` | Choose `abstract class` |
| :--- | :--- | :--- |
| **Runtime footprint** | Zero JS output (100% erased). | Emits JS class definition. |
| **Shared implementation** | Cannot provide code or default methods. | Can provide concrete methods and state. |
| **Multiple inheritance** | A class can implement multiple interfaces. | A class can only extend ONE base class! |
| **Performance / Bundle size** | Zero bundle impact. | Adds bytes to your bundle. |

---

## 4. Syntax: The Template Method Pattern
```ts
export abstract class BaseReportGenerator {
  // Shared concrete template method:
  async generateReport(reportId: string): Promise<string> {
    const rawData = await this.fetchData(reportId);
    const formatted = this.formatData(rawData);
    await this.logTelemetry(reportId);
    return formatted;
  }

  // Abstract steps that subclasses MUST implement:
  protected abstract fetchData(id: string): Promise<unknown>;
  protected abstract formatData(data: unknown): string;

  // Concrete shared helper:
  private async logTelemetry(id: string): Promise<void> {
    console.log(`[TELEMETRY] Report ${id} generated.`);
  }
}
```

---

## 5. Composition vs Inheritance
> *"Favor object composition over class inheritance."* — Gang of Four

Deep inheritance trees (`A extends B extends C extends D`) become brittle nightmares when requirements shift.
In TypeScript, senior engineers favor **Composition via Interfaces**:
```ts
// Instead of extending SqlDatabase:
interface Logger { log(msg: string): void; }
interface Metrics { record(stat: string): void; }

class OrderService {
  constructor(
    private readonly logger: Logger,
    private readonly metrics: Metrics
  ) {}
}
```
This enables effortless unit testing and mocking!

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Trying to instantiate an abstract class:
// const r = new BaseReportGenerator(); // [FAIL] TS Error: Cannot create an instance of an abstract class.
```

---

## 7. Exercise
Open [exercise.ts](./exercise.ts) and implement a pluggable `PaymentGateway` using an abstract base class.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 8. Technical Interview Questions

### Question: When would you use an abstract class instead of an interface in TypeScript?
- **Expected Answer**: When you want to share code or default methods among classes.
- **Strong Answer**: Use an `interface` when you only need to define a shape, protocol, or polymorphic contract without adding runtime code or coupling classes to an inheritance hierarchy. Because TypeScript supports multiple interface implementation, interfaces allow flexible composition. Use an `abstract class` when subclasses share invariant lifecycle logic, state, or private helper methods (such as the Template Method pattern), where duplicating the boilerplate across every implementing class would introduce maintenance overhead.

---

## 9. 5-Minute Active Recall
1. Does an `abstract class` produce JavaScript output?
2. Can a TypeScript class extend more than one abstract class?
3. What design pattern does an abstract class with a concrete method calling abstract methods represent?

<details>
<summary>[RECALL] Check Answers</summary>

1. Yes, it compiles to an ES6 class.
2. No, JavaScript supports only single-class inheritance.
3. The Template Method Pattern.
</details>
