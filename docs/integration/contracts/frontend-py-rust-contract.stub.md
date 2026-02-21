# Contract Stub: frontend-systems-lab <-> py-rust-lab

Status: `assumption`

## Interface Intent

- Frontend consumes benchmark and profiling summaries from py-rust outputs.

## Expected Contract Surface

1. Versioned JSON payload for benchmark summaries.
2. Stable fields for metric name, value, unit, run timestamp, and git revision.
3. Explicit error payload shape for failed benchmark ingestion.

## Non-Claims

- No statement is made about existing endpoints or file formats in `py-rust-lab`.
