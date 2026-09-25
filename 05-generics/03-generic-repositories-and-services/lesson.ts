/**
 * Lesson 05.3: Generic Repositories & Services
 * Run with: npx tsx 05-generics/03-generic-repositories-and-services/lesson.ts
 */

console.log("=== 1. Generic Repository Implementation ===");

export interface Identifiable {
  id: string;
}

export interface IRepository<T extends Identifiable> {
  findById(id: string): Promise<T | null>;
  save(item: T): Promise<T>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<T[]>;
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

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.store.values());
  }
}

interface Product extends Identifiable {
  name: string;
  price: number;
}

async function runDemo() {
  const repo = new InMemoryRepository<Product>();
  await repo.save({ id: "prod_1", name: "Mechanical Keyboard", price: 120 });
  await repo.save({ id: "prod_2", name: "Ergonomic Mouse", price: 75 });

  const found = await repo.findById("prod_1");
  console.log("Found product:", found?.name, `($${found?.price})`);

  const all = await repo.findAll();
  console.log("Total items:", all.length);
}

runDemo();
