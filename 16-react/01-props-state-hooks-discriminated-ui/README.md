# Lesson 16.1: TypeScript with React — Discriminated UI & Generic Components

## 1. What is it?
Typing React applications with TypeScript:
1. **Component Props**: Typing inputs, including `children: React.ReactNode`.
2. **Discriminated UI State**: Modeling Loading / Success / Error without booleans.
3. **Event Typing**: Standard DOM event wrappers (`ChangeEvent`, `FormEvent`, `MouseEvent`).
4. **Generic Components**: Reusable components parameterized by data types (`<Table<T> />`, `<Select<T> />`).

---

## 2. Why does it exist?
### The "Boolean Soup" Anti-Pattern in React:
```tsx
// [FAIL] THE ANTI-PATTERN:
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [data, setData] = useState<User | null>(null);
const [error, setError] = useState<Error | null>(null);
```
In this model, nothing stops `isLoading === true` while `data !== null` and `error !== null` simultaneously!
The UI will render conflicting spinner and error states.

### The Solution: Discriminated UI State:
```tsx
// [PASS] PRODUCTION MODEL:
type AsyncUiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

---

## 3. Generic Components
```tsx
interface ListProps<T> {
  items: readonly T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => string; // Or JSX.Element
}

export function List<T>({ items, keyExtractor, renderItem }: ListProps<T>) {
  return items.map((item) => `${keyExtractor(item)}: ${renderItem(item)}`);
}
```

---

## 4. Event Handler Typing
```ts
// Synthetic event types from React:
type InputChangeHandler = (e: { target: { value: string } }) => void;
type FormSubmitHandler = (e: { preventDefault: () => void }) => void;
```

---

## 5. Exercise
Open [exercise.ts](./exercise.ts) and implement a strongly typed reducer managing a multi-variant async UI state machine.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 6. Technical Interview Questions

### Question: Why is `React.FC` (FunctionComponent) often discouraged in modern TypeScript React codebases?
- **Expected Answer**: It used to automatically include `children`.
- **Strong Answer**: In earlier versions of `@types/react`, `React.FC<Props>` automatically added an optional `children?: ReactNode` to the props type, even if the component was never meant to accept children (violating the principle of least astonishment). Furthermore, `React.FC` cannot cleanly support generic components (`const MyComp = <T>(props: Props<T>) => ...`). In modern React with TypeScript, the industry standard is to type props directly on the function signature: `function MyComponent({ title, children }: MyProps)`.

---

## 7. 5-Minute Active Recall
1. Why is a discriminated union better than four boolean state variables in React?
2. What type should you use for children in React props?
3. How do you type a generic component prop that renders each item?

<details>
<summary>[RECALL] Check Answers</summary>

1. It makes invalid UI states (such as loading and error at the same time) impossible to represent.
2. `React.ReactNode` (or an element type).
3. `renderItem: (item: T) => React.ReactNode`.
</details>
