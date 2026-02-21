# Contributing

This repository accepts contributions that strengthen `SCN-001` quality and governance clarity.

## Contribution Principles

1. Preserve scope: one scenario, two implementations, no framework expansion.
2. Prefer concrete hardening over new feature surface.
3. Update contracts, tests, and docs together for behavior changes.
4. Keep changes reversible and explicitly justified.

## Before Opening a PR

1. Read:
   - `docs/governance/SCOPE_CONTRACT.md`
   - `docs/governance/EXPANSION_GATES.md`
   - `docs/operations/smoke-checks.md`
2. Classify your proposal using gate levels (1-4).
3. If Level 2 or Level 3, include required decision artifacts.

## Required Local Checks

1. `npm run verify:outputs`
2. `npm run test`
3. `npm run test:component`
4. `npm run check:a11y`
5. `npm run check:perf` (after build where applicable)

## PR Requirements

1. Scope statement (what changed, what did not).
2. Complexity delta estimate (reference `docs/governance/COMPLEXITY_BUDGET.md`).
3. Risk and rollback notes.
4. Updated docs for any behavior/gate changes.

## Rejection Conditions

PR is rejected if it:

1. Adds frameworks, scenarios, or speculative abstraction layers.
2. Increases complexity without justified offset plan.
3. Omits tests/docs for meaningful behavior change.
4. Violates smoke-check hard pass/fail criteria.
