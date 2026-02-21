# Refactor or Delete Policy

## Decision Matrix

| Condition | Action | Deadline |
| --- | --- | --- |
| Same defect class repeats >= 3 times in 2 sprints | Refactor affected module/path | Next sprint |
| Complexity budget exceeds aggregate cap (`>20`) | Consolidate architecture and remove non-essential layers | Immediate freeze + 1 sprint |
| Drift hard trigger reached in any metric | Refactor first, block expansion | Immediate |
| Artifact unused for 2 releases and has no owner | Delete after deprecation notice | Within 1 release |
| Experimental path fails acceptance thresholds | Sunset experiment | Within 2 weeks |

## When to Refactor

Refactor if any are true:

1. Changes require touching >3 files for routine behavior update.
2. State transition logic is duplicated across implementations.
3. Test failures indicate coupling rather than business-rule breakage.

## When to Consolidate

Consolidate when:

1. Two paths solve the same concern with incompatible contracts.
2. Shared logic exists in 3+ places.
3. CI/runtime overhead grows faster than value delivered.

Consolidation requirement:

- Preserve one canonical implementation pattern per concern.

## When to Delete

Delete when any are true:

1. Artifact has no measurable consumer.
2. Artifact duplicates governed capability without better quality.
3. Artifact blocks budget recovery and lacks approved exception.

Deletion safety checklist:

| Check | Requirement |
| --- | --- |
| Dependency check | No active runtime/build dependency remains |
| Contract check | No schema/API contract references broken |
| Documentation check | References removed or redirected |
| Rollback check | Prior revision tag identified |

## Sunset Procedure for Experiments

1. Mark experiment as `deprecated` with removal date.
2. Announce replacement path or explicit non-replacement.
3. Remove experiment artifacts in one focused change.
4. Run verification suite and drift checks post-removal.
5. Update governance and decision logs with outcome.

## Integrity Guardrails During Sunset

- No partial removals spanning multiple unrelated PRs.
- No replacement abstractions introduced in same deletion PR.
- No scope expansion until budget returns to compliant range.
