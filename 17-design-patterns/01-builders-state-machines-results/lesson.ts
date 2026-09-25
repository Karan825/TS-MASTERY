/**
 * Lesson 17.1: Type-Safe Builder Pattern
 * Run with: npx tsx 17-design-patterns/01-builders-state-machines-results/lesson.ts
 */

console.log("=== 1. Type-Safe Builder Pattern Demo ===");

interface AppConfig {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
}

export class SafeConfigBuilder<HasKey extends boolean = false, HasUrl extends boolean = false> {
  private key?: string;
  private url?: string;
  private timeout: number = 5000; // Optional with default

  setApiKey(key: string): SafeConfigBuilder<true, HasUrl> {
    const b = new SafeConfigBuilder<true, HasUrl>();
    b.key = key;
    b.url = this.url;
    b.timeout = this.timeout;
    return b;
  }

  setBaseUrl(url: string): SafeConfigBuilder<HasKey, true> {
    const b = new SafeConfigBuilder<HasKey, true>();
    b.key = this.key;
    b.url = url;
    b.timeout = this.timeout;
    return b;
  }

  setTimeout(ms: number): this {
    this.timeout = ms;
    return this;
  }

  // Callable only when HasKey and HasUrl are true!
  build(this: SafeConfigBuilder<true, true>): AppConfig {
    return {
      apiKey: this.key!,
      baseUrl: this.url!,
      timeoutMs: this.timeout,
    };
  }
}

const config = new SafeConfigBuilder()
  .setApiKey("sec_abc123")
  .setBaseUrl("https://api.domain.com")
  .setTimeout(3000)
  .build();

console.log("Config successfully built:", config);
