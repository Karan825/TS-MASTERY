/**
 * REFERENCE SOLUTION: Exercise 02.3
 * Discriminated Unions & Exhaustive Checking with never
 */

export type WorkflowStepState =
  | { status: "pending"; priority: number }
  | { status: "running"; startedAt: Date; workerId: string }
  | { status: "completed"; result: string; durationMs: number }
  | { status: "failed"; error: Error; isRecoverable: boolean };

export function getStepSummary(step: WorkflowStepState): string {
  switch (step.status) {
    case "pending":
      return `Pending (Priority ${step.priority})`;
    case "running":
      return `Running on worker ${step.workerId}`;
    case "completed":
      return `Completed in ${step.durationMs}ms: ${step.result}`;
    case "failed":
      return `Failed: ${step.error.message} (Recoverable: ${step.isRecoverable})`;
    default: {
      const _exhaustiveCheck: never = step;
      throw new Error(`Unhandled step status: ${_exhaustiveCheck}`);
    }
  }
}

// Verification
const running: WorkflowStepState = {
  status: "running",
  startedAt: new Date(),
  workerId: "node_1",
};

console.assert(getStepSummary(running) === "Running on worker node_1");
console.log("[PASS] Exercise 02.3 Solution Verified Successfully!");
