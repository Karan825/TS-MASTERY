# Lesson 00.3: Prototypes, Prototype Chains & The 4 Rules of `this`

## 1. What is it?
In JavaScript:
1. **Prototypes**: Objects inherit properties and methods directly from other objects via a hidden linkage called `[[Prototype]]`. ES6 `class` syntax in TypeScript is syntactic sugar over prototype delegation.
2. **`this` Binding**: Unlike Python (where `self` is explicitly passed as the first parameter) or Java/C++ (where `this` is lexically bound to the class instance), JavaScript's `this` is determined **at call-time** by *how* a function is called, not where it was declared (with the exception of arrow functions).

---

## 2. Why do I need to understand this before TypeScript?
- **TypeScript's `this` Parameter**: TypeScript allows you to declare a fake first parameter named `this` (e.g. `function handleClick(this: HTMLElement, event: Event)`). If you don't understand JS `this`, this syntax looks bizarre.
- **The Detached Method Trap**: Passing an object method as a callback (e.g. `setTimeout(user.greet, 1000)` or `<button onClick={this.handleClick}>`) loses the `this` binding at runtime in JS. TypeScript has a compiler flag `--noImplicitThis` specifically to catch this!
- **Classes vs Prototypes**: TypeScript types classes structurally, but at runtime, inheritance works via prototype delegation.

---

## 3. Mental Model: The 4 Binding Rules of `this`
When evaluating `this` inside a standard `function()` call, ask:

1. **`new` Binding**: Was it called with `new Foo()`?  
   -> `this` is the newly created object.
2. **Explicit Binding**: Was it called with `.call(ctx)`, `.apply(ctx)`, or `.bind(ctx)`?  
   -> `this` is `ctx`.
3. **Implicit Binding**: Was it called with a context object like `obj.method()`?  
   -> `this` is `obj`.
4. **Default Binding**: Was it called plain `fn()`?  
   -> In strict mode, `this` is `undefined`. (In non-strict, `window`/`globalThis`).
5. **Arrow Functions (`() => {}`)**: Arrow functions have NO `this` of their own. They resolve `this` lexically from their enclosing scope, exactly like any regular variable!

---

## 4. Syntax: TypeScript Explicit `this` Parameter
```ts
interface DatabaseConnection {
  connectionId: string;
  executeQuery(this: DatabaseConnection, query: string): void;
}

const db: DatabaseConnection = {
  connectionId: "conn_42",
  executeQuery(this: DatabaseConnection, query: string) {
    console.log(`Executing ${query} on ${this.connectionId}`);
  },
};

db.executeQuery("SELECT * FROM users"); // [PASS] Safe

const detached = db.executeQuery;
// detached("SELECT 1");
// [FAIL] TS Error: The 'this' context of type 'void' is not assignable to method's 'this' of type 'DatabaseConnection'.
```

---

## 5. TypeScript vs JavaScript Comparison
| Scenario | JavaScript Runtime | TypeScript Compile-Time |
| :--- | :--- | :--- |
| `obj.fn.call(null)` | `this` becomes `null`/`undefined` or global. | TypeScript flags type mismatch if `this` parameter is typed. |
| Detaching method `const f = obj.method; f()` | Runs, but `this` is `undefined` (often crashes with `Cannot read property of undefined`). | Caught with `--noImplicitThis` or explicit `this` annotations. |
| Prototype delegation | Checks object, then walks up `__proto__` chain until `null`. | Type system flattens inherited properties into the composite type. |

---

## 6. Common Mistakes
```ts
class NotificationService {
  private apiKey = "secret_123";

  // [FAIL] Standard method: will lose 'this' if passed as a callback
  sendNotification(msg: string) {
    console.log(`Sending ${msg} with key ${this.apiKey}`);
  }

  // [PASS] Arrow property: 'this' is permanently bound to the instance at construction
  sendNotificationBound = (msg: string) => {
    console.log(`Sending ${msg} with key ${this.apiKey}`);
  };
}
```

---

## 7. Real-World Production Usage
Typing DOM event handlers, express route handlers, and fluent builder interfaces:
```ts
interface FluentBuilder {
  setHost(host: string): this;
  setPort(port: number): this;
  build(): Connection;
}
```
Using polymorphic `this` in return types enables fluent method chaining across subclass hierarchies!

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement:
1. An event emitter with typed `this` parameter to prevent detached execution.
2. A fluent query builder using polymorphic `this`.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
class HttpClient {
  baseURL = "https://api.github.com";

  getUsers() {
    return fetch(this.baseURL + "/users");
  }
}

const client = new HttpClient();
const runner = (fn: () => void) => fn();
// runner(client.getUsers); // Why does this crash at runtime with "Cannot read properties of undefined"?
```
**Diagnosis**: Passing `client.getUsers` passes the raw function reference without the `client.` prefix, triggering Default Binding where `this` becomes `undefined` in ES modules/strict mode.

---

## 10. Technical Interview Questions

### Question: Why did the TypeScript team add a `this` parameter to function declarations, and does it produce any JavaScript output?
- **Expected Answer**: It allows typing the expected `this` context inside functions. It produces no JS output.
- **Strong Answer**: Because JavaScript's `this` is dynamically bound at the call site, callbacks that depend on a specific `this` context are prone to subtle runtime crashes. TypeScript's explicit `this` parameter occupies the first argument slot in the signature (e.g. `fn(this: Context, arg: string)`). At compile-time, TS verifies that the caller invoked the function with the matching `this` context. During transpilation, the `this` parameter is completely erased, producing a standard JS function with only the remaining parameters.
- **Follow-up**: *What is the runtime memory difference between defining a class method as a standard prototype method vs an arrow function property?*  
  *Answer*: Standard methods live on the class prototype, sharing one function instance across all class instances (memory efficient). Arrow function properties create a separate closure and function instance for every single object instantiated (higher memory footprint, but immune to `this` detachment).

---

## 11. 5-Minute Active Recall
1. Name the 4 standard rules of `this` binding in JavaScript.
2. Can you bind `this` on an arrow function using `.bind()`?
3. Where does an explicit `this: Type` parameter appear in compiled JavaScript?

<details>
<summary>[RECALL] Check Answers</summary>

1. `new` binding, explicit binding (`call`/`apply`/`bind`), implicit binding (`obj.fn()`), default binding (`undefined`/global).
2. No, arrow functions have no `this` binding; `.bind()` is ignored.
3. Nowhere; it is completely erased.
</details>
