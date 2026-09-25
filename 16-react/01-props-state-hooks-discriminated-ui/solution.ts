/**
 * REFERENCE SOLUTION: Exercise 16.1
 * TypeScript with React Patterns
 */

export type FormStatus =
  | { state: "pristine" }
  | { state: "dirty"; values: Record<string, string> }
  | { state: "submitting"; values: Record<string, string> }
  | { state: "submitted"; resultId: string }
  | { state: "submission_failed"; error: string; values: Record<string, string> };

export function canSubmitForm(status: FormStatus): boolean {
  switch (status.state) {
    case "dirty":
    case "submission_failed":
      return true;
    case "pristine":
    case "submitting":
    case "submitted":
      return false;
  }
}

// Verification
console.assert(canSubmitForm({ state: "dirty", values: { email: "a@b.com" } }) === true);
console.assert(canSubmitForm({ state: "submitting", values: {} }) === false);
console.assert(canSubmitForm({ state: "pristine" }) === false);
console.assert(canSubmitForm({ state: "submitted", resultId: "res_1" }) === false);
console.assert(canSubmitForm({ state: "submission_failed", error: "fail", values: {} }) === true);

console.log("[PASS] Exercise 16.1 Solution Verified Successfully!");
