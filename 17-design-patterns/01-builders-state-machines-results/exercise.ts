/**
 * EXERCISE 17.1: Type-Safe Builder Pattern
 * Run with: npx tsx 17-design-patterns/01-builders-state-machines-results/exercise.ts
 */

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

// TASK: Implement `EmailBuilder`
// Uses phantom type parameters to ensure `.send(): EmailMessage` can only be invoked
// when BOTH `to` and `subject` have been set.
// `body` is optional (defaults to empty string).
export class EmailBuilder<HasTo extends boolean = false, HasSubject extends boolean = false> {
  // TODO: Implement
}

function runTests() {
  console.log("Run solution.ts for verification");
}

// runTests();
