/**
 * REFERENCE SOLUTION: Exercise 03.1
 * Function Signatures & Callbacks
 */

export interface ExecutionContext {
  userId: string;
  timestamp: number;
}

export type NextFunction = () => Promise<void>;
export type Middleware = (ctx: ExecutionContext, next: NextFunction) => Promise<void>;

export function composeMiddlewares(
  middlewares: Middleware[]
): (ctx: ExecutionContext) => Promise<void> {
  return async (ctx: ExecutionContext): Promise<void> => {
    let index = -1;

    async function dispatch(i: number): Promise<void> {
      if (i <= index) {
        throw new Error("next() called multiple times in same middleware");
      }
      index = i;
      const fn = middlewares[i];
      if (!fn) return;
      await fn(ctx, () => dispatch(i + 1));
    }

    await dispatch(0);
  };
}

// Verification
async function verify() {
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

  const runner = composeMiddlewares([m1, m2]);
  await runner({ userId: "u_1", timestamp: Date.now() });

  console.assert(executionOrder[0] === "m1_in");
  console.assert(executionOrder[1] === "m2_in");
  console.assert(executionOrder[2] === "m2_out");
  console.assert(executionOrder[3] === "m1_out");
  console.log("[PASS] Exercise 03.1 Solution Verified Successfully!");
}

verify();
