/**
 * REFERENCE SOLUTION: Exercise 04.1
 * Interfaces vs Type Aliases & Recursive Modeling
 */

export interface FileEntry {
  type: "file";
  name: string;
  sizeBytes: number;
}

export interface DirectoryEntry {
  type: "dir";
  name: string;
  children: FsEntry[];
}

export type FsEntry = FileEntry | DirectoryEntry;

export function calculateTotalSize(entry: FsEntry): number {
  if (entry.type === "file") {
    return entry.sizeBytes;
  }

  // Recursive step for directory children:
  return entry.children.reduce((sum, child) => sum + calculateTotalSize(child), 0);
}

// Verification
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

const total = calculateTotalSize(mockFs);
console.assert(total === 350, "Total size must equal 350");
console.log("[PASS] Exercise 04.1 Solution Verified Successfully!");
