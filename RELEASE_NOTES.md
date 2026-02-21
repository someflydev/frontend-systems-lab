# Release Notes - v1.0.0

Release date: 2026-02-21

## Included in v1.0.0

1. Canonical scenario `SCN-001 Mortgage Refinance Lead Funnel` with shared contracts and validation.
2. Two bounded implementations for the same scenario:
   - `baseline-htmx`
   - `react-ts`
3. Production-simulated async resilience in `react-ts`:
   - bounded retries with idempotency
   - SWR panel behavior
   - websocket reconnect/resync
   - upload progress and cancelation
   - offline and refresh recovery behavior
4. Operational documentation and hardening gates:
   - smoke checks
   - readiness checklist
   - postmortem simulation
5. Governance and decision artifacts for scope control and long-term integrity.

## Explicitly Excluded from v1.0.0

1. Additional scenarios beyond `SCN-001`.
2. Additional frameworks beyond `baseline-htmx` and `react-ts`.
3. Generic shared abstraction libraries not required by current scope.
4. SSR migration, edge deployment variants, and multi-tenant architecture expansion.

## Postponed to Future Versions

1. CI badge wiring and hosted release automation.
2. Full browser-matrix automation.
3. Stronger integration/E2E runtime checks in constrained environments.
4. Decision engine execution CLI implementation (docs/schema scaffold currently present).

## Release Risk Notes

1. `ws` dependency must be installed for realtime simulation.
2. Integration/E2E checks require local runtime that permits port binding.
3. Perf gate is strict only after production build artifacts exist.

## Upgrade/Run Notes

1. Install dependencies: `npm install`.
2. Validate outputs: `npm run verify:outputs`.
3. Run tests:
   - `npm run test`
   - `npm run test:component`
   - `npm run test:integration`
   - `npm run test:e2e`
4. Run smoke checks using `docs/operations/smoke-checks.md`.
