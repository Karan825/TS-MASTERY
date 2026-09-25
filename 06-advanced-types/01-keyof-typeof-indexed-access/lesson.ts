/**
 * Lesson 06.1: keyof, typeof & Indexed Access Types
 * Run with: npx tsx 06-advanced-types/01-keyof-typeof-indexed-access/lesson.ts
 */

console.log("=== 1. Deriving Types from Constants ===");

export const ROUTE_REGISTRY = {
  HOME: "/",
  USERS: "/api/v1/users",
  HEALTH: "/healthz",
  BILLING: "/api/v1/billing",
} as const;

export type RouteName = keyof typeof ROUTE_REGISTRY; // "HOME" | "USERS" | "HEALTH" | "BILLING"
export type RoutePath = (typeof ROUTE_REGISTRY)[RouteName]; // "/" | "/api/v1/users" | ...

function navigateTo(name: RouteName): RoutePath {
  return ROUTE_REGISTRY[name];
}

console.log("Navigating to USERS:", navigateTo("USERS"));

console.log("\n=== 2. Indexed Access on Nested Contracts ===");

interface ComplexSystemSchema {
  database: {
    postgres: {
      connectionLimit: number;
      ssl: boolean;
    };
  };
  telemetry: {
    sampleRate: number;
  };
}

// Deep indexed access:
type DbConfig = ComplexSystemSchema["database"]["postgres"];

const config: DbConfig = {
  connectionLimit: 50,
  ssl: true,
};

console.log("Configured DB connection limit:", config.connectionLimit);
