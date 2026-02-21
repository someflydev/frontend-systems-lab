# Section 9 - Extension Playbook

## Add a New Scenario

1. Create `scenarios/SCN-###-slug/` with `scenario.yaml`, fixtures, contracts, stage gates.
2. Define persona, constraints, failure modes, and done criteria.
3. Implement HTMX baseline first, then one second stack.
4. Enforce parity checks before broad expansion.

## Add a New Framework

1. Create `apps/<framework>/` with standard project skeleton.
2. Implement one existing scenario to gate-defined parity.
3. Wire test, performance, and observability gates.
4. Publish capability notes and known tradeoffs.

## Evolve Design Tokens or Component Library

1. Version token changes in `shared/design-tokens`.
2. Run visual regression and accessibility diff checks.
3. Publish migration notes and update scenario references.
4. Block merge on unresolved token drift in critical paths.

## Add New Metrics and Drift Detection

1. Define metric and owner in shared QA docs.
2. Instrument event pipeline and dashboard panel.
3. Set thresholds and alert actions.
4. Add CI or scheduled checks where feasible.

## Add Deployment Targets

1. Define target profile and environment contract.
2. Validate caching/security headers for target.
3. Rehearse rollback and failure modes.
4. Capture decision log and operational runbook delta.

## Add Reporting Dashboards

1. Reuse scenario event taxonomy.
2. Provide conversion, reliability, perf, and a11y views.
3. Compare trends across stacks and scenario versions.
4. Review monthly for architecture drift and curriculum update needs.

## Long-Game Guardrails

1. Every new capability must map to a real scenario.
2. Every scenario must have measurable exit criteria.
3. Every stack addition must prove parity before expansion.
4. Every architectural choice must be logged.
