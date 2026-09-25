# Lesson 15.1: Clean Architecture in Node.js with TypeScript

## 1. What is it?
Applying TypeScript in backend Node.js development involves structuring applications with **Separation of Concerns**:
1. **Config Layer**: Validates process environment variables at startup.
2. **Controller Layer**: Handles incoming HTTP requests, validates DTOs, and returns HTTP responses.
3. **Service Layer**: Pure business logic (unaware of HTTP, Express, or SQL details).
4. **Repository Layer**: Data access interface abstracting the database.

---

## 2. Why does it exist?
In typical dynamic Node.js applications, controller files frequently mingle HTTP parsing, direct SQL queries, and business logic into 500-line spaghetti functions.
TypeScript enables **Inversion of Control (IoC)** and **Dependency Injection (DI)** through interfaces, making backend applications modular, testable, and maintainable.

---

## 3. Architecture Blueprint
```
[ HTTP Request ] ──> [ Controller ] ──> [ Service Interface ] ──> [ Repository Interface ] ──> [ Database ]
                            │                    │                          │
                            ▼                    ▼                          ▼
                     Validates DTO       Applies Rules              CRUD Operations
```

---

## 4. Syntax & Dependency Injection
```ts
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
}

export class UserService {
  // Injected via constructor!
  constructor(private readonly userRepo: UserRepository) {}

  async registerUser(email: string): Promise<User> {
    const existing = await this.userRepo.findById(email);
    if (existing) throw new Error("Email already registered");
    return this.userRepo.create({ id: email, email, isActive: true });
  }
}
```

---

## 5. Exercise
Open [exercise.ts](./exercise.ts) and implement a complete modular Service + In-Memory Repository stack with full type checks.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 6. Technical Interview Questions

### Question: Why is Dependency Injection through TypeScript interfaces preferable to importing database singleton instances directly into backend services?
- **Expected Answer**: It makes unit testing and mocking easy.
- **Strong Answer**: Directly importing concrete database clients (`import db from './db'`) tightly couples business services to specific infrastructure, making it impossible to unit test the service in isolation without running live database containers or patching module caches. By programming to an interface (`constructor(private repo: UserRepository)`), the service depends only on an abstract contract. In unit tests, we can effortlessly inject an in-memory mock repository; in production, we inject a PostgreSQL or Mongo implementation. This adheres directly to the Dependency Inversion Principle (the "D" in SOLID).

---

## 7. 5-Minute Active Recall
1. Which layer contains domain business logic?
2. Why should services depend on interfaces rather than concrete repository classes?
3. Where should environment variable validation occur in a Node.js server lifecycle?

<details>
<summary>[RECALL] Check Answers</summary>

1. The Service Layer.
2. To decouple business logic from infrastructure and enable easy mock injection during testing.
3. At the very beginning of the bootstrap process, before listening on any port.
</details>
