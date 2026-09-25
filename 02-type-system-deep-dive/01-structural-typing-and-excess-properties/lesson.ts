/**
 * Lesson 02.1: Structural Typing & Excess Property Checks
 * Run with: npx tsx 02-type-system-deep-dive/01-structural-typing-and-excess-properties/lesson.ts
 */

console.log("=== 1. Structural Compatibility ===");

interface Vector2D {
  x: number;
  y: number;
}

interface Vector3D {
  x: number;
  y: number;
  z: number;
}

function calculateMagnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

const p3: Vector3D = { x: 3, y: 4, z: 12 };

// Vector3D is structurally compatible with Vector2D:
console.log("Magnitude of 3D vector projected to 2D:", calculateMagnitude(p3)); // 5

console.log("\n=== 2. Excess Property Check on Fresh Literals ===");

interface ConnectionConfig {
  host: string;
  port: number;
}

function startServer(cfg: ConnectionConfig) {
  console.log(`Starting server on ${cfg.host}:${cfg.port}`);
}

// [FAIL] Direct literal with excess property triggers compile error:
// startServer({ host: "localhost", port: 8080, timeout: 5000 });

// [PASS] Passing via variable reference bypasses the freshness excess check:
const configWithExtra = {
  host: "localhost",
  port: 8080,
  timeout: 5000,
  region: "us-west",
};
startServer(configWithExtra);
