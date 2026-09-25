/**
 * Lesson 06.2: Mapped Types & Key Remapping
 * Run with: npx tsx 06-advanced-types/02-mapped-types-and-key-remapping/lesson.ts
 */

console.log("=== 1. Modifiers & Key Remapping ===");

interface Model {
  id: string;
  name: string;
  age?: number;
}

// 1. Strip optionality with -?
type ConcreteModel<T> = {
  [K in keyof T]-?: T[K];
};

type StrictPerson = ConcreteModel<Model>;
// 'age' is now required 'number'!

// 2. Key remapping into Change Event handlers:
type ChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (newValue: T[K]) => void;
};

type ModelEvents = ChangeHandlers<Model>;
/*
Evaluates to:
{
  onIdChange: (newValue: string) => void;
  onNameChange: (newValue: string) => void;
  onAgeChange: (newValue: number | undefined) => void;
}
*/

const events: ModelEvents = {
  onIdChange: (id) => console.log("ID changed to:", id),
  onNameChange: (name) => console.log("Name changed to:", name),
  onAgeChange: (age) => console.log("Age changed to:", age),
};

events.onNameChange("Antigravity Engineer");
