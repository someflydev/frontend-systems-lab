# Frontend Architecture Decision Engine - Framework Capability Matrix (Provisional)

Status: `provisional` until `docs/operations/smoke-checks.md` confirms PROMPT_04 hardening validation.

## Scoring Scale

- Strength score: `1` (weak) to `5` (strong)
- For `cognitive_load` and `deployment_complexity`, higher means more costly/complex.

## Dimension Matrix

| Framework | State modeling | Async handling | Realtime ergonomics | Correctness guarantees | Bundle/perf profile | Accessibility ergonomics | SEO friendliness | Dev velocity | Cognitive load | Testing maturity | Deployment complexity |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| HTMX | 2 | 3 | 2 | 3 | 5 | 4 | 5 | 4 | 2 | 3 | 2 |
| React + TS | 5 | 5 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 5 | 3 |
| Elm | 5 | 4 | 3 | 5 | 4 | 4 | 3 | 3 | 4 | 4 | 3 |
| Svelte | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 5 | 3 | 4 | 2 |
| Vue | 4 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 3 | 4 | 2 |
| Flutter Web | 4 | 4 | 3 | 4 | 2 | 3 | 1 | 3 | 4 | 3 | 4 |

## Framework Profiles

### HTMX

- Risk profile: low implementation complexity, medium long-term risk for highly interactive collaborative domains.
- Best-fit scenario archetypes:
  - multi-step funnels with strong validation
  - content-heavy sites requiring SEO and progressive enhancement
  - back-office CRUD with moderate interaction complexity
- Red-flag conditions:
  - collaborative realtime with frequent client-side reconciliation
  - offline-first requirements with conflict merging
  - highly dynamic client-only widget ecosystems

### React + TS

- Risk profile: high ecosystem power, medium risk of over-architecting.
- Best-fit scenario archetypes:
  - complex dashboards with async state and pluggable modules
  - integration-heavy applications
  - teams requiring mature tooling and testing depth
- Red-flag conditions:
  - small scope projects with strict simplicity constraints
  - teams lacking TypeScript and state discipline

### Elm

- Risk profile: high correctness, medium adoption risk due skill availability and interop friction.
- Best-fit scenario archetypes:
  - high-assurance workflows with strict state transitions
  - regulated forms where invalid states are unacceptable
- Red-flag conditions:
  - heavy dependency on fast-changing third-party JS UI packages
  - organizations unable to support FP onboarding

### Svelte

- Risk profile: high delivery speed, medium risk in specialized enterprise integration ecosystems.
- Best-fit scenario archetypes:
  - performance-sensitive dashboards
  - medium-complexity web apps with lean payload requirements
- Red-flag conditions:
  - dependency requirements tightly bound to React-only ecosystems

### Vue

- Risk profile: balanced operational risk with strong convention support.
- Best-fit scenario archetypes:
  - CRUD-heavy business apps
  - SSR-friendly applications with moderate/high interactivity
- Red-flag conditions:
  - organizations with strict single-stack mandates elsewhere

### Flutter Web

- Risk profile: cross-platform leverage, high SEO/payload risk for web acquisition surfaces.
- Best-fit scenario archetypes:
  - internal tools aligned with Flutter/mobile ecosystem
  - cross-platform workflows sharing UI logic
- Red-flag conditions:
  - SEO-critical public sites
  - strict low-bandwidth first-load constraints

## Failure Trajectory Simulation

### Simulation A: HTMX chosen for collaborative realtime dispatch board

- Degrades first: event synchronization fidelity under high update rates.
- Becomes brittle: incremental server fragment composition and concurrency handling.
- Velocity collapse point: adding replay, dedupe, and conflict logic with minimal client-state structure.
- Refactor cost: medium-high; requires introducing client state architecture and transport abstractions.

### Simulation B: Flutter Web chosen for SEO-driven lead funnel

- Degrades first: organic acquisition performance and crawlability.
- Becomes brittle: compensating with server-side landing duplicates.
- Velocity collapse point: parallel maintenance of web-acquisition pages and Flutter app shell.
- Refactor cost: high; split architecture required.

### Simulation C: React + TS chosen for high-assurance regulated workflow without strict state modeling

- Degrades first: correctness consistency across edge-state transitions.
- Becomes brittle: ad hoc state coupling across components.
- Velocity collapse point: bug triage and regression-fix cycles increase per release.
- Refactor cost: medium-high; requires explicit state machine adoption and API contract hardening.

## Architecture Drift Detection

### Signals architecture no longer fits

1. Same defect class repeats over 3+ sprints.
2. Feature cycle time increases while scope remains stable.
3. Exception rate rises after each release despite stable infra.
4. Accessibility regressions recur on unchanged flows.
5. Cache and invalidation incidents increase.

### Metrics to monitor

1. Lead time for change (median and p90).
2. Defect escape rate by severity.
3. Rollback frequency and MTTR.
4. Bundle size drift and web vitals (LCP, INP, CLS).
5. Flake rate in E2E and integration suites.
6. A11y violation trend in CI.

### Refactor triggers

1. Two consecutive quarters above defect threshold.
2. p90 lead time exceeds target by >30 percent.
3. Performance budgets missed for three releases.
4. Mandatory compliance control cannot be implemented without large workaround.

### Safe migration strategies

1. Strangler migration by route or feature boundary.
2. Shared contract-first migration (API and event schemas fixed before UI change).
3. Parallel run with shadow traffic and parity checks.
4. Keep analytics event semantics stable through migration.
