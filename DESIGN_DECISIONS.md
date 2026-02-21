# DESIGN_DECISIONS

## Why HTMX baseline exists

- Establishes a low-complexity, server-first reference implementation.
- Preserves semantic HTML and progressive enhancement as a non-negotiable baseline.
- Makes form/error behavior explicit before SPA abstractions.

## Why SPA version exists

- Validates same scenario under client-driven routing/state/fetch patterns.
- Surfaces tradeoffs in complexity, bundle strategy, and async handling.
- Provides comparative path for teams that need richer client interactivity.

## Problems this repo solves

- Defines one canonical scenario with realistic constraints.
- Provides shared fixtures/contracts to reduce implementation drift.
- Creates test and shipping guardrails for production-serious frontend work.

## What it does not solve yet

- Multi-scenario curriculum breadth.
- Real-time streaming workflows.
- Full design system and component library governance.
- Cross-framework parity beyond HTMX and React TS.

## Rules for responsible expansion

1. Do not add a new framework until canonical scenario parity and tests pass.
2. Do not add a second scenario until operational checks are stable.
3. Keep shared contracts/fixtures as the single source of truth.
4. Every major architectural change requires a decision log entry.
5. Avoid abstractions not required by at least two concrete implementations.
