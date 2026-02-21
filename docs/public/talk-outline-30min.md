# 30-Minute Deep-Dive Talk Outline

Title: **Engineering Frontend Authority Through Constraints: SCN-001 Deep Dive**

## 0-3 min: Why This Repository Exists

1. Scope discipline over framework breadth.
2. Production simulation over tutorial ergonomics.
3. Governance as a first-class architecture artifact.

## 3-8 min: Scenario and Constraints

1. Scenario identity and requirements (`SCN-001`).
2. Personas and operational constraints.
3. Failure model as design input, not post-hoc patching.

## 8-13 min: System Architecture

1. Baseline HTMX path for server-first control.
2. React path for async realism and state isolation.
3. Shared contracts and validation as invariant layer.

## 13-18 min: Async and Failure Semantics

1. Retry + backoff + idempotency submit path.
2. SWR quote panel behavior and stale rendering strategy.
3. WS reconnect/resync logic and sequence-gap handling.
4. Upload progress/cancel and fallback behavior.

## 18-22 min: UX and Accessibility

1. Focus management and error-summary flow.
2. Field-level semantics and live-region status updates.
3. Responsive behavior for mobile and larger displays.

## 22-26 min: Quality and Operational Controls

1. Smoke checks with explicit pass/fail criteria.
2. Production readiness checklist structure.
3. Governance gates: complexity budget and expansion control.

## 26-29 min: Incident Simulation Walkthrough

1. Postmortem scenario (`INC-SCN001-2026-02-21-WS-GAP`).
2. Root cause, user impact, fix, prevention loop.
3. How repository artifacts support faster recovery.

## 29-30 min: Closing

1. Why one deep scenario creates durable engineering signal.
2. How this approach scales across a systems portfolio.

## Suggested Demo Sequence

1. Show `react-ts/src/App.tsx` submit retry + ws block.
2. Show `scripts/mock-api.mjs` failure simulation controls.
3. Show `docs/operations/smoke-checks.md` gate table.
