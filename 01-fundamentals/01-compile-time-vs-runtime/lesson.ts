/**
 * Lesson 01.1: Compile-Time vs Runtime & Type Erasure
 * Run with: npx tsx 01-fundamentals/01-compile-time-vs-runtime/lesson.ts
 */

console.log("=== 1. Type Erasure in Action ===");

// 1. Compile-time only types:
interface Account {
  id: string;
  balance: number;
}

type AccountStatus = "active" | "suspended" | "closed";

// 2. Runtime values:
const account: Account = {
  id: "acc_9921",
  balance: 1450.5,
};

console.log("account runtime object:", account);
// Notice in runtime inspection: no "Account" or "interface" properties exist!

console.log("\n=== 2. Deriving Types from Runtime Values vs Inverse ===");

// [FAIL] Cannot do:
// const roles = RoleType.slice(); // Error!

// [PASS] Professional Pattern: Declare single source of truth as runtime value, then derive type!
const VALID_ROLES = ["admin", "editor", "viewer"] as const;

// Derive TypeScript union type from runtime array:
type AppRole = (typeof VALID_ROLES)[number]; // "admin" | "editor" | "viewer"

function isValidRole(input: string): input is AppRole {
  return (VALID_ROLES as readonly string[]).includes(input);
}

console.log("Is 'admin' a valid role?", isValidRole("admin"));
console.log("Is 'hacker' a valid role?", isValidRole("hacker"));
