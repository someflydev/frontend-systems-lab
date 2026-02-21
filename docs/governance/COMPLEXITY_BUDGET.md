# Complexity Budget Model

## Budget Categories and Rubric (1-5)

Scale semantics:

- `1`: minimal overhead, obvious behavior
- `2`: low overhead, straightforward maintenance
- `3`: moderate overhead, requires discipline
- `4`: high overhead, specialized ownership needed
- `5`: very high overhead, only justified by hard constraints

| Category | 1 | 3 | 5 |
| --- | --- | --- | --- |
| Cognitive complexity | Single-path logic, local state | Multiple flows with shared state boundaries | Cross-cutting state and non-obvious invariants |
| Build complexity | Single build path, low config | Multi-step build with environment conditions | Multi-tool chained build, fragile ordering |
| Deployment complexity | Single target, simple cache policy | Multiple targets with environment variance | Complex release choreography and rollback coupling |
| State model complexity | Mostly local state | Mixed local + shared state with explicit boundaries | Global state graph with complex synchronization |
| Async interaction complexity | Simple request/response | Concurrent requests with retries/timeouts | Realtime + reconciliation + backpressure logic |
| Testing overhead | Fast deterministic tests | Mixed unit/integration with moderate runtime | Heavy E2E reliance and high flake sensitivity |
| Maintenance risk | Clear ownership, low drift | Moderate churn and integration growth | Frequent drift, unclear ownership, high coupling |

## Repository Budget Caps

Current maximum allowed totals:

- Per-category cap: `4` (no category may reach `5` without exception approval).
- Aggregate cap: `20` across 7 categories.
- Per-change budget delta cap: `+2` net points.
- Quarterly drift tolerance: `+3` net points total before mandatory consolidation sprint.

## Current Baseline Budget (Target)

| Category | Baseline target |
| --- | ---: |
| Cognitive complexity | 2 |
| Build complexity | 2 |
| Deployment complexity | 2 |
| State model complexity | 2 |
| Async interaction complexity | 2 |
| Testing overhead | 2 |
| Maintenance risk | 2 |
| **Total** | **14** |

## Budget Burn Rate Model

Definition:

- `burn_rate = (current_total - baseline_total) / elapsed_weeks`

Thresholds:

- Green: `<= 0.10` points/week
- Yellow: `0.11 - 0.25` points/week
- Red: `> 0.25` points/week

Policy actions:

| Burn band | Required action |
| --- | --- |
| Green | Continue; track only |
| Yellow | Require complexity-offset note for each new proposal |
| Red | Freeze expansion; only refactor/consolidation changes allowed |

## Exception Process

A budget exception requires:

1. Decision log entry with quantified benefit.
2. Time-boxed rollback plan (<= 2 releases).
3. Named reduction plan returning under cap by deadline.
