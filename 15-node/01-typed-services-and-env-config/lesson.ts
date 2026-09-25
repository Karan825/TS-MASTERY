/**
 * Lesson 15.1: Clean Architecture in Node.js
 * Run with: npx tsx 15-node/01-typed-services-and-env-config/lesson.ts
 */

console.log("=== 1. Clean Service / Repository Architecture ===");

export interface UserAccount {
  id: string;
  email: string;
  tier: "free" | "pro";
}

export interface IUserRepository {
  findByEmail(email: string): Promise<UserAccount | null>;
  save(user: UserAccount): Promise<UserAccount>;
}

export class MockUserRepository implements IUserRepository {
  private users = new Map<string, UserAccount>();

  async findByEmail(email: string): Promise<UserAccount | null> {
    return this.users.get(email) ?? null;
  }

  async save(user: UserAccount): Promise<UserAccount> {
    this.users.set(user.email, user);
    return user;
  }
}

export class AccountService {
  constructor(private readonly repo: IUserRepository) {}

  async upgradeUser(email: string): Promise<UserAccount> {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new Error(`User not found: ${email}`);
    }
    const updated: UserAccount = { ...user, tier: "pro" };
    return this.repo.save(updated);
  }
}

async function runDemo() {
  const repo = new MockUserRepository();
  await repo.save({ id: "u_1", email: "karan@example.com", tier: "free" });

  const service = new AccountService(repo);
  const upgraded = await service.upgradeUser("karan@example.com");

  console.log("User successfully upgraded to:", upgraded.tier);
}

runDemo();
