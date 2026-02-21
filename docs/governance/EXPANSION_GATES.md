# Expansion Gate System

## Gate Levels

| Level | Name | Criteria | Required artifacts | Decision authority |
| --- | --- | --- | --- | --- |
| 1 | Allowed | Scope-aligned, budget delta <= +1, no new top-level domain | PR description + checklist pass | Maintainer |
| 2 | Caution | Budget delta +2 or cross-layer changes in >3 areas | Decision log update (`DESIGN_DECISIONS.md` or dedicated DEC file) | Maintainer + reviewer |
| 3 | High risk | Budget exceeds +2, introduces irreversible structure, or changes governance assumptions | Tradeoff document + rollback plan + success metrics | Architecture review |
| 4 | Rejected | Violates scope contract hard reject conditions | N/A | Auto reject |

## Evaluation Protocol

1. Classify proposal against scope contract rejection rules.
2. Compute complexity delta across all budget categories.
3. Assign gate level based on highest matching criterion.
4. Require artifacts per gate before merge.

## Example Proposals

| Proposal | Gate level | Why | Outcome |
| --- | --- | --- | --- |
| Tighten validation logic shared by HTMX and React with unit tests | Level 1 | Scope-aligned, low complexity delta | Allowed |
| Add centralized shared UI abstraction used by only React | Level 4 | Violates premature abstraction rule | Rejected |
| Introduce scenario-wide observability schema revision touching docs/tests/scripts | Level 2 | Cross-layer change, moderate complexity increase | Caution with decision log |
| Add second scenario before SCN-001 hardening gate evidence | Level 4 | Violates depth-before-breadth | Rejected |
| Replace current build scripts with multi-stage toolchain and runtime config loader | Level 3 | High irreversible complexity risk | Requires tradeoff doc |

## Gate-Specific Exit Criteria

### Level 1

- All acceptance checklist items pass.
- Complexity delta documented as `<= +1`.

### Level 2

- Level 1 criteria plus decision log rationale.
- Explicit list of alternatives considered.

### Level 3

- Level 2 criteria plus:
- rollback path tested/documented.
- measurable success/failure thresholds defined.
- planned complexity paydown date committed.

### Level 4

- Do not merge.
- Optionally re-submit with revised scope.
