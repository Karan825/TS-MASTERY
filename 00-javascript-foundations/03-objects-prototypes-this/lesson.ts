/**
 * Lesson 00.3: Prototypes, Prototype Chains & 'this' Binding
 * Run with: npx tsx 00-javascript-foundations/03-objects-prototypes-this/lesson.ts
 */

console.log("=== 1. JavaScript Prototype Chain in Action ===");

interface Animal {
  species: string;
}

const animalProto: Animal = {
  species: "Canine",
};

// Object.create sets up internal [[Prototype]] linkage
const dog = Object.create(animalProto);
dog.name = "Rex";

console.log("dog.name (own property):", dog.name);
console.log("dog.species (delegated to prototype):", dog.species);
console.log("Object.getPrototypeOf(dog) === animalProto:", Object.getPrototypeOf(dog) === animalProto);

console.log("\n=== 2. TypeScript 'this' Parameter Protection ===");

interface QueryExecutor {
  dsn: string;
  run(this: QueryExecutor, sql: string): string;
}

const executor: QueryExecutor = {
  dsn: "postgres://localhost:5432/main",
  run(this: QueryExecutor, sql: string): string {
    return `[${this.dsn}] Query: ${sql}`;
  },
};

// Safe call: Implicit binding (executor is left of the dot)
console.log(executor.run("SELECT 1;"));

// If we detach:
const detachedRun = executor.run;
// In strict TypeScript, detachedRun("SELECT 1") fails at compile time because
// the calling context is void!
// To fix it, we explicitly bind or call:
console.log("Explicit binding call:", detachedRun.call(executor, "SELECT COUNT(*) FROM logs;"));

console.log("\n=== 3. Polymorphic 'this' in Fluent API ===");

class QueryBuilder {
  protected table: string = "";
  protected whereClauses: string[] = [];

  from(table: string): this {
    this.table = table;
    return this; // Returns polymorphic 'this'
  }

  where(clause: string): this {
    this.whereClauses.push(clause);
    return this;
  }

  build(): string {
    const whereStr = this.whereClauses.length > 0 ? ` WHERE ${this.whereClauses.join(" AND ")}` : "";
    return `SELECT * FROM ${this.table}${whereStr}`;
  }
}

const query = new QueryBuilder()
  .from("users")
  .where("active = true")
  .where("age > 18")
  .build();

console.log("Constructed query:", query);
