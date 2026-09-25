# Lesson 06.1: `keyof`, `typeof` in Type Space & Indexed Access Types

## 1. What is it?
This lesson teaches the fundamental triad of type queries and property lookups:
1. **`typeof` (in Type Space)**: Captures the static type of a runtime value or variable.
2. **`keyof`**: Extracts a union of all public property names (keys) of an object type.
3. **Indexed Access (`T[K]`)**: Looks up the type of a specific property or element, exactly like indexing an object at runtime.

---

## 2. Why does it exist?
In JavaScript, single sources of truth are often defined as runtime data: a list of configuration defaults, a database schema, or a dictionary of error codes.
Without `typeof` and `keyof`, you would have to define both a runtime JavaScript object and a separate TypeScript interface, manually duplicating every single field.
With `typeof` and `keyof`, you write the runtime value once, and TypeScript **automatically extracts the types from it**.

---

## 3. Mental Model: Type Space vs Value Space
```
VALUE SPACE (Runtime JavaScript)             TYPE SPACE (Compile-time TypeScript)
const config = { port: 8080 };       ───────> type Config = typeof config; // { port: number }
                                                      │
                                                      ▼
                                              type ConfigKeys = keyof Config; // "port"
                                                      │
                                                      ▼
                                              type PortType = Config["port"]; // number
```

---

## 4. Syntax & Progressive Examples

### Step 1: Indexed Access on Arrays (`T[number]`)
```ts
const HTTP_CODES = [200, 400, 404, 500] as const;

// Capture the union of array element values:
type HttpCode = (typeof HTTP_CODES)[number]; // 200 | 400 | 404 | 500!
```

### Step 2: Looking Up Nested Types
```ts
interface ApiResponse {
  data: {
    user: {
      profile: {
        avatarUrl: string;
      };
    };
  };
}

// Extract deeply nested type without exporting an explicit interface:
type Avatar = ApiResponse["data"]["user"]["profile"]; // { avatarUrl: string }
```

### Step 3: Union Indexed Access (`T[keyof T]`)
```ts
interface Permissions {
  canRead: boolean;
  canWrite: boolean;
  roleLevel: number;
}

// Produces union of all property value types:
type PermissionValues = Permissions[keyof Permissions]; // boolean | number
```

---

## 5. Bad Implementation vs Professional Version

### [FAIL] Bad Implementation: Duplicate Manual Interface
```ts
// Duplicated: If someone updates DEFAULT_OPTIONS, this type silently becomes outdated!
interface AppOptions {
  env: string;
  retries: number;
}
const DEFAULT_OPTIONS = { env: "production", retries: 3 };
```

### [PASS] Professional Implementation: Single Source of Truth
```ts
export const DEFAULT_OPTIONS = {
  env: "production",
  retries: 3,
  timeoutMs: 5000,
} as const;

export type AppOptions = typeof DEFAULT_OPTIONS;
export type OptionKey = keyof AppOptions; // "env" | "retries" | "timeoutMs"
```

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Using 'typeof' on a type!
type User = { id: string };
// type Bad = typeof User; // [FAIL] Error: 'User' only refers to a type, but is being used as a value!
// 'typeof' in type positions ONLY works on VALUES!
```

---

## 7. Exercise
Open [exercise.ts](./exercise.ts) and derive types from a complex route table and extract route parameter contracts.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 8. Debugging Challenge
```ts
const ROLES = ["admin", "editor", "viewer"];
type Role = (typeof ROLES)[number];
// Why is 'Role' inferred as 'string' instead of the literal union "admin" | "editor" | "viewer"?
```
**Diagnosis**: Without `as const`, TypeScript infers mutable array `string[]`, so `(typeof ROLES)[number]` evaluates to `string`. Adding `as const` narrows the array to a readonly tuple of literal types!

---

## 9. Technical Interview Questions

### Question: How does `T[number]` work on an array or tuple type?
- **Expected Answer**: It gets the type of elements inside the array.
- **Strong Answer**: In TypeScript's indexed access mechanics, arrays are structured types whose numeric indices are accessed via `number`. When indexing `ArrayType[number]`, TypeScript looks up the value type corresponding to all possible numeric indices. For a homogeneous array `string[]`, it evaluates to `string`. For a tuple `[string, number]`, `number` matches index `0` and index `1`, resulting in the union `string | number`. For a readonly tuple defined with `as const`, it produces the exact union of all constituent literal values.

---

## 10. 5-Minute Active Recall
1. What does `keyof { a: number; b: string }` produce?
2. How do you extract the element types of a tuple `const arr = ["GET", "POST"] as const`?
3. What is the difference between `typeof x` at runtime in JS vs in TypeScript type annotations?

<details>
<summary>[RECALL] Check Answers</summary>

1. `"a" | "b"`.
2. `(typeof arr)[number]`.
3. In JS runtime, `typeof` returns a string like `"string"`, `"object"`. In TS type space, `typeof` queries the static compile-time type of an identifier.
</details>
