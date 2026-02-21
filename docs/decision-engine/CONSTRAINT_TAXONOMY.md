# Frontend Architecture Decision Engine - Constraint Taxonomy (Provisional)

Status: `provisional` until `docs/operations/smoke-checks.md` exists and confirms PROMPT_04 hardening validation.

## Purpose

This taxonomy defines the input model for architecture decisions. Each constraint must be captured explicitly to avoid trend-driven choices.

## Constraint Categories

| Category | What it is | Why it matters | How it distorts architecture decisions | Failure modes if ignored |
| --- | --- | --- | --- | --- |
| UX constraints | Latency tolerance, interaction density, device class coverage, accessibility criticality | Determines acceptable rendering model, feedback strategy, and complexity budget | Teams overfit to internal desktop usage and underfit mobile/assistive usage | High abandonment, inaccessible flows, poor INP/LCP under real traffic |
| State complexity | Scope and coupling of state: local, global, collaborative, conflict-prone | Drives whether server-first, local-only, centralized store, or explicit state machine is required | Teams pick framework by preference and bolt on state controls late | Impossible UI states, race conditions, brittle refactors |
| Data volatility | Static vs slow-changing vs high-frequency streaming data | Defines cache policy, invalidation frequency, and transport choice | Teams assume request/response freshness is enough for streaming workloads | Stale dashboards, inconsistent widgets, expensive polling fallback |
| Correctness requirements | Domain tolerance for incorrect/duplicate/incomplete outcomes | Determines need for stricter types, validation depth, idempotency, and auditability | Teams optimize for velocity while domain requires assurance | Duplicate submissions, compliance breaches, audit gaps |
| Team constraints | Team size, skill variance, expected velocity, hiring profile | Determines acceptable cognitive load and tooling complexity | Teams copy advanced patterns without operational fluency | Throughput collapse, onboarding drag, uneven quality |
| Operational constraints | CDN strategy, edge constraints, offline needs, deployment model | Impacts SSR/CSR split, artifact strategy, cache controls | Teams choose architecture that their platform cannot operate reliably | Cache invalidation incidents, broken offline behavior, release fragility |
| Regulatory/security constraints | Data handling obligations, threat model, privacy and audit requirements | Forces boundaries around auth, storage, event logging, and error handling | Teams treat controls as post-launch hardening | Data leakage, legal exposure, emergency rewrites |
| Long-term maintenance risk | Product lifespan, change cadence, ownership churn, integration surface | Determines need for explicit contracts and low-drift architecture | Teams optimize for first release and defer structural clarity | Migration dead-ends, escalating defect cost, rewrite pressure |

## Input Fields by Category

### UX constraints

- `latency_tolerance_ms`: tolerated response time before explicit progress UI
- `interaction_density`: `low | medium | high`
- `device_class_mix`: `mobile`, `desktop`, `large-display`, or combination
- `accessibility_criticality`: `baseline | high | regulated`

### State complexity

- `state_scope`: `local | mixed | global`
- `collaboration_mode`: `single-user | multi-user | collaborative-realtime`
- `conflict_probability`: `low | medium | high`

### Data volatility

- `volatility`: `static | slow-changing | bursty | high-frequency-streaming`
- `freshness_sla_seconds`: integer
- `offline_reconciliation_need`: `none | light | robust`

### Correctness requirements

- `assurance_level`: `low | moderate | high-assurance`
- `idempotency_required`: boolean
- `audit_trail_required`: boolean

### Team constraints

- `team_size`: integer
- `skill_variance`: `low | medium | high`
- `delivery_pressure`: `low | medium | high`

### Operational constraints

- `hosting_mode`: `standard-cdn | cdn-heavy | edge-first`
- `deploy_frequency_per_week`: integer
- `runtime_observability_maturity`: `low | medium | high`

### Regulatory/security constraints

- `regulatory_profile`: `none | pii | pci | hipaa | sox | mixed`
- `data_residency_restrictions`: boolean
- `security_review_frequency`: `none | periodic | per-release`

### Long-term maintenance risk

- `product_horizon_months`: integer
- `integration_surface`: `small | medium | large`
- `expected_team_churn`: `low | medium | high`

## Normalized Scoring Semantics

All weighted criteria use a 0-5 importance scale.

- `0`: not relevant
- `1`: minor influence
- `3`: significant influence
- `5`: primary decision driver

## Governance Rules

1. No framework decision is valid without a filled scenario input.
2. Unknown values default to conservative assumptions (`higher risk`, `lower confidence`).
3. Any decision with confidence `< 0.70` requires architecture review.
4. Decisions are advisory; overrides must include rationale and risk acceptance.
