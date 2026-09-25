/**
 * Level 20: 5 Realistic Broken TypeScript Cases
 *
 * Each case demonstrates a real compiler error.
 * Read each case, identify WHY the compiler complains, and design the fix!
 * Then check diagnosis-and-fixes.ts.
 */

// =========================================================================
// CASE 1: Union Narrowing Failure Inside a Closure Callback
// =========================================================================
export function case1(value: string | null) {
  if (value !== null) {
    setTimeout(() => {
      // Uncommenting the next line gives:
      // TS18047: 'value' is possibly 'null'.
      // console.log(value.toUpperCase());
    }, 100);
  }
}

// =========================================================================
// CASE 2: Generic Constraint Inversion
// =========================================================================
interface Item {
  id: string;
  weight: number;
}

// export function case2<T extends Item>(items: T[]): T[] {
//   // Error: '{ id: string; weight: number; }' is assignable to the constraint of type 'T',
//   // but 'T' could be instantiated with a different subtype of constraint 'Item'.
//   return items.map(item => ({ ...item, weight: item.weight + 1 }));
// }

// =========================================================================
// CASE 3: Excess Property Check with Object Destructuring
// =========================================================================
interface EndpointOptions {
  timeoutMs: number;
  retries?: number;
}

export function case3(options: EndpointOptions) {
  // Call site error:
  // case3({ timeoutMs: 5000, Retries: 3 });
  // Error: Object literal may only specify known properties, and 'Retries' does not exist in type 'EndpointOptions'.
}

// =========================================================================
// CASE 4: Contravariant Function Assignment Failure
// =========================================================================
type ClickHandler = (event: MouseEvent) => void;
type ElementHandler = (event: Event) => void;

let clickFn: ClickHandler;
let elementFn: ElementHandler = (e) => console.log(e.timeStamp);

// Valid or error?
clickFn = elementFn; // [PASS] Valid contravariant assignment!
// But:
// elementFn = clickFn; // [FAIL] TS2322: Type 'ClickHandler' is not assignable to type 'ElementHandler'.

// =========================================================================
// CASE 5: Impossible Intersection Resulting in Never
// =========================================================================
type ConfigA = { mode: "dark"; color: string };
type ConfigB = { mode: "light"; fontSize: number };

export type MergedConfig = ConfigA & ConfigB;
// What is MergedConfig['mode']?
// TS evaluates mode to: 'never'!
