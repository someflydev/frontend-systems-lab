# Scope Contract

## Repository Identity

This repo is:

- A constrained comparative lab for one canonical scenario (`SCN-001`).
- A systems-oriented reference showing one server-first baseline (`baseline-htmx`) and one SPA comparison (`react-ts`).
- A governance-driven artifact set where architecture decisions are documented before expansion.

This repo is not:

- A framework catalog.
- A UI pattern gallery.
- A generic starter kit for arbitrary apps.
- A trend sandbox for unbounded experimentation.

## Explicit Non-Goals

The repository explicitly refuses to solve:

- Multi-scenario breadth before current scenario hardening is complete.
- Multi-framework parity beyond current approved set.
- Reusable abstraction libraries without repeated proof across at least two maintained implementations.
- Feature expansion unrelated to architecture comparison, integrity, and governance.

## Hard Rejection Conditions

A proposal is rejected if any condition is true:

| ID | Rejection condition | Reason |
| --- | --- | --- |
| R1 | Adds a new framework | Violates controlled comparison scope |
| R2 | Adds a second scenario before SCN-001 gate pass | Depth-before-breadth policy |
| R3 | Introduces shared abstraction not used by both current implementations | Premature generalization |
| R4 | Increases total complexity budget beyond limit without approved offset plan | Structural risk |
| R5 | Lacks measurable acceptance criteria and rollback plan | Unverifiable change risk |

## Acceptance Checklist for New Additions

A change is accepted only if all are true:

| Check | Pass criterion |
| --- | --- |
| Scope alignment | Directly improves SCN-001 integrity, comparability, or governance |
| Bounded impact | Touches <= 3 top-level areas unless explicitly approved |
| Complexity budget | Net delta <= +2 points total or includes equivalent reduction plan |
| Test impact | Includes required test updates or explicit no-test rationale |
| Docs impact | Updates affected governance/decision docs in same change |
| Reversibility | Includes rollback steps and deletion path |
| Ownership | Names responsible owner/team |

## Decision Rules

1. Default decision is `defer` unless checklist is fully satisfied.
2. Any ambiguous proposal is treated as `Level 2: Caution` (see expansion gates).
3. If proposal introduces irreversible structure, require `Level 3` review even when small.
