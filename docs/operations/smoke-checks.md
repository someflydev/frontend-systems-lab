# Smoke Checks (Implementation Hardening Gate)

Scenario ID: `SCN-001`  
Scenario Name: `Mortgage Refinance Lead Funnel`

This file is the canonical implementation hardening gate for current scope.

## Gate A - Artifact Integrity

| Check | Command | Pass criteria | Fail criteria |
| --- | --- | --- | --- |
| Required outputs | `npm run verify:outputs` | command exits `0` | any missing required artifact/identifier mismatch |
| Scenario identifier consistency | `rg -n "SCN-001|Mortgage Refinance Lead Funnel" docs scenarios baseline-htmx react-ts` | identifiers present in canonical docs and implementations | identifier missing or conflicting name/version |

## Gate B - Quality Baseline

| Check | Command | Pass criteria | Fail criteria |
| --- | --- | --- | --- |
| Unit tests | `npm run test` | all tests pass | any failed test |
| Component contract test | `node --test tests/component/*.test.mjs` | all component contract checks pass | missing a11y/status contract markers |
| Accessibility smoke | `npm run check:a11y` | script exits `0` | missing baseline semantic markers |

## Gate C - Async and Failure Handling

| Check | Command | Pass criteria | Fail criteria |
| --- | --- | --- | --- |
| Integration submit path | `npm run test:integration` | valid payload accepted; idempotent replay stable | API contract or validation drift |
| E2E route availability | `npm run test:e2e` | baseline route renders scenario markers | critical route unavailable or wrong scenario |
| Retry hardening | manual: submit with `fail=server` for first attempts | UI shows bounded retries and terminal failure message | infinite retry loop or silent failure |
| WS reconnect + resync | manual: observe forced socket close cycle from mock API | reconnect status shown and advisor state updates recover | disconnected state persists > 15s |
| Upload cancelation | manual: start upload then cancel | cancel status visible, no app crash, submit still usable | UI lock or crash on cancel |

## Gate D - Performance and Deployment

| Check | Command | Pass criteria | Fail criteria |
| --- | --- | --- | --- |
| React production build | `npm run build --workspace react-ts` | build succeeds | build failure |
| Perf budget gate | `npm run check:perf` | gate passes against configured threshold once build exists | threshold exceeded |
| Runtime config path | `curl -s http://localhost:4010/api/runtime-config` | returns `release` and feature flags | missing runtime config keys |

## Hardening Exit Rule

Implementation hardening is `PASS` only when:

1. All Gate A and Gate B checks pass.
2. Gate C has no blocking failures.
3. Gate D build and perf checks pass.

Any failed required check results in `FAIL` and blocks release.
