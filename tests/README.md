# tests

Quality gate scaffolds for initial artifact phase.

## Unit example

- `unit/validation.test.mjs`
- Verifies shared contact and loan validation rules.

## Integration example

- `integration/mock-api-submit.test.mjs`
- Starts mock API and validates end-to-end submission acceptance for valid payload.
- Run with `npm run test:integration`.

## E2E example

- `e2e/funnel.e2e.mjs`
- Starts mock API + HTMX server and verifies core journey markers on live page.
- Run with `npm run test:e2e`.

## Accessibility check

- Executed via `npm run check:a11y`.
- Static semantic smoke check against baseline source.

## Performance budget placeholder

- Executed via `npm run check:perf`.
- Placeholder budget policy:
  - target client asset budget: 300 KB initial threshold
  - fails softly until production build artifacts exist
