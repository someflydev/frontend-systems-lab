# Section 0 - Executive Overview

## Big Idea

App making is one discipline with multiple operating modes:

1. Site: communicate trust and discoverability.
2. Funnel: remove friction to a target conversion.
3. Web app: support repeated workflows and permissions.
4. Dashboard/report: compress data into decisions.
5. Realtime app: keep operational truth current.

These modes differ in emphasis, but share the same fundamentals:

- semantic UI
- state transitions
- data contracts
- async behavior
- rendering strategy
- shipping and operations

## Shape of Frontend Work

1. UI: structure, semantics, affordances.
2. State: local UI, app-level, server-derived, transient async.
3. Data: contracts, pagination, filtering, consistency.
4. Events: user actions, analytics, domain outcomes, failures.
5. Async: latency, cancellation, retries, eventual consistency.
6. Rendering: SSR/CSR/hydration/progressive enhancement.
7. Routing: URL as state, deep links, navigation correctness.
8. Performance: startup, interaction latency, payload discipline.
9. Accessibility: keyboard flow, readable semantics, clear feedback.

## Platform Architecture at a Glance

The platform is designed as a repeatable system rather than a tutorial set:

1. Shared scenario catalog drives all implementations.
2. Shared tokens, fixtures, and contracts ensure comparability.
3. Stage gates enforce quality and limit scope at each step.
4. Every stage ships a runnable artifact.
5. CI enforces correctness, a11y, performance, and contract integrity.

Operating loop:

1. Select scenario and version.
2. Select stage target.
3. Implement HTMX baseline first.
4. Implement one additional framework.
5. Run gates.
6. Publish artifact and decision log.

Exit condition for platform viability:

1. One scenario fully shipped in two stacks.
2. Shared contract and fixtures validated in both.
3. All CI gates green.
4. Decision log records tradeoffs and rejected options.
