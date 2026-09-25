/**
 * Lesson 05.2: Multiple Type Parameters & Generic Inference
 * Run with: npx tsx 05-generics/02-multiple-type-parameters-and-inference/lesson.ts
 */

console.log("=== 1. Constraint Chains: keyof and T[K] ===");

interface DatabaseRecord {
  id: string;
  tableName: string;
  rowCount: number;
  isReplicated: boolean;
}

function extractField<T, K extends keyof T>(record: T, field: K): T[K] {
  return record[field];
}

const tableRecord: DatabaseRecord = {
  id: "rec_9",
  tableName: "orders",
  rowCount: 145000,
  isReplicated: true,
};

// Return type is inferred as number!
const count = extractField(tableRecord, "rowCount");
console.log("Extracted row count (number):", count);

console.log("\n=== 2. Currying to Circumvent All-or-Nothing Generic Inference ===");

// We want callers to explicitly specify TOutput, but have TInput inferred from argument!
const createTransformer = <TOutput>() => {
  return <TInput>(input: TInput, mapper: (val: TInput) => TOutput): TOutput => {
    return mapper(input);
  };
};

const stringify = createTransformer<string>();
const output = stringify(tableRecord, (rec) => `${rec.tableName} has ${rec.rowCount} rows`);
console.log("Curried transformer result:", output);
