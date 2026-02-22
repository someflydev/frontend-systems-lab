# Integration Assumptions

## 2026-02-21 - Systems Portfolio Integration Assumptions

Context:

- The following repositories were referenced but are not available in this workspace:
  - `py-rust-lab`
  - `deep-learning-lab`
  - `data-storage-zoo`
  - `language-explorer`
  - `mobile-systems-lab`

Assumptions (interface-level only):

1. Each repository maintains its own internal architecture and deployment lifecycle.
2. Cross-repo integration is performed through documented contracts and shared governance patterns, not direct code coupling.
3. No claims are made here about concrete code artifacts inside unavailable repositories.

Portfolio coherence model:

1. `frontend-systems-lab`: user-facing reliability, async UX correctness, and frontend governance.
2. `py-rust-lab`: language/runtime performance and systems-level implementation discipline.
3. `deep-learning-lab`: model lifecycle rigor, reproducibility, and evaluation contracts.
4. `data-storage-zoo`: storage semantics, consistency/performance tradeoffs, durability benchmarks.
5. `language-explorer`: language behavior analysis and interoperability insights.
6. `mobile-systems-lab`: mobile runtime constraints, offline behavior, and device-level UX reliability.

Shared philosophy assumptions:

1. Constraint-first architecture.
2. Explicit failure-mode modeling.
3. Measurable quality gates.
4. Governance over trend-driven expansion.

## 2026-02-21 - Cross-Lab Vertical Slice Assumptions (SCN-001 Analytics Reliability Spine)

Verified facts in this repository:

1. `frontend-systems-lab` has canonical scenario `SCN-001` with async resilience and operations hardening docs.
2. Realtime feed/retry/failure simulation patterns are present in local mock infrastructure and frontend logic.
3. Governance docs enforce constrained expansion and release gates.

Assumptions for external repositories (not available in this workspace):

1. `data-storage-zoo` can expose storage profile behavior through a service boundary suitable for analytics queries.
2. Optional `py-rust-lab` can provide high-performance aggregation outputs consumable via versioned API contract.
3. External systems can emit correlation IDs and schema-versioned payloads compatible with integration contracts defined in:
   - `docs/integration/contracts/api-contract.md`
   - `docs/integration/contracts/error-taxonomy.md`
   - `docs/integration/contracts/realtime-channel.md`

Non-claims:

1. No code-level artifacts are claimed in external repositories.
2. No statement is made about concrete engine names, endpoints, or deployment internals outside this repository.
3. Contract docs above are design-level stubs pending cross-repo validation.
