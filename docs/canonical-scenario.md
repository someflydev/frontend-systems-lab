# Canonical Scenario: SCN-001 Mortgage Refinance Lead Funnel

## Why this scenario

Chosen because it combines conversion UX, high validation quality, analytics instrumentation, and failure-handling under latency without requiring premature domain breadth.

## Persona

- Homeowner comparing refinance options
- Goal: complete eligibility intake and request advisor callback in under 6 minutes

## Constraints

- Mobile-first completion path
- Desktop trust and clarity support
- Multi-step progression with resumable state
- Conversion-safe analytics events per step

## Data shape

- Applicant: full name, email, phone, zip code
- Loan context: home value, current loan balance, credit range
- Consent: TCPA-style opt-in timestamp and source
- Metadata: scenario ID/version, idempotency key

## Failure modes

- Validation failures (field and cross-field)
- Slow API response (2-10s)
- API timeout and retry pressure
- Duplicate submit risk
- Partial data loss during step transitions

## Latency assumptions

- p50 response: 450ms
- p95 response: 2.5s
- worst-case simulated: 10s

## Accessibility requirements

- Keyboard-complete flow across steps
- Label and error association for all fields
- Error summary region and focus handoff on invalid submit
- Sufficient contrast and visible focus styles

## Done means

- User can complete all steps and submit with idempotency safety
- Validation errors are clear and recoverable
- Analytics events emitted for view, step advance, validation fail, and final submit
- Same scenario contract is implemented in HTMX baseline and React TS app
