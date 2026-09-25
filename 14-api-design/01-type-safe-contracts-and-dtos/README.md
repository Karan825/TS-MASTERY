# Lesson 14.1: Type-Safe API Design, DTOs & Endpoint Contracts

## 1. What is it?
Type-Safe API Design establishes a single, shared contract between backend servers and frontend/mobile clients.
It models:
1. **Request DTOs**: Payload models for creating or updating entities.
2. **Query Contracts**: Filtering, pagination, and sorting parameters.
3. **Response Envelopes**: Standardized success vs error discriminated unions.
4. **Typed API Client**: An RPC-like or REST client that knows the exact request and response types for every route.

---

## 2. Why does it exist?
In un-typed or loosely typed codebases, APIs drift:
- The backend renames a field from `userId` to `id`.
- The frontend continues sending `userId`.
- The error is only discovered when end-users report broken forms.
A shared TypeScript contract guarantees that changing an API contract triggers compile errors across the entire stack.

---

## 3. Mental Model: The API Blueprint Contract
```
Endpoint: POST /api/v1/orders
Contract:
  - Params: none
  - Body:   CreateOrderDto ({ items: OrderItemDto[]; shippingAddress: Address })
  - Returns: ApiResponse<OrderEntity>
```

---

## 4. Syntax & Architecture
```ts
export type SortOrder = "asc" | "desc";

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface SortQuery<TFields extends string> {
  sortBy?: TFields;
  order?: SortOrder;
}

export type ApiResponse<T> =
  | { success: true; data: T; timestamp: string }
  | { success: false; error: { code: string; message: string }; timestamp: string };
```

---

## 5. Generic API Client Pattern
```ts
export interface ApiEndpoints {
  "/users": {
    GET: { query: PaginationQuery; response: UserSummary[] };
    POST: { body: CreateUserDto; response: UserEntity };
  };
  "/orders": {
    GET: { query: PaginationQuery & SortQuery<"total" | "date">; response: OrderEntity[] };
  };
}
```

---

## 6. Common Mistakes
```ts
// [FAIL] MISTAKE: Using the raw Database Entity as the API Request DTO
// If 'UserEntity' has 'hashedPassword', 'id', and 'createdAt',
// callers shouldn't be asked to provide them in a signup form!
// Always decouple entities from DTOs:
type CreateUserDto = Omit<UserEntity, "id" | "createdAt">;
```

---

## 7. Exercise
Open [exercise.ts](./exercise.ts) and implement a typed endpoint client that validates path and method contracts.

<details>
<summary>[HINT] View Solution</summary>

See [solution.ts](./solution.ts).
</details>

---

## 8. Technical Interview Questions

### Question: What is the purpose of a DTO (Data Transfer Object) in TypeScript, and how does it differ from a domain entity?
- **Expected Answer**: A DTO is the shape of data sent over the wire, while an entity is the database model.
- **Strong Answer**: A domain entity represents the full internal state and business rules of an object (including database IDs, versioning counters, sensitive fields like password hashes, and relations). A DTO models the exact public contract exposed across a network boundary. Using TypeScript utility types like `Omit<Entity, 'id' | 'passwordHash'>` or `Pick`, we derive explicit request and response DTOs. This prevents leaking internal fields to the client, prevents clients from tampering with server-controlled properties, and isolates internal schema changes from public API consumers.

---

## 9. 5-Minute Active Recall
1. Why shouldn't a frontend use the database entity type for POST payloads?
2. What utility type creates a DTO by removing private database columns?
3. How do you model sorting direction type-safely?

<details>
<summary>[RECALL] Check Answers</summary>

1. Because database entities include auto-generated IDs, timestamps, and private fields that the client shouldn't supply.
2. `Omit<Entity, Keys>`.
3. `"asc" | "desc"`.
</details>
