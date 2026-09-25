/**
 * REFERENCE SOLUTION: Exercise 15.1
 * Clean Architecture in Node.js
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

export class TaskService {
  constructor(private readonly repo: ITaskRepository) {}

  async completeTask(id: string): Promise<TaskRecord> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`Task not found: ${id}`);
    }

    const updated: TaskRecord = {
      ...existing,
      isCompleted: true,
    };

    return this.repo.save(updated);
  }
}

// Verification
class InMemoryTaskRepo implements ITaskRepository {
  private map = new Map<string, TaskRecord>();
  async findById(id: string): Promise<TaskRecord | null> {
    return this.map.get(id) ?? null;
  }
  async save(task: TaskRecord): Promise<TaskRecord> {
    this.map.set(task.id, task);
    return task;
  }
}

async function verify() {
  const repo = new InMemoryTaskRepo();
  await repo.save({ id: "t_1", title: "Write TS Course", isCompleted: false });

  const service = new TaskService(repo);
  const completed = await service.completeTask("t_1");
  console.assert(completed.isCompleted === true);
  console.log("[PASS] Exercise 15.1 Solution Verified Successfully!");
}

verify();
