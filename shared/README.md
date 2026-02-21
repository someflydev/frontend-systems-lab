# shared

Shared assets that keep implementations aligned and comparable.

## JSON fixtures

- `fixtures/lead.valid.json`: canonical successful submission payload
- `fixtures/lead.invalid.json`: invalid payload for failure and validation paths
- `fixtures/failure-flags.json`: simulation switches for failure testing

## Contracts

- `contracts/lead-submission.contract.json`: canonical request shape
- `contracts/analytics-events.contract.json`: event taxonomy and required fields

## Validation

- `validation/leadValidation.mjs`: shared pure validation used in tests and server paths

## Mock API plan

- Implemented by `scripts/mock-api.mjs`.
- Supports:
  - `POST /api/leads/submit`
  - `GET /health`
- Behavior controls through query flags:
  - `?latencyMs=2500`
  - `?fail=server`
  - `?fail=validation`
  - `?fail=timeout`
