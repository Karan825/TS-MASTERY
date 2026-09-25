# Lesson 04.1: Interfaces vs Type Aliases — The Architectural Trade-offs

## 1. What is it?
In TypeScript, both `interface` and `type` (type alias) allow you to name and structure object shapes.
- An **interface** declares a virtual shape contract that can be extended, implemented by classes, and augmented via declaration merging.
- A **type alias** assigns a name to any type expression whatsoever (objects, primitives, unions, tuples, mapped types, or functions).

---

## 2. Why does it exist?
Historically, interfaces came first in TypeScript to support Object-Oriented patterns familiar to C# and Java developers. Type aliases were later expanded with advanced type-level programming capabilities (unions, intersections, conditional types). Because their capabilities overlap heavily for plain objects, beginners often ask: *"Which one should I use?"*

---

## 3. "Interface vs Type — What Experienced Developers Actually Do"

Many tutorials offer simplistic advice like: *"Always use interface until you need a type."*  
**Senior engineers do not follow simplistic dogmas. They evaluate architectural trade-offs:**

### The Direct Comparison:
| Feature | `interface` | `type` alias |
| :--- | :--- | :--- |
| **Object shapes** | [PASS] Yes | [PASS] Yes |
| **Primate / Union / Tuple aliases** | [FAIL] No | [PASS] Yes (`type ID = string \| number`) |
| **Extension mechanism** | `interface B extends A` | `type B = A & { ... }` |
| **Declaration Merging** | [PASS] Yes (same name merges) | [FAIL] No (duplicate identifier error) |
| **Compiler Error Messages & Caching** | Faster relationship caching; clear named error paths. | Intersections can produce large flattened type representations. |
| **Index signatures & Mapped Types** | [FAIL] Cannot be defined as a mapped type directly. | [PASS] Yes (`[K in Keys]: T`) |

### When to Use `interface`:
1. **Public Library APIs & SDKs**: If you are writing an open-source library or shared npm package, use `interface` for public contracts. This allows consumers to augment your types via declaration merging if needed.
2. **Object-Oriented Hierarchies**: When writing classes that implement contracts (`class Service implements IService`).
3. **High-Performance Object Inheritance**: `interface B extends A` creates a cached flat type relationship in the TypeScript compiler's internal type checker, whereas `A & B` evaluates a type intersection that must be checked property-by-property.

### When to Use `type`:
1. **Unions and Discriminated Unions**: `type State = Loading | Success | Error` (impossible with `interface`).
2. **Tuples and Functions**: `type Coordinate = [number, number]` or `type Handler = (e: Event) => void`.
3. **Computed & Advanced Types**: Mapped types, conditional types, template literals, utility types.
4. **Internal Application Domain Models**: In many modern React and functional codebases, teams standardize on `type` for uniformity across all domain definitions.

---

## 4. Syntax: Extension vs Intersection
```ts
// 1. Interface Extension
interface BaseWidget {
  id: string;
}

interface InteractiveWidget extends BaseWidget {
  onClick(): void;
}

// 2. Type Intersection
type BaseRecord = {
  id: string;
};

type InteractiveRecord = BaseRecord & {
  onClick(): void;
};

// 3. Recursive Type (e.g. JSON Value tree)
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
```

---

## 5. Conflict Resolution: `extends` vs `&`
When properties collide with incompatible types:
- `interface B extends A`: TypeScript emits an immediate compile error! (e.g. *"Interface 'B' incorrectly extends interface 'A'"*).
- `type B = A & { id: number }`: TypeScript silently computes an intersection on the property: `string & number` = `never`! The property becomes impossible to assign without warning until you attempt to construct an instance!

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Unintentional declaration merging in application code:
// file1.ts:
interface UserSettings { theme: string; }
// file2.ts (by another developer who forgot file1 exists):
interface UserSettings { language: string; }

// Result: UserSettings silently requires BOTH theme and language!
// If you intended two independent types, 'interface' hid the collision!
```

---

## 7. Real-World Production Usage
Modeling recursive file system trees:
```ts
export interface FileNode {
  type: "file";
  name: string;
  sizeBytes: number;
}

export interface DirectoryNode {
  type: "directory";
  name: string;
  children: (FileNode | DirectoryNode)[];
}

export type FsNode = FileNode | DirectoryNode;
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and construct:
1. A recursive JSON schema validator model.
2. An interface hierarchy with clean extension and type conflict defenses.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
type Base = { id: string };
type Child = Base & { id: number };

// const c: Child = { id: ??? }; // What can you assign to 'id'?
```
**Diagnosis**: Nothing! The property `id` has type `string & number`, which collapses to `never`. Unlike `interface extends` (which errors at declaration time), type intersections fail at assignment time!

---

## 10. Technical Interview Questions

### Question: Compare `interface` and `type` in TypeScript. What are the key differences, and how do you decide which to use in a production project?
- **Expected Answer**: Interfaces can be merged and extended; types can do unions and primitives.
- **Strong Answer**: Both can model object shapes, but they have distinct capabilities and compiler characteristics. Interfaces support declaration merging and class implementation, and using `extends` creates a cached subtype hierarchy in the compiler which optimizes type-checking performance. However, interfaces can only represent object shapes. Type aliases can represent unions, primitives, tuples, and mapped types. A crucial difference is in collision resolution: an interface will throw a compile error if an extended property conflicts with a parent property, whereas a type intersection will silently create a `never` property. In production, teams typically use `interface` for library public APIs and class contracts, and `type` for unions, state machines, and utility transformations.

---

## 11. 5-Minute Active Recall
1. Can an `interface` represent a union of string literals directly?
2. What happens if two interfaces in the same scope share the same name?
3. What type results if an intersection merges `{ id: string }` and `{ id: number }`?

<details>
<summary>[RECALL] Check Answers</summary>

1. No, only a `type` alias can define unions.
2. They undergo Declaration Merging, combining all their properties into a single interface.
3. `{ id: never }`.
</details>
