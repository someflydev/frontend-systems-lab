# Section 8 - Initial Deliverables

This section defines concrete artifacts to generate in the first implementation run.

## Mandatory Initial Artifact Set

1. Repo tree scaffolding with placeholder READMEs.
2. One fully specified scenario: `SCN-001 Mortgage Refinance Lead Funnel v1.0`.
3. Baseline implementation: HTMX + server templates.
4. Second implementation: React + TypeScript.
5. Shared fixtures and mocks for success/failure/latency paths.
6. Testing scaffolds with one example at each layer.
7. Decision log template for architecture traceability.

## Scenario Contract for SCN-001

- Public funnel URL and mobile-first UX.
- Multi-step validation with idempotent final submission.
- Analytics-safe event schema for each step and completion.
- Shared API fixtures consumed by both implementations.
- CI gates passing for both HTMX and React variants.

## Required Test Scaffolds (one example each)

1. Unit: field and step validation logic.
2. Component: accessible error display and focus behavior.
3. Integration: multi-step submission against mocked backend.
4. E2E: complete conversion flow including failure/retry branch.
5. Accessibility: automated scanner invocation in CI.
6. Performance: starter budget assertion.

## Decision Log Template

```md
# DEC-YYYYMMDD-<title>
## Context
## Decision
## Options Considered
## Tradeoffs
## Risks
## Validation Plan
## Rollback Plan
## Follow-up Triggers
```

## Exit Criteria for Initial Run

1. All required artifacts exist in filesystem.
2. Scenario name/version is consistent across docs and implementations.
3. CI pipeline includes all mandatory gates.
4. Decision log created for key architectural choices.
