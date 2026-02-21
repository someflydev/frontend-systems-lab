# tests

Quality gate artifacts for SCN-001 hardening.

## Unit

- `unit/validation.test.mjs`
- Prevents core validation rules from regressing.

## Component contract

- `component/react-contract.test.mjs`
- Prevents regressions in accessibility and resilience markers in the React implementation.

## Integration

- `integration/mock-api-submit.test.mjs`
- Prevents API contract drift and submit path breakage.

## E2E

- `e2e/funnel.e2e.mjs`
- Prevents route and scenario wiring regressions.

## Execution

- `npm run test`
- `node --test tests/component/*.test.mjs`
- `npm run test:integration`
- `npm run test:e2e`
- `npm run check:a11y`
- `npm run check:perf`
