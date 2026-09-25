# Lesson 02.4: Type Compatibility, Function Variance & Subtyping

## 1. What is it?
**Variance** describes how the subtyping relationship of complex types (like `Container<T>` or `(x: T) => R`) relates to the subtyping relationship of their constituent type `T`.
- **Covariant** (same direction): If `Sub` $\subseteq$ `Super`, then `Container<Sub>` $\subseteq$ `Container<Super>`.
- **Contravariant** (reversed direction): If `Sub` $\subseteq$ `Super`, then `Consumer<Super>` $\subseteq$ `Consumer<Sub>`.
- **Invariant** (no subtyping): `Container<Sub>` and `Container<Super>` cannot be substituted for each other.
- **Bivariant** (both directions allowed): Historical compromise in TypeScript method declarations.

---

## 2. Why does it exist?
Function compatibility is one of the most intellectually challenging areas for developers.
- Why can a function that returns a `Dog` be used where a function returning an `Animal` is expected? (Covariance)
- Why can a function that accepts an `Animal` be used where a function accepting a `Dog` is expected? (Contravariance)
Understanding this prevents perplexing compiler errors when passing callbacks, event listeners, and higher-order functions.

---

## 3. Mental Model: Producers vs Consumers
```
PRODUCER (Return Types) — COVARIANT:
If you need an Animal, and I produce a Dog:
You are happy! A Dog is an Animal. (Same direction: Dog -> Animal)

CONSUMER (Parameter Types) — CONTRAVARIANT:
If you expect a function that can handle a Dog:
And I give you a function that can handle ANY Animal:
You are happy! The function can safely handle your Dog and more!
(Reversed direction: Function accepting Super can replace function accepting Sub!)
```

---

## 4. Syntax & The `--strictFunctionTypes` Flag
```ts
class Animal { name = "Animal"; }
class Dog extends Animal { bark() { console.log("Woof"); } }

type AnimalConsumer = (a: Animal) => void;
type DogConsumer = (d: Dog) => void;

let handleAnimal: AnimalConsumer = (a) => console.log(a.name);
let handleDog: DogConsumer = (d) => d.bark();

// CONTRAVARIANCE:
// Can we assign handleAnimal to handleDog?
handleDog = handleAnimal; // [PASS] YES! handleAnimal only needs an Animal; passing it a Dog is 100% safe!

// Can we assign handleDog to handleAnimal?
// handleAnimal = handleDog; // [FAIL] TS Error under --strictFunctionTypes!
// Why? If someone calls handleAnimal(new Cat()), handleDog would attempt to call cat.bark() and crash!
```

---

## 5. Method Shorthand vs Function Property Syntax
```ts
interface EventTargetMethod {
  // Method shorthand: BIVARIANT (allows unsafe assignments for backwards compatibility)
  emit(event: Dog): void;
}

interface EventTargetProperty {
  // Property syntax: STRICTLY CONTRAVARIANT (checked safely under --strictFunctionTypes)
  emit: (event: Dog) => void;
}
```
> [!IMPORTANT]
> Always use function property syntax `prop: (arg: T) => R` for callback definitions on interfaces when you want strict type safety!

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Covariant Array Mutation Trap
let dogs: Dog[] = [new Dog()];
// In TypeScript, arrays are covariant:
let animals: Animal[] = dogs; // Allowed!

// But mutating 'animals' can break 'dogs' at runtime!
// animals.push(new Cat()); // Now dogs contains a Cat!
// dogs[1].bark(); // Runtime crash!
// Solution: Use 'readonly Animal[]' to prevent mutation when widening!
```

---

## 7. Real-World Production Usage
Callback registrations, event handlers, and comparator functions:
```ts
export type Comparator<T> = (a: T, b: T) => number;

// A generic comparator for Any object with an 'id' can sort specific User objects:
const compareById: Comparator<{ id: number }> = (a, b) => a.id - b.id;
const users: { id: number; name: string }[] = [{ id: 2, name: "B" }, { id: 1, name: "A" }];
users.sort(compareById); // [PASS] Contravariance in action!
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and demonstrate:
1. Contravariant function assignment with event handlers.
2. Readonly array covariance protection.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
interface Logger<T> {
  log: (item: T) => void;
}

let stringLogger: Logger<string>;
let unknownLogger: Logger<unknown> = { log: (x) => console.log(x) };

// Why does this compile, but the inverse does not?
stringLogger = unknownLogger;
```
**Diagnosis**: Contravariance! A logger capable of logging `unknown` (anything) can safely be used anywhere a `string` logger is required, because whenever the consumer passes a `string`, the `unknownLogger` knows how to handle it.

---

## 10. Technical Interview Questions

### Question: Explain covariance and contravariance with respect to function parameters and return types in TypeScript.
- **Expected Answer**: Return types are covariant and parameters are contravariant.
- **Strong Answer**: Variance describes how subtyping between types $A \subseteq B$ affects subtyping between operations over those types. Function return types are **covariant**: if a function returns a subtype $A$, it can be substituted where a function returning supertype $B$ is expected, because the caller receives at least what it requested. Conversely, under `--strictFunctionTypes`, function parameters are **contravariant**: a function accepting supertype $B$ can be substituted where a function accepting subtype $A$ is expected, because the replacement function demands less specificity than the caller will provide. If parameters were covariant, the function could attempt to access subtype-specific members on a supertype instance, triggering a runtime crash.

---

## 11. 5-Minute Active Recall
1. Are function return types covariant or contravariant?
2. Are function parameter types covariant or contravariant under `--strictFunctionTypes`?
3. Why does TypeScript allow method shorthand syntax to remain bivariant?

<details>
<summary>[RECALL] Check Answers</summary>

1. Covariant.
2. Contravariant.
3. For historical reasons and backwards compatibility with existing JavaScript arrays and DOM event handlers (e.g. `Array.prototype.push`).
</details>
