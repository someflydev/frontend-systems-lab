# Architectural Drift Detection

## Drift Signal Catalog

| Signal | Metric definition | Review threshold | Hard trigger |
| --- | --- | --- | --- |
| Build time growth | Median CI build minutes (rolling 10 runs) | > 20% increase over baseline | > 35% increase over baseline |
| Bundle size creep | Main client bundle size delta vs baseline | > 15% growth | > 25% growth |
| LOC growth by layer | Growth ratio across `shared`, `baseline-htmx`, `react-ts`, `tests` | Any layer > 2.0x fastest-growing peer | Any layer > 3.0x peer for 2 consecutive sprints |
| Test suite slowdown | Total test runtime (rolling 10 runs) | > 25% increase | > 40% increase |
| Documentation drift | Changed implementation files without linked docs updates | > 20% of change sets in sprint | > 30% of change sets in sprint |
| Duplicate logic emergence | Duplicate block count for validation/data mapping logic | >= 2 duplicate blocks | >= 4 duplicate blocks |

## Baseline and Measurement Rules

1. Baseline is first stable run after current governance adoption.
2. Re-baseline allowed only after approved refactor milestone.
3. All percentages are relative to active baseline.

## Trigger Actions

| Trigger level | Condition | Mandatory action |
| --- | --- | --- |
| Watch | Crosses review threshold once | Add drift note to next PR |
| Review | Crosses review threshold for 2 consecutive checks | Architecture review required before non-critical expansion |
| Freeze | Hits hard trigger | Freeze expansion; allow only remediation changes |

## Duplicate Logic Detection Scope

Monitor these logic domains specifically:

- field validation rules
- async error normalization
- event payload shaping
- request/retry policy logic

Threshold policy:

- `2-3` duplicates: consolidate plan required.
- `4+` duplicates: consolidation mandatory before further feature changes.
