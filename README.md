# frontend-systems-lab

Production-simulated frontend systems reference focused on one serious scenario: `SCN-001 Mortgage Refinance Lead Funnel`.

## What This Repo Is

- A constrained, depth-first frontend systems repository.
- A side-by-side implementation of one canonical scenario in:
  - `baseline-htmx` (server-first baseline)
  - `react-ts` (client-state-rich production simulation)
- A governance-backed engineering system with explicit:
  - scope controls
  - complexity budgets
  - expansion gates
  - drift detection
  - refactor/delete policy

## What It Solves

- How to ship one high-stakes funnel with:
  - async correctness (retry, idempotency, partial failure handling)
  - accessibility discipline
  - performance gates
  - observability surface
  - operational hardening checks

## Who It Is For

- Staff+ engineers defining frontend standards.
- Mid-level engineers leveling from feature work to systems work.
- Hiring managers assessing production judgment, not framework trivia.
- Founders/technical leaders needing credible frontend execution principles.

## Why It Is Different

- One scenario, deeply implemented, not many shallow demos.
- Explicit failure-mode handling is part of baseline behavior.
- Documentation and governance are first-class artifacts, not afterthoughts.
- Every expansion is constrained by measurable criteria.

## Why It Is Disciplined

- Scope contract: `docs/governance/SCOPE_CONTRACT.md`
- Complexity cap and burn model: `docs/governance/COMPLEXITY_BUDGET.md`
- Expansion gate protocol: `docs/governance/EXPANSION_GATES.md`
- Drift thresholds: `docs/governance/DRIFT_SIGNALS.md`
- Refactor/delete triggers: `docs/governance/REFACTOR_OR_DELETE_POLICY.md`

## Start Here

### Staff Engineer Path

1. `docs/scenarios/canonical-scenario-spec.md`
2. `docs/operations/smoke-checks.md`
3. `docs/governance/COMPLEXITY_BUDGET.md`
4. `docs/decision-engine/DECISION_FLOW.md`
5. `react-ts/src/App.tsx`

### Mid-Level Engineer Path

1. `docs/scenarios/canonical-scenario-spec.md`
2. `baseline-htmx/src/server.mjs`
3. `react-ts/src/App.tsx`
4. `tests/unit/validation.test.mjs`
5. `tests/integration/mock-api-submit.test.mjs`

### Hiring Manager Path

1. `docs/public/case-study.md`
2. `docs/operations/production-readiness-checklist.md`
3. `docs/operations/postmortem-simulation.md`
4. `docs/governance/SCOPE_CONTRACT.md`

### Founder Path

1. `docs/public/case-study.md`
2. `docs/operations/smoke-checks.md`
3. `docs/governance/EXPANSION_GATES.md`
4. `docs/public/blog-outline.md`

## 5-Minute Skim Path

1. Read `docs/public/case-study.md` summary and incident simulation.
2. Inspect `docs/operations/smoke-checks.md` hard pass/fail gates.
3. Scan `docs/governance/SCOPE_CONTRACT.md` rejection criteria.
4. Open `react-ts/src/App.tsx` and locate retry, WS resync, upload cancel flow.

## 2-Hour Deep Path

1. Read full scenario spec: `docs/scenarios/canonical-scenario-spec.md`.
2. Trace baseline path: `baseline-htmx/src/server.mjs`.
3. Trace React hardening path: `react-ts/src/App.tsx`, `react-ts/src/styles.css`.
4. Trace simulation backend: `scripts/mock-api.mjs`.
5. Review contracts and validation:
   - `shared/contracts/lead-submission.contract.json`
   - `shared/contracts/analytics-events.contract.json`
   - `shared/validation/leadValidation.mjs`
6. Run checks listed in `docs/operations/smoke-checks.md`.
7. Review governance and drift thresholds.

## Decision Story (Condensed)

- Chosen architecture:
  - HTMX baseline for server-first correctness baseline.
  - React implementation for rich async realism under the same scenario contract.
- Tradeoff framing:
  - We accepted higher client complexity only where resilience behavior required it.
  - We kept canonical domain and contracts shared to prevent implementation drift.
- Why not X:
  - Not adding frameworks because this repository optimizes for depth over breadth.
  - Not adding extra scenarios before SCN-001 hardening evidence.
- Explicitly avoided:
  - framework zoo expansion
  - speculative shared abstraction layers
  - tutorial-style simplification that hides failure behavior

## Signal Enhancements

### Badges That Matter (wire when CI is attached)

- `Smoke Checks: PASS/FAIL`
- `A11y Smoke: PASS/FAIL`
- `Perf Budget: PASS/FAIL`
- `Complexity Budget: current/limit`
- `Scenario Integrity: SCN-001 only`

### High-Signal Diagrams To Include

- Funnel state transitions (step + validation + retry boundary)
- Realtime advisor feed lifecycle (connect, disconnect, resync)
- Observability event flow (client -> endpoint -> metrics)

### Instant Architecture Diagram

```mermaid
flowchart LR
  A[User Input] --> B[React Funnel State]
  B --> C[Submit with Idempotency Key]
  C --> D[Mock API /api/leads/submit]
  D --> E[Tracking ID Response]
  B --> F[Quote Panel SWR]
  F --> G[/api/panels/rate-quote]
  B --> H[Advisor WS Feed]
  H --> I[/ws/advisor-availability]
  I --> J[/api/advisor-availability/resync]
  B --> K[Client Events]
  K --> L[/api/client-events]
```

## Philosophy of Frontend Systems

1. Constraint is a feature, not a limitation.
2. Correctness and recoverability outrank novelty.
3. Failure paths are part of primary UX design.
4. Operational clarity is part of architecture quality.
5. Small, explicit systems age better than broad implicit systems.

## Structured Learning Path (Derived)

### Stage 1: Contract + Validation Integrity

- Markers:
  - understands `lead-submission.contract.json`
  - can explain validation error boundaries
- Checkpoint:
  - update validation rule and keep tests green
- Exercise:
  - add one cross-field validation and corresponding unit tests

### Stage 2: Async Reliability Patterns

- Markers:
  - can trace retry/backoff and idempotency flow
  - can explain SWR and WS resync behavior
- Checkpoint:
  - reproduce async failure mode and recover path
- Exercise:
  - force quote failure and verify non-blocking funnel progression

### Stage 3: Operations + Governance Discipline

- Markers:
  - can run smoke checks and interpret pass/fail
  - can classify a proposal using expansion gates
- Checkpoint:
  - produce a complexity delta rationale for a hypothetical change
- Exercise:
  - draft a Level 2 proposal and required decision artifacts

## Authority Differentiators

- Not a tutorial repository: it encodes engineering governance and production failure behavior.
- Not framework hype: technology choices are constrained by scenario and operational requirements.
- Not feature chasing: additions must satisfy gate criteria and budget limits.
- Signals seniority through explicit tradeoff records, bounded scope, and measurable quality gates.

## Cross-Repository Integration (Systems Portfolio)

Integration assumptions and contracts for unavailable companion repositories are documented in:

- `docs/integration/ASSUMPTIONS.md`
- `docs/integration/contracts/`

These documents define interface-level alignment only and do not claim code artifacts outside this repository.

## Public Artifacts

- `docs/public/case-study.md`
- `docs/public/talk-outline-5min.md`
- `docs/public/talk-outline-30min.md`
- `docs/public/blog-outline.md`
