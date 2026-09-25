/**
 * EXERCISE 03.1: Function Signatures & Callbacks
 * Run with: npx tsx 03-functions/01-function-signatures-and-callbacks/exercise.ts
 */

export interface ExecutionContext {
  userId: string;
  timestamp: number;
}

export type NextFunction = () => Promise<void>;
export type Middleware = (ctx: ExecutionContext, next: NextFunction) => Promise<void>;

// TASK: Implement composeMiddlewares
// Given an array of Middleware functions, return a single function `(ctx: ExecutionContext) => Promise<void>`
// that executes the middlewares in sequence (onion model).
export function composeMiddlewares(
  middlewares: Middleware[]
): (ctx: ExecutionContext) => Promise<void> {
  // TODO: Implement
  throw new Error("Not implemented");
}

async function runTests() {
  console.log("Running Exercise 03.1 Tests...");
  const executionOrder: string[] = [];

  const m1: Middleware = async (ctx, next) => {
    executionOrder.push("m1_in");
    await next();
    executionOrder.push("m1_out");
  };

  const m2: Middleware = async (ctx, next) => {
    executionOrder.push("m2_in");
    await next();
    executionOrder.push("m2_out");
  };

  try {
    const runner = composeMiddlewares([m1, m2]);
    await runner({ userId: "u_1", timestamp: Date.now() });

    const expected = ["m1_in", "m2_in", "m2_out", "m1_out"];
    if (JSON.stringify(executionOrder) !== JSON.stringify(expected)) {
      throw new Error(`Unexpected execution order: ${JSON.stringify(executionOrder)}`);
    }
    console.log("[PASS] Exercise 03.1 Passed!");
  } catch (err: any) {
    console.error("[FAIL] Exercise 03.1 Failed:", err.message);
  }
}

// runTests();
