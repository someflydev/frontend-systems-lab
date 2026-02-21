# 5-Minute Talk Outline

Title: **From Demo to Production-Simulated Frontend: A Constraint-Driven Case Study**

## Minute 0-1: Problem Framing

- Most frontend repos optimize for breadth and novelty.
- This repo optimizes for one production-shaped scenario: `SCN-001`.
- Goal: prove correctness, failure handling, and operational readiness in a constrained system.

## Minute 1-2: Architecture Snapshot

- Two bounded implementations, one shared contract.
- HTMX baseline establishes server-first reliability path.
- React implementation demonstrates async resilience complexity.

## Minute 2-3: Hard Problems Solved

- Idempotent submit + bounded retries.
- SWR quote behavior under latency and partial failure.
- WS reconnect + sequence-gap resync.
- Upload progress + cancellation without blocking primary flow.

## Minute 3-4: Quality and Operations

- Accessibility semantics wired into core flow.
- Smoke gates and production readiness checklist in repo.
- Postmortem simulation included before incident occurs.

## Minute 4-5: Why This Matters

- Constraint creates authority.
- One deep scenario produces more engineering signal than many shallow demos.
- Repo serves as decision and governance system, not just code samples.

## References

- `docs/public/case-study.md`
- `docs/operations/smoke-checks.md`
- `docs/governance/SCOPE_CONTRACT.md`
