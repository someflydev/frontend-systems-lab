# Roadmap

## v1.0.x Stabilization (Current Priority)

1. Improve deterministic integration/E2E execution under restricted environments.
2. Tighten performance gate measurements with build-time artifact snapshots.
3. Expand failure-mode validation coverage for reconnect and retry paths.
4. Keep scenario and framework scope frozen.

## v1.1 (Conditioned on v1.0.x stability)

1. CI wiring for smoke-check and governance gate reporting.
2. Structured release automation for changelog and notes consistency.
3. Additional hardening diagnostics for drift-signal tracking.

## Deferred Beyond v1.1

1. Any additional scenarios.
2. Any additional frameworks.
3. Large architectural expansion not required by current scope.

## Admission Rule for Future Additions

A future addition is eligible only if:

1. v1 smoke-check pass rate is stable over repeated runs.
2. complexity budget remains under caps.
3. expansion gate level is approved with required artifacts.
