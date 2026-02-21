# Section 2 - Platform Blueprint

## 2.1 Artifact Structure

Recommended topology: monorepo first for shared parity and governance.

```text
frontends-foundry/
  docs/
  scenarios/
  shared/
  apps/
    htmx/
    react-ts/
    svelte/
    vue/
    elm/
    flutter-web/
  services/
  tooling/
```

Detailed layout:

```text
frontends-foundry/
  README.md
  docs/
    operator-guide.md
    curriculum/
    decisions/
  scenarios/
    SCN-001-lead-funnel/
      scenario.yaml
      fixtures/
      contracts/
      stage-gates/
    SCN-002-ops-dashboard/
    SCN-003-dispatch-realtime/
    SCN-004-admin-crud/
    SCN-005-content-site/
    SCN-006-high-correctness-workflow/
    SCN-007-offline-inspection/
    SCN-008-report-builder/
  shared/
    design-tokens/
      tokens.css
      tailwind.preset.ts
    contracts/
    mocks/
    qa/
  apps/
    htmx/
    react-ts/
    svelte/
    vue/
    elm/
    flutter-web/
  services/
    mock-api/
    websocket-sim/
    asset-pipeline/
  tooling/
    scripts/
    ci/
```

Naming conventions:

1. Scenario IDs: `SCN-###-slug`.
2. Stage labels: `A` through `H`; milestones `M0` to `M3`.
3. Implementation IDs: `impl-{stack}-{scenario}-{version}`.
4. Decisions: `DEC-YYYYMMDD-title.md`.

Scenario versioning:

1. `MAJOR`: behavior/contract change.
2. `MINOR`: non-breaking fixture or UX detail change.
3. Each implementation declares supported scenario version.

Stage gate enforcement:

1. Functional acceptance gate.
2. Accessibility gate.
3. Performance gate.
4. Observability completeness gate.
5. Test reliability gate.

## 2.2 Scenario Engine (8 Realistic Scenarios)

### SCN-001 Mortgage Refinance Lead Funnel

- Persona + goal: homeowner compares offers and books advisor call in under 6 minutes.
- UX constraints: mobile-first; desktop trust signals; WCAG AA.
- Data constraints: step save; strict validation; credit API latency 3-7s.
- Observability: step completion/dropoff, field error rate, consent timestamp.
- Done: validated lead to CRM with analytics-safe event stream.
- Milestones: M0 static, M1 3-step form, M2 robust validation/retry, M3 analytics + handoff.

### SCN-002 Retail Operations Dashboard

- Persona + goal: regional manager identifies underperforming stores daily.
- UX constraints: dense desktop table, tablet fallback, keyboard filter control.
- Data constraints: server paging/sorting, row-level permission filters, partial widget failure.
- Observability: query timings, chart errors, filter usage telemetry.
- Done: filterable table + Plotly trend + CSV export.
- Milestones: M0 KPIs, M1 table/filter, M2 chart, M3 export + alert hooks.

### SCN-003 Logistics Realtime Dispatch Board

- Persona + goal: dispatcher tracks ETAs/incidents in realtime.
- UX constraints: large-display board and operator desktop.
- Data constraints: sequence ordering, reconnect + replay.
- Observability: reconnect counts, sequence gaps, socket uptime.
- Done: live board with reconnect and resync.
- Milestones: M0 static board, M1 polling, M2 socket feed, M3 replay recovery.

### SCN-004 Subscription Back Office Admin

- Persona + goal: support agent updates customer plans under policy rules.
- UX constraints: form-dense desktop, shortcut-friendly, destructive action clarity.
- Data constraints: role permissions, optimistic row update with rollback.
- Observability: permission denied counts, audit event integrity.
- Done: CRUD + RBAC view controls + audit timeline UI.
- Milestones: M0 read-only, M1 CRUD, M2 role controls, M3 full audit trail.

### SCN-005 Content-Heavy Knowledge Site

- Persona + goal: customer compares plans and policy docs quickly.
- UX constraints: SEO-first, low-end mobile performance, image-heavy pages.
- Data constraints: CMS content volatility and legal copy freshness.
- Observability: LCP/CLS trends, image byte budget, SEO landing retention.
- Done: fast content site with responsive image pipeline and progressive enhancement.
- Milestones: M0 article template, M1 search/index, M2 image pipeline, M3 partial hydration.

### SCN-006 High-Correctness Eligibility Workflow

- Persona + goal: compliance operator submits error-intolerant packet.
- UX constraints: explicit step lock/unlock, resumable sessions, accessible errors.
- Data constraints: strict business rules, immutable submission snapshot, idempotent finalization.
- Observability: rule fail taxonomy, correction loops, step time.
- Done: state-machine style workflow with auditable output.
- Milestones: M0 schema, M1 workflow model, M2 rule integration, M3 signed submission.

### SCN-007 Offline-ish Field Inspection

- Persona + goal: inspector completes checklist with photos in weak connectivity.
- UX constraints: mobile capture flow, visible sync status.
- Data constraints: local queue, delayed sync, conflict resolution.
- Observability: sync backlog, upload failures, conflict resolution frequency.
- Done: local capture + deferred sync + merge UX.
- Milestones: M0 checklist UI, M1 local persistence, M2 sync queue, M3 conflict manager.

### SCN-008 Executive Report Builder

- Persona + goal: analyst builds recurring report templates.
- UX constraints: desktop productivity and print-friendly output.
- Data constraints: long-running report jobs with async completion.
- Observability: generation duration, template usage, failure rates.
- Done: saveable report template and downloadable artifact.
- Milestones: M0 filter model, M1 preview, M2 async generation, M3 sharing.

## 2.3 Technology Matrix and Decision Rules

| Stack | Correctness | Iteration | Perf | Bundle | A11y ergonomics | Complex state | Learning curve | Maturity | Testing | Deployment | SSR/SEO | Realtime |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Elm | High | Medium | High | High | High | High | Medium/High | Medium | Medium | High | Medium | Medium |
| Flutter Web | High | Medium | Medium | Low | Medium | High | Medium | Medium | Medium | Medium | Low | Medium |
| React + TS | Medium/High | High | High | Medium | Medium/High | High | Medium | High | High | High | High | High |
| Svelte | Medium/High | High | High | High | Medium/High | Medium/High | Medium | High | Medium/High | High | Medium/High | High |
| Vue | Medium/High | High | High | Medium/High | Medium/High | High | Medium | High | High | High | High | High |
| HTMX | Medium | High | High | High | High | Low/Medium | Low | Medium/High | Medium | High | High | Medium |

Decision rules:

1. Prefer HTMX when form- and content-centric UX with strong SSR/SEO is primary.
2. Prefer Elm when correctness and impossible-state prevention dominate.
3. Prefer React + TS when integration breadth and hiring ecosystem matter most.
4. Prefer Svelte for lean bundles and fast implementation cycles.
5. Prefer Vue for balanced conventions and scalable team ergonomics.
6. Prefer Flutter Web when shared Dart/mobile logic is strategic and SEO is secondary.

Per-technology profile:

- Elm
  - Best for: high-assurance flows, domain-heavy forms, refactor confidence.
  - Avoid when: deep JS library dependency or rapid ad hoc integration churn.
  - Unique superpower: compiler-enforced state safety.
  - Standard convention path: TEA + decoders + bounded ports.
  - Distinctive path: domain modeling first, UI derived from state model.

- Flutter Web
  - Best for: cross-platform product parity and internal tools.
  - Avoid when: SEO-critical acquisition pages and strict initial payload targets.
  - Unique superpower: unified widget system across mobile and web.
  - Standard convention path: widget tree + Riverpod/Bloc.
  - Distinctive path: cross-target workflow parity.

- React + TS
  - Best for: large teams, complex app ecosystems, third-party integration.
  - Avoid when: minimal interactivity with no long-lived complexity.
  - Unique superpower: ecosystem breadth and modular composition.
  - Standard convention path: router + typed domain + server-state cache.
  - Distinctive path: composable design systems with deep tooling support.

- Svelte
  - Best for: performance-sensitive UI and rapid delivery.
  - Avoid when: required dependencies are React-locked.
  - Unique superpower: compiler-based runtime efficiency.
  - Standard convention path: SvelteKit routes/load/stores.
  - Distinctive path: concise reactive dashboards.

- Vue
  - Best for: scalable conventions with moderate complexity.
  - Avoid when: org stack standardization conflicts.
  - Unique superpower: SFC + composables with clear reactivity.
  - Standard convention path: Router + Pinia + Vite/Nuxt as needed.
  - Distinctive path: feature-level composable architecture.

- HTMX
  - Best for: server-rendered business workflows and progressive enhancement.
  - Avoid when: rich offline-first client state dominates.
  - Unique superpower: HTML-over-the-wire simplicity.
  - Standard convention path: template fragments + minimal JS.
  - Distinctive path: low operational complexity for high-value workflows.
