# baseline-htmx

HTMX baseline for `SCN-001` (Mortgage Refinance Lead Funnel).

## Role in this repository

- Server-first reference implementation.
- Progressive enhancement and semantic form behavior baseline.
- Reliability benchmark for submission correctness (idempotency + retry).

## Interaction structure

- Contact step -> Loan step -> Consent/Submit.
- Server validates each step and returns focused error summaries.
- Submission uses idempotency key and retry/backoff to tolerate transient failures.

## Async behavior

- Submit path retries retriable failures (timeouts, 5xx, 429/408).
- Failure path returns actionable inline banner.
- Client events are posted to mock observability endpoint without blocking UX.

## Run

- `npm run dev:mock-api`
- `npm run dev:htmx`
- Visit `http://localhost:3001`
