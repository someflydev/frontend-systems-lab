# frontend-systems-lab

Minimal, production-serious starter for comparative frontend systems work.

## Scope (initial)

- One canonical scenario: mortgage refinance lead funnel (multi-step, validation, analytics events)
- Baseline implementation: HTMX + server-rendered fragments
- Second implementation: React + TypeScript (Vite)
- Shared fixtures, contracts, validation logic, and test scaffolds

## Quick Start

1. Install dependencies:
   - `npm install`
2. Run mock API (optional for isolated testing):
   - `npm run dev:mock-api`
3. Run HTMX baseline:
   - `npm run dev:htmx`
4. Run React implementation:
   - `npm run dev:react`
5. Run tests and checks:
   - `npm run test`
   - `npm run check:a11y`
   - `npm run check:perf`

## Repository Contract

- Keep exactly one canonical scenario until validated.
- Add new frameworks only after scenario parity and gate pass.
- Keep shared fixtures/contracts authoritative across implementations.
