# Changelog

All notable changes to this repository are documented in this file.

## v1.0.0 - 2026-02-21

### Added

- Canonical scenario production spec: `docs/scenarios/canonical-scenario-spec.md`.
- Operations hardening docs:
  - `docs/operations/smoke-checks.md`
  - `docs/operations/production-readiness-checklist.md`
  - `docs/operations/postmortem-simulation.md`
- Public authority docs:
  - `docs/public/case-study.md`
  - `docs/public/talk-outline-5min.md`
  - `docs/public/talk-outline-30min.md`
  - `docs/public/blog-outline.md`
- Governance package:
  - `docs/governance/SCOPE_CONTRACT.md`
  - `docs/governance/COMPLEXITY_BUDGET.md`
  - `docs/governance/EXPANSION_GATES.md`
  - `docs/governance/DRIFT_SIGNALS.md`
  - `docs/governance/REFACTOR_OR_DELETE_POLICY.md`
- Decision engine docs and schema:
  - `docs/decision-engine/*`
  - `schemas/scenario.schema.json`

### Changed

- Hardened React canonical implementation (`react-ts/src/App.tsx`):
  - bounded submit retry/backoff with idempotency key
  - stale-while-revalidate quote panel
  - websocket reconnect and resync handling
  - upload progress/cancel flow
  - offline UX handling
  - draft recovery on refresh via session storage
- Hardened HTMX baseline (`baseline-htmx/src/server.mjs`):
  - step error summary behavior
  - idempotency-preserving submit path with retries
  - telemetry emission to mock event endpoint
- Upgraded mock API (`scripts/mock-api.mjs`):
  - runtime config endpoint
  - quote/resync/upload/event endpoints
  - websocket advisor stream simulation
  - idempotency-aware submit simulation
  - CORS + preflight handling for browser execution

### Security

- Added baseline HTML response security headers:
  - Content-Security-Policy
  - X-Content-Type-Options
  - X-Frame-Options
  - Referrer-Policy
- Added no-store cache headers to mock API responses.

### Quality Gates

- Strengthened output verification in `scripts/verify-outputs.sh`.
- Added component contract test: `tests/component/react-contract.test.mjs`.
- Added explicit performance budget check logic in `scripts/check-perf-budget.mjs`.

### Scope Notes

- v1.0.0 intentionally remains a single-scenario repository:
  - `SCN-001` only
  - `baseline-htmx` + `react-ts` only
