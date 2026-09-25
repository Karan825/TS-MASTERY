/**
 * Lesson 21.1: Vitest Runtime Test Suite
 * Tests runtime logic and mock injection.
 */

import { describe, it, expect, vi } from "vitest";
import { TaskService, type ITaskRepository, type TaskRecord } from "../../15-node/01-typed-services-and-env-config/solution.js";

describe("TaskService Unit Tests with Mocks", () => {
  it("should complete a pending task", async () => {
    const mockRepo: ITaskRepository = {
      findById: vi.fn().mockResolvedValue({
        id: "task_1",
        title: "Test Task",
        isCompleted: false,
      }),
      save: vi.fn().mockImplementation(async (task: TaskRecord) => task),
    };

    const service = new TaskService(mockRepo);
    const result = await service.completeTask("task_1");

    expect(result.isCompleted).toBe(true);
    expect(mockRepo.findById).toHaveBeenCalledWith("task_1");
    expect(mockRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ id: "task_1", isCompleted: true })
    );
  });

  it("should throw an error when completing a non-existent task", async () => {
    const mockRepo: ITaskRepository = {
      findById: vi.fn().mockResolvedValue(null),
      save: vi.fn(),
    };

    const service = new TaskService(mockRepo);
    await expect(service.completeTask("invalid_id")).rejects.toThrow("Task not found: invalid_id");
  });
});
