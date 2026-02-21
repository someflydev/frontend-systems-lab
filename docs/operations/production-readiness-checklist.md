# Production Readiness Checklist (SCN-001)

Scenario ID: `SCN-001`  
Scenario Name: `Mortgage Refinance Lead Funnel`

## Security Review

| Check | Pass criterion | Status |
| --- | --- | --- |
| Idempotent submit | repeated submits with same key return same tracking ID | `required` |
| PII handling in telemetry | no raw applicant PII in client event payloads | `required` |
| Runtime config isolation | no secrets in frontend bundle | `required` |
| Upload endpoint safety | non-2xx failures handled without UI crash | `required` |
| Baseline response headers | CSP + nosniff + frame/referrer policies present on HTML responses | `required` |
| CORS preflight handling | `OPTIONS` requests accepted for API endpoints used by browser client | `required` |

## Performance Review

| Check | Pass criterion | Status |
| --- | --- | --- |
| Submit latency under normal profile | p95 <= 2500ms | `required` |
| Bundle gate | `scripts/check-perf-budget.mjs` passes after build | `required` |
| Panel isolation | quote/advisor panel failures do not block funnel progression | `required` |

## Accessibility Audit

| Check | Pass criterion | Status |
| --- | --- | --- |
| Keyboard flow | all steps, submit, upload cancel reachable by keyboard | `required` |
| Error semantics | field-level + summary errors linked and announced | `required` |
| Live status | submit/reconnect status announced via polite live region | `required` |

## Cross-Browser Validation

| Check | Pass criterion | Status |
| --- | --- | --- |
| Chromium latest | critical path complete and telemetry emitted | `required` |
| Firefox latest | critical path complete and upload progress works | `required` |
| Safari latest | critical path complete and ws reconnect works | `required` |

## Cache Validation

| Check | Pass criterion | Status |
| --- | --- | --- |
| HTML cache policy | non-immutable, refresh-safe | `required` |
| Asset cache policy | hashed assets immutable | `required` |
| Quote stale cache behavior | stale value shown with marker during refresh | `required` |

## Error Boundary / Failure Validation

| Check | Pass criterion | Status |
| --- | --- | --- |
| Submit retry exhaustion | user sees actionable failure after max attempts | `required` |
| WS disconnect | reconnect status visible and resync restores advisor state | `required` |
| Upload cancel/error | status visible, submit remains usable | `required` |

## Release Decision Rule

Release is blocked if any `required` check fails.
