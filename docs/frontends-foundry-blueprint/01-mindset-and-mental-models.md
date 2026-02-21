# Section 1 - Mindset and Mental Models

## 1) Document Model and Semantics

### HTML semantics

- What it is: HTML describes meaning, not layout decoration.
- Why it matters: better accessibility, SEO, and default browser behavior.
- How it fails: div soup, non-semantic click targets, unlabeled fields.
- How we test it: keyboard walkthrough, semantic linting, screen-reader spot checks.

### DOM events and forms

- What it is: event flow, input constraints, native validation lifecycle.
- Why it matters: reliable input handling with less custom JS.
- How it fails: double submit, focus confusion, inaccessible custom validation.
- How we test it: invalid input matrix, fast repeat submit test, focus order assertions.

## 2) Layout Model

### Flow, box, flex, grid, queries

- What it is: composable primitives for responsive structure.
- Why it matters: predictable behavior across device classes.
- How it fails: fixed-width assumptions, overflow bugs, brittle media query hacks.
- How we test it: viewport matrix screenshots, zoom 200 percent, long-content stress tests.

### Typography and spacing rhythm

- What it is: a tokenized scale for readable hierarchy.
- Why it matters: scanability and lower cognitive load.
- How it fails: inconsistent spacing and weak contrast.
- How we test it: contrast checks, token usage checks, readability review.

## 3) UX Model

### Feedback loops and latency hiding

- What it is: loading states, optimistic actions, undo and progress cues.
- Why it matters: user trust and perceived speed.
- How it fails: silent waits, false success, flicker.
- How we test it: 2s/5s/10s network simulation and delayed backend responses.

### Accessibility model

- What it is: keyboard-first flow, labels and landmarks first, ARIA only when needed.
- Why it matters: inclusion, legal safety, and interaction quality.
- How it fails: focus traps, missing error announcements, inaccessible custom controls.
- How we test it: automated a11y scan, manual keyboard path, critical screen-reader pass.

## 4) State Model

### State classes

- What it is: separate ephemeral UI state, app state, server state, and derived state.
- Why it matters: prevents duplicate source-of-truth errors.
- How it fails: stale copies, race conditions, impossible UI states.
- How we test it: state transition tests and route restore tests.

### State mechanisms

- What it is: machines/reducers/signals/stores/URL state/HTMX server-state bias.
- Why it matters: complexity should match mechanism.
- How it fails: global store for simple pages, ad hoc state for critical flows.
- How we test it: transition table tests and back-button consistency tests.

## 5) Data and IO Model

### HTTP, caching, storage

- What it is: request lifecycle, cache controls, ETag, bounded client storage.
- Why it matters: speed and correctness under real traffic.
- How it fails: stale cache bugs, insecure token handling, uncontrolled local persistence.
- How we test it: cache-header contract checks and stale-response simulations.

### Errors, retries, idempotency

- What it is: explicit retry rules and deduplication for writes.
- Why it matters: avoids duplicate mutations and unsafe recovery patterns.
- How it fails: retry storms and duplicate submissions.
- How we test it: fault injection and repeated-submit idempotency tests.

## 6) Async Model

### Concurrency primitives

- What it is: promises/tasks/futures/streams/subscriptions.
- Why it matters: ordering, cancellation, and cleanup correctness.
- How it fails: stale updates and leaked listeners.
- How we test it: race-condition tests and cancellation tests.

### WebSocket lifecycle

- What it is: connect/auth/heartbeat/reconnect/replay-resync.
- Why it matters: correctness under unstable networks.
- How it fails: missed messages, duplicate events, reconnect loops.
- How we test it: forced disconnect drills and sequence-gap checks.

## 7) Shipping Model

### Bundling and cacheability

- What it is: splitting, minification, hashed immutable assets.
- Why it matters: startup speed and safe deployments.
- How it fails: oversized initial bundle and stale asset serving.
- How we test it: bundle budgets, cache-header integration tests.

### CDN and image pipeline

- What it is: edge caching, invalidation strategy, responsive formats/sizes.
- Why it matters: largest practical performance gains.
- How it fails: wrong image variants and poor cache invalidation.
- How we test it: synthetic performance checks and cache hit-rate metrics.

## 8) Testing Model

### Quality layers

- What it is: unit, component, integration, E2E, a11y, visual, perf, contracts.
- Why it matters: fast feedback plus production confidence.
- How it fails: brittle E2E-heavy suites, missing contract guardrails.
- How we test it: deterministic fixtures and flake tracking.

## Frontend Decision Compass

Default weighting:

1. User trust and correctness (30)
2. Accessibility and UX clarity (20)
3. Maintainability (15)
4. Delivery velocity (15)
5. Performance (10)
6. Operational safety (10)

## Glossary

- Hydration: binding JS behavior to server-rendered HTML.
- Progressive enhancement: baseline works without JS.
- Idempotency key: dedupe key for safe retries.
- ETag: response validator for conditional requests.
- LCP: largest contentful paint.
- CLS: cumulative layout shift.
- INP: interaction to next paint.
- Backpressure: controlling producer rate when consumer is slower.
- Contract test: verifies API producer-consumer compatibility.
- Partial hydration: hydrate only interactive islands.

## Production Failure Modes

1. Duplicate writes from retries.
2. Sort/filter race conditions.
3. Broken keyboard flow in modal-heavy UI.
4. Stale content due to cache invalidation gaps.
5. WebSocket reconnect storms.
6. Chart unit/timezone mismatches.
7. Oversized images degrading LCP.
8. Missing audit context in admin actions.
9. Environment config drift.
10. Analytics events not matching actual behavior.
