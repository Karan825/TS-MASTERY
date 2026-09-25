/**
 * Coding Interview Track 02: Type-Safe Event Emitter
 *
 * Requirements:
 * - Generic over an Event Map interface: <TEvents extends Record<string, any>>
 * - Strongly typed .on(), .off(), .emit()
 * - Listener unsubscribe return function
 * Run with: npx tsx 24-coding-interview/02-type-safe-event-emitter.ts
 */

export type Listener<T> = (payload: T) => void;

export class TypedEventEmitter<TEvents extends Record<string, any>> {
  private readonly listeners: {
    [K in keyof TEvents]?: Set<Listener<TEvents[K]>>;
  } = {};

  on<K extends keyof TEvents>(event: K, listener: Listener<TEvents[K]>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event]!.add(listener);

    // Return cleanup unsubscribe function:
    return () => this.off(event, listener);
  }

  off<K extends keyof TEvents>(event: K, listener: Listener<TEvents[K]>): void {
    const set = this.listeners[event];
    if (set) {
      set.delete(listener);
      if (set.size === 0) {
        delete this.listeners[event];
      }
    }
  }

  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    const set = this.listeners[event];
    if (set) {
      for (const listener of set) {
        listener(payload);
      }
    }
  }
}

// Verification
interface ChatEvents {
  message: { sender: string; text: string };
  userJoined: { userId: string };
  disconnect: void;
}

const emitter = new TypedEventEmitter<ChatEvents>();

let received = "";
const unsubscribe = emitter.on("message", (msg) => {
  received = `${msg.sender}: ${msg.text}`;
});

emitter.emit("message", { sender: "Alice", text: "Hello!" });
console.assert(received === "Alice: Hello!");

unsubscribe();
emitter.emit("message", { sender: "Bob", text: "Are you there?" });
console.assert(received === "Alice: Hello!", "Unsubscribed listener should not receive updates");

console.log("[PASS] Type-Safe EventEmitter Verified Successfully!");
