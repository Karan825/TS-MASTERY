/**
 * REFERENCE SOLUTION: Exercise 17.1
 * Type-Safe Builder Pattern
 */

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

export class EmailBuilder<HasTo extends boolean = false, HasSubject extends boolean = false> {
  private toVal?: string;
  private subjectVal?: string;
  private bodyVal: string = "";

  setTo(to: string): EmailBuilder<true, HasSubject> {
    const next = new EmailBuilder<true, HasSubject>();
    next.toVal = to;
    next.subjectVal = this.subjectVal;
    next.bodyVal = this.bodyVal;
    return next;
  }

  setSubject(subject: string): EmailBuilder<HasTo, true> {
    const next = new EmailBuilder<HasTo, true>();
    next.toVal = this.toVal;
    next.subjectVal = subject;
    next.bodyVal = this.bodyVal;
    return next;
  }

  setBody(body: string): this {
    this.bodyVal = body;
    return this;
  }

  send(this: EmailBuilder<true, true>): EmailMessage {
    return {
      to: this.toVal!,
      subject: this.subjectVal!,
      body: this.bodyVal,
    };
  }
}

// Verification
const msg = new EmailBuilder()
  .setTo("user@test.com")
  .setSubject("Welcome")
  .setBody("Hello there!")
  .send();

console.assert(msg.to === "user@test.com");
console.assert(msg.subject === "Welcome");
console.assert(msg.body === "Hello there!");

console.log("[PASS] Exercise 17.1 Solution Verified Successfully!");
