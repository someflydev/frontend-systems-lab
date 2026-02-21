# Section 7 - Testing System

## Quality Strategy

### Unit tests

- What it is: pure logic and domain rule verification.
- Why it matters: fastest confidence for high-risk behavior.
- How it fails: weak coverage of validation and transformations.
- How we test it: deterministic fixture-driven cases.

### Component tests

- What it is: interaction and rendering behavior in isolation.
- Why it matters: catches UI regressions early.
- How it fails: over-mocked tests that ignore real semantics.
- How we test it: role/label-oriented assertions and realistic event simulation.

### Integration tests

- What it is: component + mocked server interaction.
- Why it matters: validates async behavior and edge handling.
- How it fails: unrealistic mocks and missing error-path coverage.
- How we test it: latency/failure injected mock server scenarios.

### E2E tests

- What it is: browser-level critical workflow checks.
- Why it matters: validates true user path viability.
- How it fails: flaky selectors and timing assumptions.
- How we test it: stable test IDs, deterministic data fixtures, minimal retries.

### Accessibility tests

- What it is: automated plus manual keyboard and screen-reader checks.
- Why it matters: inclusive usability and compliance risk reduction.
- How it fails: false confidence from automation-only posture.
- How we test it: automated scanner + manual critical-flow audit.

### Visual regression

- What it is: screenshot diff across key viewports and states.
- Why it matters: catches drift from token/layout changes.
- How it fails: noisy snapshots and unstable dynamic content.
- How we test it: fixture-stabilized screenshots and threshold tuning.

### Performance budgets

- What it is: measurable thresholds for key UX metrics.
- Why it matters: prevents gradual degradation.
- How it fails: no budget ownership or gate bypasses.
- How we test it: CI budgets for bundle size and synthetic web vitals.

### Contract tests

- What it is: API schema compatibility checks.
- Why it matters: catches producer-consumer drift early.
- How it fails: schema unchecked against real responses.
- How we test it: schema validation in CI and sampled response checks.

## CI Gates

1. Lint + format + typecheck.
2. Unit + integration tests.
3. E2E smoke for critical path.
4. Accessibility gate.
5. Performance gate.
6. API contract gate.

## Severity Policy

1. Blocker: data corruption risk, auth bypass, inaccessible critical flow.
2. High: core flow broken under realistic latency/failure.
3. Medium: recoverable but user-impacting behavior drift.
4. Low: cosmetic and non-blocking defects.

## Scenario Release Exit Criteria

1. Critical path E2E is green.
2. No blocker/high a11y failures.
3. Performance budgets within thresholds.
4. Required observability events are emitted.
