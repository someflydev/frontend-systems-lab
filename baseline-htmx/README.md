# baseline-htmx

HTMX baseline for `SCN-001` (Mortgage Refinance Lead Funnel).

## Template structure

- Full page shell is rendered by `src/server.mjs`.
- Funnel body swaps are rendered as step fragments:
  - contact step
  - loan step
  - consent step
  - success state

## Progressive enhancement

- Core interaction uses semantic form POSTs.
- HTMX adds partial updates using `hx-post`, `hx-target`, and `hx-swap`.
- If HTMX is unavailable, server routes remain form-compatible with normal POST semantics.

## Server-rendered fragments

- `/steps/contact` and `/steps/loan` return HTML fragments.
- `/submit` returns either consent fragment with error banner or success fragment.

## Validation strategy

- Shared validation in `shared/validation/leadValidation.mjs`.
- Step-level server validation prevents invalid progression.
- Final consent validation blocks unsafe submit.

## Partial reload logic

- `#funnel-root` is the swap target for all step transitions.
- Failed validation returns only step fragment, preserving context.

## Error handling UX

- Field-level errors are shown directly under controls.
- Service/network failures return a clear inline banner with retry guidance.

## Minimal JS

- No custom frontend framework.
- HTMX loaded from CDN for request/swap behavior.
- Analytics hooks can be attached via form hidden fields and server event processing.

## Folder structure

- `src/server.mjs`: HTTP server and fragment rendering
- `src/templates/`: reserved for extracted templates as complexity grows

## Run

- `npm run dev:htmx`
- Visit `http://localhost:3001`
