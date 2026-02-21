# Canonical Scenario Spec

Scenario ID: `SCN-001`  
Scenario Name: `Mortgage Refinance Lead Funnel`  
Scenario Version: `1.0.0`

## 1) Serious Scenario Definition

### User personas

1. Homeowner applicant: wants a refinance eligibility decision path in under 6 minutes.
2. Loan advisor: needs stable lead quality and complete contact + consent metadata.
3. Compliance reviewer: requires auditable consent and idempotent submission behavior.

### Realistic constraints

1. Funnel completion must work on low-end mobile and modern desktop.
2. Submission must tolerate transient backend failures without duplicate lead creation.
3. Quote panel and advisor availability must degrade independently (no whole-page failure).
4. Analytics and client error telemetry must be emitted for critical path events.

### Data volume assumptions

1. 8k-15k daily funnel starts.
2. 20-35% submit completion rate.
3. 4-8 advisor availability updates per minute during business hours.
4. Client event stream volume approximately 4x submission volume.

### Latency profiles

1. p50 API latency: 250-500 ms.
2. p95 API latency: 2.5 s.
3. simulated worst-case latency: 10 s.
4. websocket disconnect simulation every ~24 seconds (service restart behavior).

### Failure conditions

1. Server 503 during submit.
2. Timeout during quote fetch or submit.
3. Validation failure for user input.
4. websocket disconnect and sequence gap.
5. upload failure or user-initiated cancel.

### Accessibility requirements

1. Keyboard-only completion for all steps.
2. Explicit label association for all controls.
3. Focus handoff to step heading and error summary.
4. Live status region for submission and connectivity messages.

### Mobile + large-display behavior

1. Mobile (<960px): single-column stack with panels below form.
2. Desktop: split layout (form + support panels).
3. Large display (>=1440px): denser panel spacing and improved scanability.

### Security considerations

1. Idempotency key on submit to prevent duplicate mutations.
2. Client telemetry excludes raw PII and sends only operational metadata.
3. Runtime config loaded from API endpoint to avoid secret embedding in build.
4. Upload endpoint treated as untrusted input path with strict server-side validation expectations.

## 2) UX Architecture

### Interaction model

- What it is: strict 3-step funnel with server-backed auxiliary panels.
- Why it matters: preserves completion focus while adding decision context.
- How it fails: panel failures block primary CTA or step progression.
- How we test it: E2E step progression with forced panel failures.

### State boundaries

- What it is: form state local to funnel; quote/advisor/upload tracked independently.
- Why it matters: prevents one async stream from corrupting core form state.
- How it fails: shared mutable state introduces cross-panel regressions.
- How we test it: integration tests with mixed success/failure async responses.

### Error display patterns

- What it is: field-level error + error summary + non-blocking panel error.
- Why it matters: user can recover quickly without losing context.
- How it fails: errors shown only in toast/status text.
- How we test it: accessibility and component checks for linked error messaging.

### Loading states

- What it is: explicit loading text/progress by operation (quote, submit, upload, feed).
- Why it matters: avoids ambiguous waiting and duplicate actions.
- How it fails: hidden loading states causing repeated submits.
- How we test it: async tests asserting disabled submit and attempt counter.

### Optimistic vs pessimistic updates

- What it is: pessimistic submit (wait for server), optimistic panel refresh display from cache.
- Why it matters: protects data correctness while keeping perceived responsiveness.
- How it fails: optimistic submit creates duplicate or invalid lead state.
- How we test it: idempotency and retry tests under failure injection.

### Empty states

- What it is: quote and advisor panels explicitly explain missing prerequisites/data.
- Why it matters: removes ambiguity when optional data is unavailable.
- How it fails: blank panel areas with no guidance.
- How we test it: component contracts assert empty-state copy presence.

### Offline/reconnect behavior

- What it is: offline banner, submit disable, websocket reconnect with resync.
- Why it matters: avoids silent failure and stale real-time data.
- How it fails: hidden offline state and stale advisor status.
- How we test it: simulated offline events and websocket forced close cycles.

## 3) Async Realism Strategy

| Condition | UX strategy | Correctness rule |
| --- | --- | --- |
| Slow API | show operation-specific loading message | keep primary form editable except during submit |
| Partial failure | panel-level error blocks only panel, not funnel | isolate async state by panel |
| Stale-while-revalidate | show cached quote with stale marker while refreshing | cache key ties to zip + loan + credit |
| Retry with backoff | submit retries up to 3 attempts with bounded exponential delay | retry only on retriable errors (408/429/5xx/network) |
| WS disconnect + resync | show reconnect message; fetch resync snapshot | apply sequence monotonicity and resync on gap |
| Upload progress + cancel | show percent progress and cancel control | submit payload references uploaded file only on confirmed upload |

## 4) Performance Model

| Area | Target | Strategy | Tradeoff |
| --- | --- | --- | --- |
| JS bundle (initial) | <= 220KB gzipped for main app | keep single-scenario code path; avoid heavy libs | fewer prebuilt UI abstractions |
| Route/code splitting | deferred until second route required | preserve simpler startup and test paths | less granular lazy chunking |
| Lazy loading | advisor feed only when feature enabled and online | avoids unnecessary websocket cost | small delay on feed initialization |
| Image pipeline | no large hero assets in current funnel | avoid non-essential bytes | limited visual richness |
| Font loading | system fonts only | zero webfont blocking | less brand customization |
| Caching headers | immutable hashed assets, short TTL HTML | safe rollouts + cache efficiency | stricter deployment discipline |
| CDN invalidation | tag-based HTML purge, hashed asset permanence | minimizes cache poisoning | requires release coordination |

## 5) Accessibility and Responsiveness

### Keyboard flow

1. Step heading receives focus on step transition.
2. Error summary receives focus on validation failure.
3. All controls reachable and operable without pointer input.

### ARIA rules (minimal)

1. `aria-invalid` and `aria-describedby` only where errors exist.
2. `role=status` with `aria-live=polite` for status messaging.
3. `role=alert` for error summary and critical validation feedback.

### Color and contrast

1. Error text uses high-contrast red on light background.
2. Focus ring color and thickness remain visible on all control types.

### Responsive rules

1. Mobile: panels move below funnel and keep full-width controls.
2. Large display: two-column density with compact panel controls.

## 6) Testing Depth (Examples and prevention)

| Test layer | Example artifact | Prevents |
| --- | --- | --- |
| Unit | `tests/unit/validation.test.mjs` | invalid domain rules silently passing |
| Component | `tests/component/react-contract.test.mjs` | regressions in accessible UI contracts |
| Integration | `tests/integration/mock-api-submit.test.mjs` | API contract mismatch and idempotency drift |
| E2E | `tests/e2e/funnel.e2e.mjs` | broken critical path wiring |
| Accessibility | `scripts/check-a11y.mjs` | semantic regressions on baseline route |
| Performance gate | `scripts/check-perf-budget.mjs` | uncontrolled client asset growth |

## 7) Observability and Operations

### Client error logging

- Client sends non-blocking events to `POST /api/client-events`.
- Event types include validation failure, async failure, step progression, lead submission.

### Performance monitoring

- Capture submission latency and retry count in client events.
- Monitor API latency via mock endpoint profiles and smoke checks.

### Feature flags

- Runtime flags served from `GET /api/runtime-config`.
- Current flags: `uploads`, `advisorFeed`.

### Release gating

- New release must pass smoke checks and hardening criteria in `docs/operations/smoke-checks.md`.

### Rollback strategy

1. Disable unstable features via runtime flags.
2. Revert to previous release artifact while preserving API contract.
3. Keep idempotency and telemetry paths intact during rollback.

### Runtime config handling

- Config loaded at runtime; fallback defaults used if endpoint unavailable.
- Prevents environment-specific rebuild requirements for flag-only changes.
