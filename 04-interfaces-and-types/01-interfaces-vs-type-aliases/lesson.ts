/**
 * Lesson 04.1: Interfaces vs Type Aliases
 * Run with: npx tsx 04-interfaces-and-types/01-interfaces-vs-type-aliases/lesson.ts
 */

console.log("=== 1. Interface Extension vs Type Intersection ===");

// Interface hierarchy
interface BaseEntity {
  id: string;
  createdAt: Date;
}

interface UserEntity extends BaseEntity {
  email: string;
  role: "admin" | "member";
}

const user: UserEntity = {
  id: "u_10",
  createdAt: new Date(),
  email: "alex@company.com",
  role: "admin",
};

console.log("User entity created:", user.id, user.role);

console.log("\n=== 2. Recursive Type Tree (JSON Model) ===");

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = JsonValue[];

const configDoc: JsonObject = {
  appName: "PaymentEngine",
  version: 2,
  enabled: true,
  clusters: ["us-east-1", "eu-west-1"],
  metadata: {
    maxTimeoutSec: 30,
    tags: { tier: "critical" },
  },
};

console.log("Recursive JSON Doc:", JSON.stringify(configDoc, null, 2));
