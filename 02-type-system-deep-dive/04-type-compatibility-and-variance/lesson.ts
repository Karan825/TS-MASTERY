/**
 * Lesson 02.4: Type Compatibility & Variance
 * Run with: npx tsx 02-type-system-deep-dive/04-type-compatibility-and-variance/lesson.ts
 */

console.log("=== 1. Covariance: Return Types ===");

class Device {
  brand = "Generic";
}

class Phone extends Device {
  dial() {
    console.log("Dialing...");
  }
}

type DeviceProducer = () => Device;
type PhoneProducer = () => Phone;

let producePhone: PhoneProducer = () => new Phone();
let produceDevice: DeviceProducer = producePhone; // Covariant assignment!

console.log("Produced device brand:", produceDevice().brand);

console.log("\n=== 2. Contravariance: Parameter Types ===");

type DeviceHandler = (d: Device) => void;
type PhoneHandler = (p: Phone) => void;

let handleDevice: DeviceHandler = (d) => console.log("Handling device:", d.brand);

// We can assign handleDevice to PhoneHandler because anyone giving a Phone
// provides everything handleDevice needs!
let handlePhone: PhoneHandler = handleDevice;

handlePhone(new Phone());
