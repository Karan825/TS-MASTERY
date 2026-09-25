/**
 * Lesson 08.1: Classes, Access Modifiers & Parameter Properties
 * Run with: npx tsx 08-oop/01-classes-access-modifiers-parameter-properties/lesson.ts
 */

console.log("=== 1. Parameter Properties & Access Modifiers ===");

class DatabaseConnection {
  #connectionSecret: string; // True runtime private field

  constructor(
    public readonly host: string,
    public readonly port: number,
    protected maxPoolSize: number,
    secret: string
  ) {
    this.#connectionSecret = secret;
  }

  getDetails(): string {
    return `${this.host}:${this.port} (Pool: ${this.maxPoolSize})`;
  }

  // Safe method using native private field
  authenticate(): boolean {
    return this.#connectionSecret.length > 0;
  }
}

class PostgresConnection extends DatabaseConnection {
  constructor(host: string, port: number, secret: string) {
    super(host, port, 20, secret);
  }

  override getDetails(): string {
    return `[Postgres] ${super.getDetails()}`;
  }
}

const pg = new PostgresConnection("db.company.com", 5432, "auth_secret_99");
console.log(pg.getDetails());
console.log("Authenticated:", pg.authenticate());
