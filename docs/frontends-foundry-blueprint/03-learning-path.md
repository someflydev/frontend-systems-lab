# Section 3 - Learning Path

## Stage A - HTML/CSS Fundamentals to Advanced

- Objectives: semantics, forms, layout systems, responsive behavior, a11y baseline.
- Prerequisites: none.
- Build artifact: responsive site with robust accessible form.
- Common traps: div-only markup, no focus styles, poor spacing rhythm.
- Verification checklist: keyboard-complete flow, AA contrast, viewport matrix pass.
- Framework mapping:
  - HTMX: template-first semantics.
  - React/Svelte/Vue: semantic component templates.
  - Elm: semantic view helpers.
  - Flutter: explicit semantics widgets mirroring web principles.

## Stage B - Progressive Enhancement with HTMX

- Objectives: server-first interaction model, fragment updates, minimal JS.
- Prerequisites: Stage A.
- Build artifact: multi-step form with server validation + fragment swaps.
- Common traps: hidden state leaks and selector fragility.
- Verification checklist: JS-disabled core path passes; analytics event hooks present.
- Mapping: HTMX as baseline; other stacks implement equivalent behavior for parity.

## Stage C - SPA Mental Model

- Objectives: routing, state partitioning, cache-aware data fetching.
- Prerequisites: Stage B.
- Build artifact: authenticated CRUD shell with guarded routes.
- Common traps: global state overreach, stale cache, broken history semantics.
- Verification checklist: deep link restore, race-safe data loading, route guard tests.
- Mapping:
  - React: router + query cache.
  - Svelte: file routes + stores.
  - Vue: router + pinia.
  - Elm: typed routes in TEA.
  - Flutter: GoRouter + state layer.

## Stage D - Data Viz and Reporting Patterns

- Objectives: table/filter/pagination/charts and export workflows.
- Prerequisites: Stage C.
- Build artifact: operations dashboard with Plotly and non-Plotly fallback.
- Common traps: sort mismatch, timezone errors, inaccessible chart context.
- Verification checklist: sort parity, chart alt summaries, export correctness.
- Mapping: Plotly in web stacks; Elm via ports; Flutter via chart package equivalent.

## Stage E - Realtime and Async Complexity

- Objectives: websockets, reconnect backoff, sequence integrity, offline/online UX.
- Prerequisites: Stage C and D.
- Build artifact: dispatch board with gap detection + resync.
- Common traps: duplicate events and stale subscriptions.
- Verification checklist: disconnect recovery under SLA, gap recovery validated.
- Mapping: hooks/composables/stores/subscriptions/streams by stack.

## Stage F - Performance and Shipping

- Objectives: bundle governance, code splitting, CDN and image strategy.
- Prerequisites: Stage A-D completion.
- Build artifact: production package with measured budgets.
- Common traps: oversized critical path JS, weak cache headers.
- Verification checklist: budget thresholds, immutable asset policy, responsive images.
- Mapping: Vite-class pipelines, Elm optimize, Flutter web optimization profile.

## Stage G - Testing and CI

- Objectives: unit/integration/E2E/a11y/visual/perf/contract gates.
- Prerequisites: Stage C-F artifacts.
- Build artifact: CI workflow enforcing quality bar.
- Common traps: flaky E2E suites and unstable selectors.
- Verification checklist: gate pass consistency and low flake rate.
- Mapping: stack-native unit/component tools + shared E2E and contract harness.

## Stage H - Deployment Patterns

- Objectives: static vs SSR deploy strategy, env config, secret handling, rollback.
- Prerequisites: Stage F and G.
- Build artifact: staged deployment with monitoring and rollback drill.
- Common traps: config drift and secret leakage.
- Verification checklist: environment parity, rollback rehearsal, error reporting wiring.
- Mapping: stack-specific hosting profiles with unified release checklist.

## Cross-Stage Exit Criteria

1. Runnable artifact shipped.
2. Stage gates pass.
3. Decision log updated with tradeoffs.
4. Observability for new critical path is in place.
