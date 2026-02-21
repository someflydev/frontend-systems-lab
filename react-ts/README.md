# react-ts

React + TypeScript implementation of `SCN-001` using Vite.

## Project skeleton

- `src/main.tsx`: application mount
- `src/App.tsx`: multi-step funnel UI and submit flow
- `src/styles.css`: baseline styling
- `vite.config.ts`: build/dev config

## State management approach

- Local component state for this single-flow scope.
- State split by domain slice:
  - contact
  - loan
  - consent
  - current step

## Routing

- Initial implementation uses single-route flow.
- Scenario can be expanded to URL-backed steps when deep-link requirements are introduced.

## Async data handling

- `fetch` submission to mock API.
- Explicit submit status messaging for pending/success/failure.
- Idempotency key generated per final submit.

## Error boundaries

- Initial scope handles expected errors at form/action level.
- Global error boundary is deferred until multiple pages/components are introduced.

## Form validation

- Step-local synchronous validation before progression.
- Final consent check before submission.

## Build tooling

- Vite + React + TypeScript.
- Dev server: `npm run dev:react`.
- Production build: `npm run build --workspace react-ts`.

## Bundle strategy

- Keep initial bundle small and single-route.
- Let Vite emit hashed assets for cache safety.
- Introduce route/code splitting only when scenario breadth requires it.

## Meaningful differences vs HTMX baseline

- React version is client-state-driven.
- HTMX version is server-state-driven with fragment responses.
- Both share the same scenario contract and submission API shape.
