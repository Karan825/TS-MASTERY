# Lesson 00.0: Variables, Functions & Syntax Fundamentals

## 1. What is it?
This is the **ground-zero foundation** of JavaScript and TypeScript. Before diving into memory models or type systems, you need to be completely comfortable writing:
1. **Variables**: Storing data using `const`, `let` (and why we avoid `var`).
2. **String Interpolation**: Template literals (`` `Hello ${name}` ``).
3. **Functions**: The three ways to write functions in JavaScript (Function Declarations, Function Expressions, Arrow Functions).
4. **TypeScript Function Annotations**: How to type function parameters, return values, optional arguments, and default values.

---

## 2. Why does it exist? (Especially coming from Python)

In Python:
```python
# Python: No declaration keyword needed, indentation blocks, f-strings
x = 10
name = "Alice"
greeting = f"Hello, {name}!"

def add(a, b=0):
    return a + b
```

In JavaScript and TypeScript:
1. **You must explicitly declare variables** using `const` or `let`. If you write `x = 10` without a keyword, you create an accidental global variable (or crash in strict mode).
2. **Braces `{}` define code blocks**, not indentation.
3. **TypeScript adds compile-time types** directly onto variable declarations and function signatures so the compiler knows what values are allowed *before* running.

---

## 3. Mental Model: `const` by Default, `let` when Reassigning

```
Need a variable?
      │
Will its value be reassigned to a new value later?
      ├── NO  ──> ALWAYS use 'const'  (95% of professional code!)
      └── YES ──> Use 'let'
      
[WARNING] NEVER use 'var'! (Legacy keyword from 1995 with buggy hoisting & no block scope).
```

### Arrow Functions vs Standard Functions:
- **`function foo() {}`**: Traditional function declaration. Hoisted to the top of its scope.
- **`const foo = () => {}`**: Arrow function. Modern, concise, doesn't re-bind `this`.

---

## 4. Syntax & Comparison

### Part A: Variables & Types

```ts
// 1. 'const': Constant variable binding (cannot be reassigned)
const appName: string = "TypeScript Mastery";
// appName = "Other"; // [FAIL] TS Error: Cannot assign to 'appName' because it is a constant.

// 2. 'let': Reassignable variable
let attempts: number = 0;
attempts = 1; // [PASS] Allowed!
// attempts = "one"; // [FAIL] TS Error: Type 'string' is not assignable to type 'number'.

// 3. Type Inference (You don't always need to write the type!)
const score = 100; // TypeScript automatically infers: type is literal 100
let count = 0;     // TypeScript automatically infers: type is number

// 4. Template Literals (String interpolation — like Python f-strings!)
const message = `Welcome to ${appName}. You have ${count} notifications.`;
```

---

### Part B: Functions (The 3 Ways)

#### 1. Function Declaration (Classic)
```ts
// Syntax: function name(param: Type, ...): ReturnType { ... }
function calculateTotal(price: number, taxRate: number): number {
  return price + price * taxRate;
}
```

#### 2. Arrow Function (Modern & Most Common)
```ts
// Syntax: const name = (param: Type, ...): ReturnType => { ... }
const calculateDiscount = (price: number, percentage: number): number => {
  return price * (1 - percentage / 100);
};

// If an arrow function has a single expression, you can omit { return ... }:
const double = (n: number): number => n * 2;
```

#### 3. Optional & Default Parameters
```ts
// 'prefix' has a default value ("User"). It is automatically optional!
// 'suffix' is optional with '?'. Its type is string | undefined.
function formatUserName(name: string, prefix: string = "User", suffix?: string): string {
  const base = `${prefix}: ${name}`;
  return suffix ? `${base} (${suffix})` : base;
}

formatUserName("Karan");                  // "User: Karan"
formatUserName("Karan", "Admin");         // "Admin: Karan"
formatUserName("Karan", "Admin", "PRO");  // "Admin: Karan (PRO)"
```

#### 4. Functions that Return Nothing: `void`
```ts
// If a function doesn't return anything (like printing to console), type it as 'void':
function logInfo(message: string): void {
  console.log(`[INFO] ${message}`);
}
```

---

## 5. Python vs JavaScript/TypeScript Quick Reference

| Concept | Python | JavaScript (ES6+) | TypeScript |
| :--- | :--- | :--- | :--- |
| **Variable (Immutable binding)** | `name = "Alice"` (convention) | `const name = "Alice";` | `const name: string = "Alice";` |
| **Variable (Reassignable)** | `count = 0` | `let count = 0;` | `let count: number = 0;` |
| **String formatting** | `f"Hello {name}"` | `` `Hello ${name}` `` | `` `Hello ${name}` `` |
| **Function** | `def add(a, b):` | `function add(a, b) {` | `function add(a: number, b: number): number {` |
| **Arrow / Lambda** | `lambda x: x * 2` | `(x) => x * 2` | `(x: number): number => x * 2` |
| **Default parameter** | `def f(a, b=10):` | `function f(a, b = 10) {` | `function f(a: number, b: number = 10): number {` |
| **No return value** | Returns `None` | Returns `undefined` | Return type is `: void` |
| **Print / Log** | `print("hello")` | `console.log("hello");` | `console.log("hello");` |

---

## 6. Common Mistakes

```ts
// [FAIL] MISTAKE 1: Forgetting 'const' or 'let'
// total = 100; // Syntax error in strict mode! Always use const or let!

// [FAIL] MISTAKE 2: Using 'var'
var legacy = "bad"; // Don't use 'var'! It leaks outside if-blocks and causes bugs!

// [FAIL] MISTAKE 3: Optional parameter BEFORE required parameter
// function bad(optional?: string, required: number) {} // [FAIL] Syntax error!
// Optional parameters MUST always come LAST!

// [FAIL] MISTAKE 4: Passing wrong types to a function
function square(n: number): number { return n * n; }
// square("5"); // [FAIL] TS Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

---

## 7. Real-World Production Usage

In professional codebases, functions are often typed as first-class variables (callbacks):

```ts
// Define the shape of a function:
type Logger = (message: string, level?: "info" | "warn" | "error") => void;

// Implement it:
const appLogger: Logger = (msg, level = "info") => {
  console.log(`[${level.toUpperCase()}] ${msg}`);
};

appLogger("Server starting", "info");
```

---

## 8. Exercise (Hands-On)

### Problem
1. Declare a constant variable for your `appName` and a reassignable variable for `userCount`.
2. Write a function `formatPrice(amount: number, currency?: string): string` that formats an amount with a default currency of `"USD"`. Example: `formatPrice(10)` -> `"$10 USD"`.
3. Write an arrow function `isAdult(age: number): boolean` that returns `true` if age is 18 or older.

### Your Task
Open [exercise.ts](./exercise.ts) and complete the tasks.

<details>
<summary>[HINT] Click to view solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge

Inspect this broken code:
```ts
function registerUser(name: string, role?: string, email: string) {
  return `${role}: ${name} <${email}>`;
}
```
**Why does the TypeScript compiler reject this function signature?**
**Answer**: `role?` is marked optional, but it appears *before* the required parameter `email`. In JavaScript and TypeScript, optional parameters must always be placed after all required parameters. To fix it: `registerUser(name: string, email: string, role?: string)`.

---

## 10. Technical Interview Questions

### Question: What is the difference between `const`, `let`, and `var` in JavaScript/TypeScript?
- **Expected Answer**: `const` cannot be reassigned, `let` can be reassigned, and `var` is old.
- **Strong Answer**: `var` is function-scoped (or globally scoped) and hoisted to the top of its scope initialized to `undefined`, which frequently causes subtle bugs when used inside loops or conditional blocks. `let` and `const` were introduced in ES6 (ES2015) and are **block-scoped** (contained within `{}`). `const` creates an immutable identifier binding that cannot be reassigned, while `let` permits reassignment. In modern TypeScript, `const` is preferred by default to signal intent and avoid unexpected mutations, while `let` is used only when reassignment is strictly required. `var` is completely banned in modern codebases.

---

## 11. 5-Minute Active Recall
1. How do you declare a variable that will be reassigned later?
2. How do you define a function parameter with a default value?
3. What is the return type of a function that doesn't return anything?
4. Where must optional parameters (`?`) be placed in a function signature?

<details>
<summary>[RECALL] Check Recall Answers</summary>

1. Using `let` (e.g. `let count = 0;`).
2. With `= value` (e.g. `function greet(name: string = "Guest")`).
3. `: void`.
4. At the end of the parameter list, after all required parameters.
</details>
