/**
 * EXERCISE 04.1: Interfaces vs Type Aliases & Recursive Modeling
 * Run with: npx tsx 04-interfaces-and-types/01-interfaces-vs-type-aliases/exercise.ts
 */

// TASK 1: Model a File System Node using Discriminated Union & Recursion
// A node can be:
// - A File: { type: "file", name: string, sizeBytes: number }
// - A Directory: { type: "dir", name: string, children: FsEntry[] }
// Define `FileEntry`, `DirectoryEntry`, and `FsEntry`.
export type FileEntry = any; // TODO: Implement
export type DirectoryEntry = any; // TODO: Implement
export type FsEntry = any; // TODO: Implement

// TASK 2: Implement `calculateTotalSize`
// Recursively traverses an `FsEntry` and returns the total byte size of all files contained.
export function calculateTotalSize(entry: FsEntry): number {
  // TODO: Implement recursive size calculator
  throw new Error("Not implemented");
}

function runTests() {
  console.log("Running Exercise 04.1 Tests...");
  const mockFs: FsEntry = {
    type: "dir",
    name: "root",
    children: [
      { type: "file", name: "a.txt", sizeBytes: 100 },
      {
        type: "dir",
        name: "sub",
        children: [{ type: "file", name: "b.txt", sizeBytes: 250 }],
      },
    ],
  };

  try {
    const total = calculateTotalSize(mockFs);
    if (total === 350) {
      console.log("[PASS] Exercise 04.1 Passed!");
    } else {
      console.error(`[FAIL] Exercise 04.1 Failed! Expected 350, got ${total}`);
    }
  } catch (err: any) {
    console.error("[FAIL] Exercise 04.1 Failed:", err.message);
  }
}

// runTests();
