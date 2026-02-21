# scripts

Operational scripts for running and validating the reference system.

- `mock-api.mjs`: production-simulated API server
- `check-a11y.mjs`: static accessibility smoke check
- `check-perf-budget.mjs`: performance budget gate scaffold
- `verify-outputs.sh`: required artifact and scope verification

## mock-api endpoint surface

- `GET /health`
- `GET /metrics`
- `GET /api/runtime-config`
- `POST /api/client-events`
- `GET /api/panels/rate-quote`
- `GET /api/advisor-availability/resync`
- `POST /api/uploads`
- `POST /api/leads/submit`
- `WS /ws/advisor-availability`

## Failure and latency simulation flags

Query params (supported per endpoint where applicable):

- `latencyMs=<int>`
- `fail=server`
- `fail=validation`
- `fail=timeout`

Process env:

- `MOCK_LATENCY_PROFILE=normal|slow|jitter`
- `MOCK_FAIL_MODE=none|server|validation|timeout|submit|quote|upload|all`
- `FLAG_UPLOADS=true|false`
- `FLAG_ADVISOR_FEED=true|false`
- `RELEASE_SHA=<string>`
