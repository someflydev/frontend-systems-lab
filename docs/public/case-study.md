# Case Study: SCN-001 Mortgage Refinance Lead Funnel

## One-Page Technical Distillation

### Context

`frontend-systems-lab` implements one canonical scenario (`SCN-001`) with two bounded implementations:

- `baseline-htmx` for server-first control path
- `react-ts` for richer async resilience patterns

The objective is not feature breadth; it is production-simulated depth under explicit constraints.

### Problem Shape

A refinance funnel must satisfy all of the following simultaneously:

1. Convert in low-latency and high-latency conditions.
2. Prevent duplicate lead creation under retries/timeouts.
3. Keep accessibility intact across validation-heavy interactions.
4. Preserve user trust during partial subsystem failures.
5. Emit operational telemetry suitable for incident response.

### Architecture Choices

1. Shared domain contract and validation rules:
   - `shared/contracts/lead-submission.contract.json`
   - `shared/validation/leadValidation.mjs`
2. Idempotent submit path with bounded retries:
   - `react-ts/src/App.tsx`
   - `baseline-htmx/src/server.mjs`
3. Async decomposition into isolated surfaces:
   - quote panel with stale-while-revalidate
   - websocket advisor feed with reconnect and resync
   - upload with progress and cancelation
4. Runtime feature/config control:
   - `GET /api/runtime-config` in `scripts/mock-api.mjs`

### Failure Handling Design

1. Slow quote API: stale cached quote shown, refresh attempted.
2. Submit failures: bounded exponential retry; explicit terminal failure state.
3. WS disconnect: reconnect loop with sequence-gap resync endpoint.
4. Upload errors: localized failure state; primary submit flow remains stable.

### Accessibility and UX Discipline

1. Step heading focus on transitions.
2. Error summary focus on validation failure.
3. `aria-invalid` and `aria-describedby` tied to field errors.
4. Live status region for submit/reconnect/offline messaging.

### Operational Guardrails

- Hardening gate: `docs/operations/smoke-checks.md`
- Release checklist: `docs/operations/production-readiness-checklist.md`
- Incident model: `docs/operations/postmortem-simulation.md`
- Governance controls: `docs/governance/*.md`

### Decision Story (Senior-Level Framing)

- We prioritized one scenario to maximize signal density.
- We used a server-first baseline to anchor correctness.
- We added client-side complexity only where asynchronous resilience demanded it.
- We refused additional frameworks and scenarios until hardening evidence exists.

### What Was Explicitly Avoided

1. Framework expansion without depth.
2. Abstraction layers unsupported by repeated use.
3. Educational simplification that hides operational failure modes.

### Evidence Inside This Repository

- Scenario spec: `docs/scenarios/canonical-scenario-spec.md`
- Implementation code:
  - `baseline-htmx/src/server.mjs`
  - `react-ts/src/App.tsx`
- Test and quality artifacts:
  - `tests/unit/validation.test.mjs`
  - `tests/component/react-contract.test.mjs`
  - `tests/integration/mock-api-submit.test.mjs`
  - `docs/operations/smoke-checks.md`
