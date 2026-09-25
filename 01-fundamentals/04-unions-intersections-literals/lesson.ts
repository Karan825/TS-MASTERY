/**
 * Lesson 01.4: Unions, Intersections & Literals
 * Run with: npx tsx 01-fundamentals/04-unions-intersections-literals/lesson.ts
 */

console.log("=== 1. Literal Unions in Action ===");

type HttpStatusCode = 200 | 201 | 400 | 401 | 404 | 500;

function handleStatus(code: HttpStatusCode) {
  if (code >= 200 && code < 300) {
    return "SUCCESS";
  }
  return "ERROR";
}

console.log("Status 200 result:", handleStatus(200));

console.log("\n=== 2. Composing Types with Intersections ===");

interface Identifiable {
  readonly id: string;
}

interface Timestamped {
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface UserProfile {
  username: string;
  email: string;
}

// UserRecord combines all three interfaces
type UserRecord = Identifiable & Timestamped & UserProfile;

const user: UserRecord = {
  id: "usr_42",
  createdAt: new Date(),
  updatedAt: new Date(),
  username: "karan",
  email: "karan@example.com",
};

console.log("Composed user record:", user.id, user.username);
