# 📖 Final Assessment Answer Key — Part 2: Type Prediction (20 Problems)

1. **Problem 1**: `string`. (`number & string` collapses to `never`, and `string | never` is `string`).
2. **Problem 2**: `"GET" | "POST"`.
3. **Problem 3**: `string`. (Infers inner type of `Box<string>`).
4. **Problem 4**: `"b" | "c"`. (Excludes `"a"` from union).
5. **Problem 5**: `number`. (Extracts matching types between unions).
6. **Problem 6**: `string | number`. (Filters out `null` and `undefined`).
7. **Problem 7**: `never`. (Naked `never` in distributive conditional evaluates 0 times).
8. **Problem 8**: `true`. (Tuple wrapping prevents distributivity, successfully matching `[never]`).
9. **Problem 9**: `number`. (`-?` removes optionality).
10. **Problem 10**: `"user_id" | "user_name"`. (Template literal key remapping).
11. **Problem 11**: `"run" | "stop"`. (Filters keys where value extends `Function`).
12. **Problem 12**: `10`. (Extracts head element of tuple).
13. **Problem 13**: `[number, boolean]`. (Extracts rest tuple tail).
14. **Problem 14**: `string[]`. (Unpacks 1 array level).
15. **Problem 15**: `"click_event" | "hover_event"`.
16. **Problem 16**: Valid! An array of union objects `(A | B)[]` allows an object possessing fields from both `A` and `B` due to structural typing.
17. **Problem 17**: `FnB = FnA` is valid! (FnA handles `string | number`; assigning it to a handler expecting `string` is safely contravariant).
18. **Problem 18**: `number`. (`Awaited` recursively unwraps nested promises).
19. **Problem 19**: `1 | 2 | 3`. (Union of all property values).
20. **Problem 20**: `{ a: 1 } & { b: 2 }`. (Contravariant inference in function parameters converts union to intersection).
