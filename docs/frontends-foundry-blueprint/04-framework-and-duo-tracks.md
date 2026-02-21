# Section 4 - Framework and Duo Tracks

## Elm Track

- Mental model: explicit domain modeling and deterministic state transitions.
- Skeleton: `Domain`, `Pages`, `Components`, `Api`, `Ports`, `Tests`.
- State rubric: local model for simple UI; root model for shared flows; union-type machines for high correctness.
- Forms: typed form model + explicit validators + accessible error summary.
- Routing: typed parser with explicit fallback states.
- Async/data: decoders at boundaries and command-driven effects.
- Testing: transition, validation, decoder tests.
- Build pipeline: optimize build + external asset hash pipeline.
- Uniquely awesome demo: compliance-grade state-machine workflow.

## Flutter Web Track

- Mental model: composable widget tree with explicit state boundaries.
- Skeleton: `features`, `core`, `shared`.
- State rubric: setState for simple, Riverpod for medium, Bloc/machine for complex.
- Forms: built-in form controls + validators + focus traversal.
- Routing: GoRouter with guarded flows.
- Async/data: repositories over futures/streams with cancellation handling.
- Testing: unit + widget + integration tests.
- Build pipeline: `flutter build web` with bundle and startup profiling.
- Uniquely awesome demo: mobile/web parity inspection workflow.

## React + TypeScript Track

- Mental model: component composition plus strict server/client state partition.
- Skeleton: `app/routes`, `features`, `entities`, `shared`.
- State rubric: local state first, reducer/context second, machine for critical workflows.
- Forms: schema validation + accessible field primitives.
- Routing: route modules with loader/action model as needed.
- Async/data: query cache + mutation lifecycle with rollback.
- Testing: logic unit tests, component behavior tests, Playwright E2E.
- Build pipeline: Vite, route splitting, bundle budgets, source maps.
- Uniquely awesome demo: pluggable real-time dashboard tiles.

## Svelte Track

- Mental model: compiler-based reactivity with directness.
- Skeleton: route-first structure and domain stores.
- State rubric: local reactive vars, stores for shared state, explicit domain store for complexity.
- Forms: native form strengths + actions + accessible messaging.
- Routing: file-based routes with load and invalidation.
- Async/data: load + store-backed live updates.
- Testing: store logic tests + component tests + E2E.
- Build pipeline: SvelteKit adapters and pre-render policy.
- Uniquely awesome demo: lean report builder with high performance.

## Vue Track

- Mental model: SFC ergonomics and composable feature architecture.
- Skeleton: `pages`, `components`, `composables`, `stores`, `services`.
- State rubric: refs local, Pinia shared, state machine for high-risk workflows.
- Forms: composable validation with accessible field components.
- Routing: Vue Router with route meta guards.
- Async/data: composable query modules and cache policy.
- Testing: Vitest + Vue Test Utils + E2E.
- Build pipeline: Vite baseline; Nuxt when SSR justified.
- Uniquely awesome demo: permission-aware admin suite.

## HTMX Track (Baseline + Power User)

- Mental model: server owns state; client asks for HTML fragments.
- Skeleton: route templates + fragment endpoints + minimal JS helpers.
- State rubric: keep server-side by default; use URL and hidden fields carefully.
- Forms: native submit, server validation, field-level fragment rerender.
- Routing: server routes with optional boost behavior.
- Async/data: request/replace fragments, polling or SSE fallback.
- Testing: template and endpoint tests + journey E2E.
- Build pipeline: minimal JS bundle, strict cache policy for static assets.
- Uniquely awesome demo: full funnel with robust validation and low JS payload.

## Duos and Triads

- React + Tailwind
  - UX impact: high-speed UI iteration with design token discipline.

- Svelte + Vite + CSS variables
  - UX impact: responsive and animation-rich UI with low runtime overhead.

- Vue + Pinia + SSR (when justified)
  - UX impact: strong SEO plus maintainable app-state layering.

- Elm + Ports + progressive enhancement
  - UX impact: high correctness core with pragmatic interop seams.

- Flutter + responsive breakpoints + state choice
  - UX impact: consistent cross-device behavior from one codebase.

- HTMX + server templates + minimal JS
  - UX impact: strong reliability and accessibility with lower complexity.
