/**
 * EXERCISE 02.3: Discriminated Unions & Exhaustive Checking with never
 * Run with: npx tsx 02-type-system-deep-dive/03-discriminated-unions-exhaustive-never/exercise.ts
 */

// TASK 1: Model a type-safe Workflow Step State
// A step can be in one of four states:
// - 'pending': has priority: number
// - 'running': has startedAt: Date, workerId: string
// - 'completed': has result: string, durationMs: number
// - 'failed': has error: Error, isRecoverable: boolean
export type WorkflowStepState = any; // TODO: Replace 'any' with discriminated union

// TASK 2: Implement `getStepSummary`
// Must use exhaustive checking with `never` in default branch.
export function getStepSummary(step: WorkflowStepState): string {
  // TODO: Implement switch with exhaustiveness check
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 02.3 Tests...");
  const runningStep: WorkflowStepState = {
    status: "running",
    startedAt: new Date(),
    workerId: "node_1",
  };

  try {
    const summary = getStepSummary(runningStep);
    if (!summary.includes("node_1")) throw new Error("Summary did not include worker");
    console.log("[PASS] Exercise 02.3 Passed!");
  } catch (err: any) {
    console.error("[FAIL] Exercise 02.3 Failed:", err.message);
  }
}

// runTests();
