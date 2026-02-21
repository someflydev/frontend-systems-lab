# scripts

Operational scripts for running and validating the initial repository.

- `mock-api.mjs`: mock API with latency and failure injection
- `check-a11y.mjs`: static accessibility smoke check
- `check-perf-budget.mjs`: initial performance budget placeholder
- `verify-outputs.sh`: validates required outputs and directory contract

## Failure injection examples

- slow response: `POST /api/leads/submit?latencyMs=2500`
- simulated server error: `POST /api/leads/submit?fail=server`
- simulated validation error: `POST /api/leads/submit?fail=validation`
- simulated timeout/no response: `POST /api/leads/submit?fail=timeout`
