# react-ts

React + TypeScript implementation of `SCN-001` using Vite.

## Scope

Production-simulated canonical implementation focused on depth and operational maturity.

## Implemented hardening behaviors

- 3-step funnel with explicit focus and validation summary handling
- bounded submit retry with idempotency key reuse
- stale-while-revalidate quote panel with cache marker
- websocket advisor feed with reconnect and resync path
- file upload with progress and cancelation
- offline awareness and non-blocking client telemetry

## Run

1. `npm run dev:mock-api`
2. `npm run dev:react`
3. Visit `http://localhost:5173`

## Build and checks

- Build: `npm run build --workspace react-ts`
- Unit tests: `npm run test`
- Component contract: `node --test tests/component/*.test.mjs`
- Accessibility smoke: `npm run check:a11y`
- Performance gate: `npm run check:perf`
