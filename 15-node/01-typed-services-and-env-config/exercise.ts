/**
 * EXERCISE 15.1: Clean Architecture in Node.js
 * Run with: npx tsx 15-node/01-typed-services-and-env-config/exercise.ts
 */

export interface TaskRecord {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface ITaskRepository {
  findById(id: string): Promise<TaskRecord | null>;
  save(task: TaskRecord): Promise<TaskRecord>;
}

// TASK: Implement `TaskService`
// Constructor receives `repo: ITaskRepository`.
// Methods:
// - `completeTask(id: string): Promise<TaskRecord>`
//   Finds task, marks isCompleted: true, saves and returns.
//   If not found, throws Error("Task not found").
export class TaskService {
  // TODO: Implement
}

function runTests() {
  console.log("Run solution.ts for verification");
}

// runTests();
