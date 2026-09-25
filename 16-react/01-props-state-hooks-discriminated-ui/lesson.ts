/**
 * Lesson 16.1: TypeScript with React Patterns
 * Run with: npx tsx 16-react/01-props-state-hooks-discriminated-ui/lesson.ts
 */

console.log("=== 1. Discriminated Union UI State Machine ===");

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export type AsyncAction<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T }
  | { type: "FETCH_ERROR"; error: Error };

export function asyncReducer<T>(
  state: AsyncState<T>,
  action: AsyncAction<T>
): AsyncState<T> {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading" };
    case "FETCH_SUCCESS":
      return { status: "success", data: action.payload };
    case "FETCH_ERROR":
      return { status: "error", error: action.error };
  }
}

// Initial state:
let uiState: AsyncState<{ username: string }> = { status: "idle" };
uiState = asyncReducer(uiState, { type: "FETCH_START" });
console.log("State after START:", uiState.status);

uiState = asyncReducer(uiState, {
  type: "FETCH_SUCCESS",
  payload: { username: "karan" },
});

if (uiState.status === "success") {
  console.log("Safely rendered user:", uiState.data.username);
}
