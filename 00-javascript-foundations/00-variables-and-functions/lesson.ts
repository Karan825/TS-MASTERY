/**
 * Lesson 00.0: Variables, Functions & Syntax Fundamentals
 * Run with: npx tsx 00-javascript-foundations/00-variables-and-functions/lesson.ts
 */

console.log("=== 1. Variables: const vs let ===");

// 'const' is used for values that will NOT be reassigned.
// It is the default keyword in modern JavaScript and TypeScript (~95% of declarations).
const courseName: string = "TypeScript Mastery";
const targetYear: number = 2026;
const isCertified: boolean = true;

console.log(`Course: ${courseName} | Year: ${targetYear} | Certified: ${isCertified}`);

// 'let' is used ONLY when a variable needs to be reassigned later.
let userCount: number = 0;
console.log("Initial count:", userCount);
userCount = userCount + 1; // Reassigning
userCount += 4;
console.log("Updated count:", userCount);

// TypeScript prevents type mismatches on reassignment:
// userCount = "five"; // [FAIL] TS Error: Type 'string' is not assignable to type 'number'.

// Note: NEVER use 'var'! 'var' lacks block scoping and causes confusing bugs.


console.log("\n=== 2. String Interpolation (Template Literals) ===");

// In Python you write: f"Welcome, {username}!"
// In JS/TS you use backticks (``) and ${expression}:
const studentName: string = "Karan";
const welcomeBanner: string = `Hello, ${studentName}! Welcome to ${courseName}. You have completed ${userCount} lessons.`;
console.log(welcomeBanner);


console.log("\n=== 3. Function Declarations (Classic Syntax) ===");

// Traditional function syntax:
// function functionName(param1: Type1, param2: Type2): ReturnType { ... }
function addNumbers(a: number, b: number): number {
  return a + b;
}

const sumResult: number = addNumbers(15, 27);
console.log("15 + 27 =", sumResult);


console.log("\n=== 4. Arrow Functions (Modern Syntax) ===");

// Arrow functions are compact and standard in modern JS/TS:
// const functionName = (param: Type): ReturnType => { ... }
const multiplyNumbers = (a: number, b: number): number => {
  return a * b;
};
console.log("6 * 7 =", multiplyNumbers(6, 7));

// Concise one-line arrow function (implicit return - no braces, no 'return' keyword needed):
const square = (n: number): number => n * n;
console.log("Square of 9 =", square(9));


console.log("\n=== 5. Default and Optional Parameters ===");

// Default parameters: 'role' defaults to "student" if not provided.
// Optional parameters: 'badge' has '?' which makes its type string | undefined.
// Rule: Optional/default parameters must ALWAYS be placed AFTER required parameters!
function introduceUser(
  name: string,
  role: string = "student",
  badge?: string
): string {
  if (badge) {
    return `${name} is a ${role} with badge: [${badge}]`;
  }
  return `${name} is a ${role}`;
}

console.log(introduceUser("Alice"));                         // Uses default "student"
console.log(introduceUser("Bob", "instructor"));             // Overrides default
console.log(introduceUser("Charlie", "mentor", "Gold Cup")); // Supplies optional parameter


console.log("\n=== 6. Functions with No Return Value: 'void' ===");

// When a function performs an action (side effect) and returns nothing, use 'void':
function printDivider(title: string): void {
  console.log(`--- [ ${title.toUpperCase()} ] ---`);
}

printDivider("Lesson 00.0 Complete");
