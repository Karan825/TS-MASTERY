# Level 18: TypeScript Code Reading & Type Prediction

## Objective
In production engineering, you frequently have to read complex type definitions in open-source libraries (e.g. TanStack Query, Redux Toolkit, Prisma, TRPC, Zod).
This level is designed to train your mental compiler.

---

## How to Work Through This Module
1. Open [`challenges.ts`](./challenges.ts).
2. For each challenge, **do NOT hover with your IDE cursor**.
3. Trace the compiler evaluation on paper or in comments.
4. Record your prediction for the resulting type.
5. Open [`explanations.md`](./explanations.md) to compare your reasoning against the compiler's step-by-step evaluation trace!

---

## Reading Strategies for Complex Types
1. **Identify the Type Category**: Is it a mapped type (`[K in ...]`), a conditional type (`extends ? :`), or an indexed access (`T[K]`)?
2. **Find the Evaluated Inputs**: What are the concrete type arguments being passed in?
3. **Trace Distributivity**: If a union is passed into a naked conditional type, evaluate each union variant independently!
4. **Solve from Inner to Outer**: Unpack inner utility calls (`keyof`, `Exclude`) before resolving the outer wrapper.
