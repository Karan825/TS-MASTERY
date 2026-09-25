# Lesson 05.3: Generic Repositories, Services & Real-World Patterns

## 1. What is it?
In enterprise architecture, the **Repository Pattern** abstracts data access behind a collection-like interface.
By applying generics:
```ts
interface Repository<TEntity extends { id: string }> {
  findById(id: string): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
  delete(id: string): Promise<boolean>;
}
```
You write a single, robust data-access abstraction that works for `User`, `Order`, `Product`, or any domain entity with 100% type safety.

---

## 2. Why does it exist? (The "Why Not `any`?" Rule)
If you wrote `findById(id: string): Promise<any>`, the service layer consuming the repository would receive `any`. The developer would have to write manual type assertions (`as User`) everywhere. If the database schema changes, the compiler would remain completely silent, leading to catastrophic runtime errors.
With a generic repository, if an entity changes, every query, controller, and test consuming that repository is type-checked automatically.

---

## 3. Mental Model: The Entity Vault
```
                  REPOSITORY INTERFACE: Repository<TEntity>
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
  UserRepository:                                     OrderRepository:
  Repository<UserEntity>                              Repository<OrderEntity>
  - findById(id) -> UserEntity                        - findById(id) -> OrderEntity
  - save(user)   -> UserEntity                        - save(order)   -> OrderEntity
```

---

## 4. Syntax & Implementation
```ts
export interface Identifiable {
  id: string;
}

export interface IRepository<T extends Identifiable> {
  findById(id: string): Promise<T | null>;
  save(item: T): Promise<T>;
  delete(id: string): Promise<boolean>;
  findWhere(predicate: (item: T) => boolean): Promise<T[]>;
}

export class InMemoryRepository<T extends Identifiable> implements IRepository<T> {
  protected items = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    return this.items.get(id) ?? null;
  }

  async save(item: T): Promise<T> {
    this.items.set(item.id, item);
    return item;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  async findWhere(predicate: (item: T) => boolean): Promise<T[]> {
    return Array.from(this.items.values()).filter(predicate);
  }
}
```

---

## 5. TypeScript vs JavaScript Comparison
In JavaScript, an in-memory or database repository takes any object and returns any object. In TypeScript, passing an object missing the required `id` property or saving an invalid entity fails at compile time before any database connection is ever made.

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Not enforcing id constraint:
class BadRepo<T> { // Unconstrained!
  items = new Map<string, T>();
  save(item: T) {
    // items.set(item.id, item); // [FAIL] Error: Property 'id' does not exist on type 'T'.
  }
}
```

---

## 7. Real-World Production Usage
Generic Paginated API responses:
```ts
export interface PaginatedResult<T> {
  readonly items: readonly T[];
  readonly totalCount: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}
```

---

## 8. Exercise
Open [exercise.ts](./exercise.ts) and implement a generic repository with pagination and filter support.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 9. Debugging Challenge
```ts
interface AuditEntity {
  id: string;
  updatedAt: Date;
}

class EntityService<T extends AuditEntity> {
  constructor(private repo: IRepository<T>) {}

  async touch(id: string): Promise<T> {
    const existing = await this.repo.findById(id);
    // existing.updatedAt = new Date(); // [FAIL] TS Error: 'existing' is possibly 'null'.
    return existing as T;
  }
}
```
**Diagnosis**: `findById` returns `T | null`. You must guard against `null` with `if (!existing) throw new Error("Entity not found")` before modifying properties!

---

## 10. Technical Interview Questions

### Question: How would you design a generic CRUD repository in TypeScript, and what constraints would you apply?
- **Expected Answer**: Use an interface with generic `T extends { id: string }`.
- **Strong Answer**: I design a generic repository using an interface `IRepository<TEntity extends { id: string }, TId = string>`. Constraining `TEntity` ensures every entity has an identifier for key-based operations (`findById`, `delete`). I also leverage generic utility types: for create operations where IDs are database-generated, I type input as `Omit<TEntity, 'id'>`. For updates, I type input as `Partial<TEntity>`. This prevents callers from passing incomplete entities on creation or un-updatable IDs on modification, all while ensuring compile-time safety across database drivers.

---

## 11. 5-Minute Active Recall
1. Why must `T` in `IRepository<T>` extend `{ id: string }`?
2. What does `PaginatedResult<T>` preserve?
3. How do you type an entity creation input where the database assigns the `id`?

<details>
<summary>[RECALL] Check Answers</summary>

1. To guarantee that `item.id` exists when indexing into storage or generating queries.
2. It wraps the paginated items array in `readonly T[]` while keeping metadata (`totalCount`, `page`) strongly typed.
3. `Omit<T, "id">`.
</details>
