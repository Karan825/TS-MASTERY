/**
 * REFERENCE SOLUTION: Exercise 12.1
 * Error Handling & Unknown Errors
 */

export interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  DATABASE_URL: string;
}

export function loadEnvConfig(env: Record<string, string | undefined>): EnvConfig {
  const errors: string[] = [];

  const rawPort = env.PORT;
  let port = 0;
  if (!rawPort) {
    errors.push("Missing PORT");
  } else {
    port = parseInt(rawPort, 10);
    if (isNaN(port) || port <= 0 || port > 65535) {
      errors.push(`Invalid PORT '${rawPort}'. Must be between 1 and 65535.`);
    }
  }

  const rawEnv = env.NODE_ENV;
  if (!rawEnv || !["development", "production", "test"].includes(rawEnv)) {
    errors.push(`Invalid or missing NODE_ENV '${rawEnv}'`);
  }

  const rawDb = env.DATABASE_URL;
  if (!rawDb || rawDb.trim() === "") {
    errors.push("Missing DATABASE_URL");
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n - ${errors.join("\n - ")}`);
  }

  return {
    PORT: port,
    NODE_ENV: rawEnv as EnvConfig["NODE_ENV"],
    DATABASE_URL: rawDb!,
  };
}

// Verification
const valid = {
  PORT: "3000",
  NODE_ENV: "production",
  DATABASE_URL: "postgres://localhost/main",
};

const cfg = loadEnvConfig(valid);
console.assert(cfg.PORT === 3000);
console.assert(cfg.NODE_ENV === "production");
console.assert(cfg.DATABASE_URL === "postgres://localhost/main");

let caught = false;
try {
  loadEnvConfig({ PORT: "invalid" });
} catch {
  caught = true;
}
console.assert(caught, "Invalid env configuration must throw!");
console.log("[PASS] Exercise 12.1 Solution Verified Successfully!");
