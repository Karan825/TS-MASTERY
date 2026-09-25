/**
 * Generic Audit & Compliance Repository
 */

export interface Identifiable {
  readonly id: string;
}

export interface IRepository<T extends Identifiable> {
  findById(id: string): Promise<T | null>;
  save(item: T): Promise<T>;
  findAll(): Promise<readonly T[]>;
  findWhere(predicate: (item: T) => boolean): Promise<readonly T[]>;
}

export class InMemoryRepository<T extends Identifiable> implements IRepository<T> {
  private readonly store = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    return this.store.get(id) ?? null;
  }

  async save(item: T): Promise<T> {
    this.store.set(item.id, item);
    return item;
  }

  async findAll(): Promise<readonly T[]> {
    return Array.from(this.store.values());
  }

  async findWhere(predicate: (item: T) => boolean): Promise<readonly T[]> {
    return Array.from(this.store.values()).filter(predicate);
  }
}
