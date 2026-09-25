/**
 * EXERCISE 16.1: TypeScript with React Patterns
 * Run with: npx tsx 16-react/01-props-state-hooks-discriminated-ui/exercise.ts
 */

export type FormStatus =
  | { state: "pristine" }
  | { state: "dirty"; values: Record<string, string> }
  | { state: "submitting"; values: Record<string, string> }
  | { state: "submitted"; resultId: string }
  | { state: "submission_failed"; error: string; values: Record<string, string> };

// TASK: Implement `canSubmitForm`
// Returns true ONLY if form is in state "dirty" or "submission_failed".
// All other states ("pristine", "submitting", "submitted") must return false.
export function canSubmitForm(status: FormStatus): boolean {
  // TODO: Implement
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 16.1 Tests...");
  if (
    canSubmitForm({ state: "dirty", values: { email: "a@b.com" } }) === true &&
    canSubmitForm({ state: "submitting", values: {} }) === false &&
    canSubmitForm({ state: "pristine" }) === false
  ) {
    console.log("[PASS] Exercise 16.1 Passed!");
  } else {
    console.error("[FAIL] Exercise 16.1 Failed!");
  }
}

// runTests();
