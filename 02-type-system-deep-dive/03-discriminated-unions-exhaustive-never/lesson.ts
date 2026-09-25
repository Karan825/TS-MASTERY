/**
 * Lesson 02.3: Discriminated Unions & Exhaustive Checking with never
 * Run with: npx tsx 02-type-system-deep-dive/03-discriminated-unions-exhaustive-never/lesson.ts
 */

console.log("=== 1. Discriminated Union Modeling ===");

type AuthState =
  | { status: "anonymous" }
  | { status: "authenticating"; attempt: number }
  | { status: "authenticated"; user: { id: string; email: string }; token: string }
  | { status: "failed"; errorCode: string; retryAllowed: boolean };

function getAuthDescription(state: AuthState): string {
  switch (state.status) {
    case "anonymous":
      return "Guest user - not logged in";
    case "authenticating":
      return `Logging in... (Attempt #${state.attempt})`;
    case "authenticated":
      return `Welcome ${state.user.email} (token: ${state.token})`;
    case "failed":
      return `Auth failed: [${state.errorCode}]. Retry allowed: ${state.retryAllowed}`;
    default: {
      const _exhaustive: never = state;
      throw new Error(`Unhandled auth state: ${_exhaustive}`);
    }
  }
}

const active: AuthState = {
  status: "authenticated",
  user: { id: "u_1", email: "karan@example.com" },
  token: "jwt_token_here",
};

console.log("Status message:", getAuthDescription(active));
