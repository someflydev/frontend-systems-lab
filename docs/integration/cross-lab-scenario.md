# Cross-Lab Scenario: SCN-001 Analytics Reliability Spine

Status: `integration-design`  
Scope: `frontend-systems-lab` + `data-storage-zoo` (optional interface to `py-rust-lab`)  
Scenario anchor: `SCN-001 Mortgage Refinance Lead Funnel`

## Verified Facts (Current Repository)

1. Canonical frontend scenario is `SCN-001` with async hardening and operations docs.
2. Runtime simulation endpoints and websocket behavior are modeled in `scripts/mock-api.mjs`.
3. Governance and release constraints enforce no framework/scenario expansion.

## Assumptions (External Repositories Unavailable)

1. `data-storage-zoo` exposes benchmarked storage profiles and query behavior via a service boundary.
2. Optional `py-rust-lab` contributes high-throughput aggregation or query execution service outputs.
3. Contract compatibility is managed through versioned schemas, not shared runtime code.

## Section 1 - System Selection

Chosen system: `Multi-tenant analytics SaaS reliability console` for refinance funnel operations.

### User personas

1. Operations manager: monitors drop-off, latency, error rates by tenant.
2. Support engineer: investigates failed submissions and retry behavior.
3. Product analyst: evaluates conversion and panel reliability trends.
4. SRE/on-call: responds to data-plane and realtime degradation.

### System boundaries

1. Frontend (`frontend-systems-lab`): dashboard surface, filters, pagination, realtime incident feed.
2. API gateway/service (assumed): provides analytics aggregates and failure event streams.
3. Storage engine layer (`data-storage-zoo`, assumed): profile-specific OLTP + OLAP tradeoff paths.
4. Optional compute (`py-rust-lab`, assumed): accelerated aggregation kernels.

### High-level API contracts

1. `GET /v1/analytics/funnel-metrics`
2. `GET /v1/analytics/failures`
3. `GET /v1/analytics/realtime-snapshot`
4. `WS /v1/realtime/incident-feed`

### Data flow

1. Frontend sends filter/sort/page query.
2. API resolves aggregates from selected storage profile.
3. API returns versioned payload with pagination metadata.
4. Frontend renders partial-failure tolerant panels.
5. Realtime channel pushes incident deltas and sequence IDs.

### Async boundaries

1. Aggregate panel requests are independent and fault-isolated.
2. Realtime feed is best-effort with resync endpoint fallback.
3. Exports/reports are asynchronous jobs with polling token.

### Failure propagation model

1. Storage slowdown affects query latency and potentially stale data windows.
2. Partial API route failures affect only corresponding UI modules.
3. Schema drift is treated as contract failure and downgraded to safe UI state.

### Observability signals

1. Client: route latency, panel failure count, ws reconnect attempts, sequence gap count.
2. API: request duration by route/filter cardinality, error taxonomy counts.
3. Storage: query p95/p99 by storage profile, index hit ratio, queue depth.

## Section 2 - Data Layer Integration (Assumption-Driven)

### Storage profile choice

Primary assumed profile: hybrid path

1. OLTP-like store for near-real-time submission/failure events.
2. Columnar/analytical store for tenant/time-window aggregates.

Reason: dashboard needs recent correctness and efficient historical slicing.

### Query patterns

1. Tenant + time-range aggregate (`daily`, `hourly`).
2. Filter by channel, error class, and retry outcome.
3. Sort by conversion rate, failure density, p95 latency.
4. Cursor pagination for events table.

### Caching strategy

1. API response cache for aggregate queries (TTL 15-60s by endpoint).
2. No-cache for failure/event drill-down routes.
3. Client SWR cache for selected panels with timestamp markers.

### Indexing assumptions

1. Composite index on `(tenant_id, event_time, event_type)`.
2. Secondary index on `(tenant_id, error_code, event_time)`.
3. Materialized rollups for hourly aggregates.

### Data volume estimates

1. 50-200 tenants.
2. 1M-8M events/day across all tenants.
3. 7-day hot query window, 90-day retained aggregate window.

### Performance tradeoffs

1. Lower-latency fresh reads increase write amplification.
2. Aggressive rollups reduce query cost but increase ETL lag risk.
3. Cursor pagination improves stability at high offset volumes.

## Section 3 - Frontend <-> API Contract

Full contract specs are in:

1. `docs/integration/contracts/api-contract.md`
2. `docs/integration/contracts/error-taxonomy.md`
3. `docs/integration/contracts/realtime-channel.md`

## Section 4 - Failure Cascade Simulation

### Database slowdown

- Frontend shows: stale panel marker + "data delayed" status.
- Backend logs: elevated query duration with storage profile tags.
- Recovery: reduce query window automatically; preserve user filter intent.

### Partial API failure

- Frontend shows: panel-level error card while other panels continue.
- Backend logs: route-specific 5xx with correlation IDs.
- Recovery: retry panel endpoints with bounded attempts.

### Corrupt payload

- Frontend shows: contract validation fallback and safe empty state.
- Backend logs: schema validation rejection event.
- Recovery: disable affected panel rendering path via feature flag.

### Schema drift

- Frontend shows: explicit "incompatible data version" message.
- Backend logs: request/response schema mismatch counters.
- Recovery: dual-read compatibility window and contract bump process.

### Realtime channel drop

- Frontend shows: reconnect status + last update timestamp.
- Backend logs: disconnect reason and reconnect success latency.
- Recovery: sequence-based resync endpoint fetch.

## Section 5 - Deployment Model

### Environment separation

1. `dev`: synthetic load + failure injection enabled.
2. `stage`: production-like topology and smoke-gate mandatory.
3. `prod`: conservative feature flag rollout.

### Docker

Assumed for API/storage integration surfaces; frontend remains static artifact plus runtime config.

### Hosting strategy

1. Frontend assets on CDN with immutable hashed assets.
2. API/realtime service on container orchestration layer.
3. Contract files versioned and published per release.

### Secrets

1. Runtime secrets in deployment platform only.
2. No secrets in frontend build artifacts.

### Observability stack

Assumed baseline:

1. Metrics: Prometheus-compatible counters/histograms.
2. Logs: structured JSON with correlation IDs.
3. Traces: route + storage query span linkage.

## Section 6 - Diagrams

See `docs/integration/system-diagrams.md`.

## Section 7 - Signal Value

1. Elevates frontend lab from isolated UI concerns to cross-boundary systems discipline.
2. Demonstrates realistic contract/version/failure governance across data and UX layers.
3. Prevents isolated-lab syndrome by forcing explicit integration assumptions and compatibility boundaries.
