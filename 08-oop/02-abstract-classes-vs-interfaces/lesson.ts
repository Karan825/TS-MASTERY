/**
 * Lesson 08.2: Abstract Classes vs Interfaces
 * Run with: npx tsx 08-oop/02-abstract-classes-vs-interfaces/lesson.ts
 */

console.log("=== 1. Template Method Pattern with Abstract Class ===");

abstract class DataPipeline<TInput, TOutput> {
  // Concrete orchestration pipeline
  async execute(input: TInput): Promise<TOutput> {
    this.beforeExecute();
    const validated = this.validate(input);
    const transformed = await this.transform(validated);
    this.afterExecute();
    return transformed;
  }

  // Hook methods
  protected beforeExecute(): void {
    console.log("[Pipeline] Starting execution...");
  }

  protected afterExecute(): void {
    console.log("[Pipeline] Execution complete.");
  }

  // Abstract steps required by subclasses:
  protected abstract validate(raw: TInput): TInput;
  protected abstract transform(valid: TInput): Promise<TOutput>;
}

class UserCsvPipeline extends DataPipeline<string, { username: string; age: number }> {
  protected validate(raw: string): string {
    if (!raw.includes(",")) throw new Error("Invalid CSV format");
    return raw;
  }

  protected async transform(valid: string): Promise<{ username: string; age: number }> {
    const [username, ageStr] = valid.split(",");
    return {
      username: username!.trim(),
      age: parseInt(ageStr!.trim(), 10),
    };
  }
}

async function run() {
  const pipeline = new UserCsvPipeline();
  const user = await pipeline.execute("karan, 28");
  console.log("Parsed User:", user);
}

run();
