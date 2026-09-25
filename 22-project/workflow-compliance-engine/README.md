# Level 22 Capstone Project: Enterprise Workflow & Compliance Engine

## 🏢 Business Overview
Modern financial, healthcare, and telecommunications platforms operate under strict regulatory compliance frameworks (TCPA, HIPAA, SOC-2).
In this capstone project, you build an **Enterprise Workflow & Compliance Engine**:
- A type-safe rules evaluation pipeline that audits and verifies communication and transaction events against compliance policies.
- Utilizes branded types for IDs, discriminated unions for compliance policies, generic repositories for state persistence, runtime schema validation at boundaries, and the Result pattern for error handling.

---

## System Architecture
```
[ Incoming Event Payload (unknown) ]
                 │
                 ▼
       [ Runtime Validator ]  (src/validator.ts)
                 │
                 ▼ (Typed Event)
   [ Compliance Engine Pipeline ]  (src/engine.ts)
      ├── 1. Time Window Rule (e.g. No calls before 8am or after 9pm)
      ├── 2. Consent Verification Rule (Opt-in verification)
      └── 3. Frequency Limit Rule (Rate-limiting daily touches)
                 │
                 ▼
    [ Immutable Audit Receipt ]
                 │
                 ▼
    [ Generic Repository Store ]  (src/repository.ts)
```

---

## Milestones

### Milestone 1: Domain Modeling & Branded Types
- Files: `src/types.ts`
- Implement branded types: `ComplianceEventId`, `PolicyId`.
- Implement Discriminated Union for rules: `TimeWindowRule | ConsentRule | FrequencyRule`.
- Implement Result monad for pipeline evaluation.

### Milestone 2: Boundary Schema Validation
- Files: `src/validator.ts`
- Validate untrusted input without `any`.
- Guard against malformed dates, phone numbers, and negative counts.

### Milestone 3: Repository & State Engine
- Files: `src/repository.ts`, `src/engine.ts`
- Generic CRUD repository for audit logs.
- Rule evaluation with exhaustive `never` checks.

### Milestone 4: Execution CLI & Test Suite
- Files: `src/index.ts`, `tests/engine.test.ts`
- Run with: `npm run project:run`
- Test with: `npm run test:project`

---

## Interview Questions Based on What You Built
1. *Why did you use branded types for `ComplianceEventId` instead of raw strings?*  
   *Answer*: To prevent primitive obsession, ensuring an Event ID cannot be passed where an Account ID or Policy ID is expected.
2. *How does the compliance engine guarantee that new compliance rules won't be silently skipped?*  
   *Answer*: The rule evaluator uses an exhaustive switch with `assertNever(rule)`, causing a compile-time failure if a new policy variant is added without an evaluation handler.
