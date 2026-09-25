# Lesson 04.2: Declaration Merging, Module Augmentation & Index Signatures

## 1. What is it?
1. **Declaration Merging**: A unique TypeScript feature where the compiler automatically combines multiple declarations of the same name into a single definition. Only `interface` declarations merge; `type` aliases will throw a duplicate identifier error.
2. **Module Augmentation**: Using declaration merging to attach custom fields (like authentication contexts, telemetry tokens) to third-party library types (e.g. Express `Request`, Fastify, Vite).
3. **Index Signatures**: A way to type objects with dynamic keys: `[key: string]: ValueType`.

---

## 2. Why does it exist?
In JavaScript, frameworks like Express or Redux attach objects dynamically: `req.user = authenticatedUser;`.
Without module augmentation, you would either have to cast `(req as any).user` everywhere, or create wrapper types for every endpoint.
Index signatures allow typing dictionary-like objects (e.g. cache lookups, environment variables) where keys cannot be known ahead of time.

---

## 3. Mental Model: Declaration Merging
```
File A: interface Window { customAnalytics: Tracker; }
File B: interface Window { appVersion: string; }

TypeScript Internal Compiler View:
interface Window {
  customAnalytics: Tracker;
  appVersion: string;
}
```
The compiler stitches both declarations together seamlessly!

---

## 4. Syntax & Module Augmentation
```ts
// 1. In-file interface merging:
interface CartItem {
  sku: string;
  price: number;
}
interface CartItem {
  quantity: number; // Merged into CartItem!
}

// 2. Index Signature with noUncheckedIndexedAccess:
interface CacheStore {
  [cacheKey: string]: string | undefined;
}

// 3. Module Augmentation Pattern (e.g. in types/express.d.ts):
/*
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: string[];
      };
    }
  }
}
*/
```

---

## 5. The Golden Constraint of Index Signatures
In TypeScript, if an interface has an index signature, **every explicit property must be a subtype of the index signature**:
```ts
// [FAIL] COMPILE ERROR:
interface BadConfig {
  [key: string]: string;
  port: number; // Error: Property 'port' of type 'number' is not assignable to 'string' index type 'string'.
}

// [PASS] CORRECT: Broaden the index signature:
interface GoodConfig {
  [key: string]: string | number;
  port: number; // Allowed!
}
```

---

## 6. Common Mistakes: The Unchecked Index Trap
```ts
const userAges: Record<string, number> = { alice: 25 };

// In default TS: userAges["bob"] is typed as 'number'!
// But at runtime: userAges["bob"] is undefined!
// const nextYear = userAges["bob"] + 1; // Produces NaN at runtime!

// [PASS] FIX: Enable "noUncheckedIndexedAccess": true in tsconfig.json!
// With this flag, userAges["bob"] is correctly typed as `number | undefined`.
```

---

## 7. Real-World Production Usage
Extending NodeJS environment variables safely:
```ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT?: string;
      DATABASE_URL: string;
    }
  }
}
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. A safe dictionary cache store with `noUncheckedIndexedAccess` defenses.
2. A simulated module augmentation.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
interface HeaderDictionary {
  [header: string]: string;
  statusCode: number; // Why does the compiler complain here?
}
```
**Diagnosis**: The index signature declares that any string key must return a `string`. But `statusCode` is an explicit string key with value type `number`. TypeScript requires all explicit keys to conform to the index signature. Fix: `[header: string]: string | number;`.

---

## 10. Technical Interview Questions

### Question: What is declaration merging, and when would you use module augmentation in a production application?
- **Expected Answer**: Merging two interfaces with the same name. We use it to add fields to libraries like Express.
- **Strong Answer**: Declaration merging is the compiler's mechanism for synthesizing multiple declarations of the same identifier (such as interfaces or namespaces) into a single unified type. Module augmentation leverages this to extend types from external packages without forking them. In production, this is standard practice for frameworks where middleware adds properties to shared contexts—such as adding a strongly typed `user` session object or request correlation ID to Express `Request` or Fastify `FastifyRequest`.

---

## 11. 5-Minute Active Recall
1. Can you perform declaration merging on two `type` aliases?
2. What compiler flag forces index signature property lookups to include `undefined`?
3. What rule must explicit properties follow when an index signature is present?

<details>
<summary>[RECALL] Check Answers</summary>

1. No, `type` aliases cannot merge; doing so produces a duplicate identifier error.
2. `noUncheckedIndexedAccess`.
3. All explicit properties must have types that are assignable to the index signature's value type.
</details>
