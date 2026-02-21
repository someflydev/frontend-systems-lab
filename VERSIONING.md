# Versioning Policy

This repository uses Semantic Versioning for release tags.

## Format

`MAJOR.MINOR.PATCH`

- MAJOR: scope contract or compatibility boundary changes.
- MINOR: additive hardening improvements within v1 scope.
- PATCH: fixes, documentation corrections, non-breaking quality updates.

## v1 Contract Rules

1. Any change that adds frameworks or scenarios requires MAJOR review and is blocked by default.
2. Any change that breaks canonical scenario artifact paths requires MAJOR review.
3. Governance and smoke-check criteria updates must include rationale in release notes.

## Change Classification

| Change type | Version bump |
| --- | --- |
| New scenario or framework | MAJOR |
| New hardening gate, non-breaking docs/process additions | MINOR |
| Bug fix or docs correction | PATCH |

## Release Preconditions

1. `docs/operations/smoke-checks.md` pass criteria met.
2. Scope contract not violated.
3. Changelog and release notes updated.
