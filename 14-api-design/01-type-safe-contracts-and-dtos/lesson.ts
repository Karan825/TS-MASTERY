/**
 * Lesson 14.1: Type-Safe API Design & DTOs
 * Run with: npx tsx 14-api-design/01-type-safe-contracts-and-dtos/lesson.ts
 */

console.log("=== 1. API Contract & DTO Modeling ===");

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  role: "admin" | "member";
  createdAt: Date;
}

// Request DTO:
export type CreateUserDto = Omit<UserEntity, "id" | "passwordHash" | "createdAt"> & {
  passwordPlainText: string;
};

// Response DTO: Never leak passwordHash!
export type UserResponseDto = Omit<UserEntity, "passwordHash">;

const signupPayload: CreateUserDto = {
  email: "developer@antigravity.io",
  role: "member",
  passwordPlainText: "StrongPassword123!",
};

console.log("Valid signup DTO created for:", signupPayload.email);
