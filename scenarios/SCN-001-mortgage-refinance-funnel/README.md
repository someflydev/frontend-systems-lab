# SCN-001 Mortgage Refinance Lead Funnel

## Intent

Collect qualified refinance leads through a 3-step funnel with strong validation, accessible UX, and analytics-safe event instrumentation.

## Acceptance Criteria

1. Three steps: contact, loan details, consent + submit.
2. Field and cross-field validation enforced.
3. Submission includes idempotency key.
4. Analytics event payload schema followed at each step.
5. Recoverable error UX for validation and API failures.

## Canonical Version

- `scenario_id`: `SCN-001`
- `scenario_version`: `1.0.0`
