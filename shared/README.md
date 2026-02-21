# shared

Shared assets that keep implementations aligned and comparable.

## JSON fixtures

- `fixtures/lead.valid.json`: canonical successful submission payload
- `fixtures/lead.invalid.json`: invalid payload for failure and validation paths
- `fixtures/failure-flags.json`: simulation switches for failure testing

## Contracts

- `contracts/lead-submission.contract.json`: canonical request shape
- `contracts/analytics-events.contract.json`: telemetry taxonomy and required fields

## Validation

- `validation/leadValidation.mjs`: shared validation rules used by baseline server and tests

## Operational consistency rules

1. Scenario identity remains `SCN-001` and `1.0.0` unless explicitly versioned.
2. Idempotency key is required for final submission mutation paths.
3. Telemetry must remain non-blocking and non-PII.
