# Final Assessment — Part 6: Enterprise Architecture Case Studies

---

## Case Study 1: Multi-Tenant Role-Based Access Control (RBAC)

### Scenario:
You are the lead architect for an enterprise SaaS platform. The system supports multiple organizations ("Tenants"). Within each organization, users possess Roles (`Owner`, `Admin`, `Member`, `BillingManager`), and roles grant Permissions (`read:reports`, `write:billing`, `manage:users`).

### Design Requirements:
1. Model the permissions hierarchy using strict TypeScript types.
2. Prevent cross-tenant data leaks at the type level using **Branded Tenant IDs**.
3. Implement a type-safe guard `hasPermission(user: AuthenticatedUser, perm: Permission): boolean`.
4. Ensure that sensitive administrative actions (e.g. `deleteOrganization`) can only be invoked by users proven at compile time to have the `Owner` role.

---

## Case Study 2: Financial Ledger Double-Entry Transaction Engine

### Scenario:
You are designing the core ledger for a fintech payment platform handling millions of daily transactions across credit cards, ACH, and crypto rails.

### Design Requirements:
1. Every ledger transaction consists of at least two balanced entries (one debit, one credit) where $\sum \text{debits} = \sum \text{credits}$.
2. Money amounts must never use IEEE 754 floating-point numbers. Use branded integer cents (`Cents = Brand<number, "Cents">`).
3. Model ledger entry states using a **Discriminated Union** (`PENDING`, `POSTED`, `VOIDED`, `FAILED`).
4. Ensure state transitions are validated so that a `POSTED` transaction can never transition back to `PENDING`.

---

## Case Study 3: High-Throughput Event-Driven Microservice Pipeline

### Scenario:
A high-throughput message consumer ingests untrusted Kafka/RabbitMQ events from external webhooks.

### Design Requirements:
1. Define a boundary validator that accepts `unknown` payloads and rejects invalid schemas without throwing unhandled process-level exceptions.
2. Implement the **Result Monad** (`Result<T, E>`) for clean error propagation.
3. Design a generic pluggable pipeline where each step transforms the event and passes it to the next step, preserving type relationships throughout.
