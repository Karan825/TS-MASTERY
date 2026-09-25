# Lesson 11.1: Runtime Boundaries & Why TypeScript Cannot Validate APIs

## 1. What is it?
TypeScript is a **compile-time illusion**.
Once your code compiles to JavaScript:
- All interfaces, types, type assertions, and type guards disappear.
- The runtime execution engine (Node.js, browser) has no access to your type definitions.
- External data—HTTP responses, database rows, websockets, local storage, URL params—enters the program as untyped binary strings and JSON objects.

---

## 2. Why does it exist?
The single most dangerous misconception among developers transitioning from languages like Java or Python is:
> *"I declared `const user: User = await response.json();` so TypeScript will make sure the response is a User!"*

### The Harsh Reality:
TypeScript does **zero runtime validation**. If the API returns `{ error: "User not found" }` or HTML, TypeScript will still believe it is a `User` until your application crashes with:
`TypeError: Cannot read properties of undefined (reading 'toLowerCase')`.

---

## 3. Mental Model: The Airport Customs Boundary
```
              EXTERNAL UNTRUSTED WORLD (API, JSON, WebSockets)
                                     │
                                     ▼ (Raw JSON, could be anything!)
                       ═════════════════════════
                       ║ AIRPORT CUSTOMS CHECK ║  <-- Runtime Validation Boundary
                       ║ (Type Guard / Schema) ║      (Zod, Valibot, or manual parser)
                       ═════════════════════════
                                     │
                                     ▼ (Verified Clean: Safe to cast to Type!)
                   INTERNAL TRUSTED CORE (Strict TypeScript)
```

---

## 4. Demonstrating the Crash: Valid to TS, Broken at Runtime
```ts
interface UserResponse {
  id: string;
  name: string;
  permissions: string[];
}

// [FAIL] DANGEROUS CODE: Perfectly valid to TypeScript!
async function dangerousFetch(url: string): Promise<UserResponse> {
  const res = await fetch(url);
  // Type assertion lies to the compiler:
  return (await res.json()) as UserResponse;
}

// If the API returns { "status": "error", "code": 500 }:
// const user = await dangerousFetch("https://api.broken.com");
// user.permissions.includes("admin");
// 💥 FATAL CRASH: TypeError: Cannot read properties of undefined (reading 'includes')!
```

---

## 5. The Professional Boundary Pattern
1. Type all external incoming data as `unknown`.
2. Parse through a runtime validation function or schema validator.
3. Only emit the typed entity after the runtime check succeeds!

```ts
function parseUserResponse(raw: unknown): UserResponse {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid payload: expected object");
  }
  const obj = raw as Record<string, unknown>;

  if (typeof obj.id !== "string") throw new Error("Missing or invalid 'id'");
  if (typeof obj.name !== "string") throw new Error("Missing or invalid 'name'");
  if (!Array.isArray(obj.permissions)) throw new Error("Missing or invalid 'permissions'");

  return {
    id: obj.id,
    name: obj.name,
    permissions: obj.permissions.filter((p): p is string => typeof p === "string"),
  };
}
```

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Trusting JSON.parse without validation
const payload: MyType = JSON.parse(untrustedString); // Dangerous! JSON.parse returns 'any'!
```

---

## 7. Exercise
Open [exercise.ts](./exercise.ts) and build a bulletproof runtime parser for a webhook payload.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 8. Technical Interview Questions

### Question: Can TypeScript guarantee that an API response adheres to its declared interface?
- **Expected Answer**: No, because types are erased at compile time.
- **Strong Answer**: Absolutely not. TypeScript has no runtime footprint; its type checking occurs entirely ahead-of-time during compilation. When network responses arrive over HTTP via `fetch()` or `axios`, they enter JavaScript memory as raw values. Type assertions like `res.json() as User` merely instruct the compiler to silence errors; they perform zero validation or data sanitization. If the API schema drifts or returns an unexpected error payload, the application will crash at runtime. A production-grade system must enforce runtime type boundaries using schema parsers (such as Zod, ArkType, or type predicates) that validate the shape of the data before casting it into the application's domain types.

---

## 9. 5-Minute Active Recall
1. Why does `res.json() as User` not guarantee runtime safety?
2. What type should external boundary inputs always be typed as?
3. What happens if an API returns an object with extra fields when assigned to a typed variable via a type assertion?

<details>
<summary>[RECALL] Check Answers</summary>

1. Because the `as` assertion is erased during compilation; no runtime validation check is executed.
2. `unknown`.
3. The extra fields persist on the JavaScript object in memory without being filtered.
</details>
