# Cross-Lab System Diagrams

Status: `integration-design`  
Boundary note: diagrams include assumed external services from unavailable repositories.

## 1) System Diagram

```mermaid
flowchart LR
  U[Ops / Analyst User] --> FE[frontend-systems-lab\nReact + HTMX surfaces]
  FE --> API[Analytics API Gateway\nassumed service]
  API --> DS[(data-storage-zoo\nassumed storage profile)]
  API --> PR[py-rust-lab compute\noptional, assumed]
  API --> OBS[(Metrics/Logs/Traces)]
  FE --> WS[Realtime Incident Feed\nWebSocket]
  WS --> API
```

## 2) Data Flow Diagram

```mermaid
sequenceDiagram
  participant FE as Frontend
  participant API as Analytics API
  participant DS as Storage Layer
  participant WS as Realtime Channel

  FE->>API: GET /v1/analytics/funnel-metrics?tenant&range&filters
  API->>DS: Aggregate query by tenant/time/error class
  DS-->>API: Metrics payload + page token
  API-->>FE: v1 response (data + meta + schemaVersion)

  FE->>WS: Connect /v1/realtime/incident-feed
  WS-->>FE: snapshot(seq)
  WS-->>FE: incident_delta(seq+1)
  FE->>API: GET /v1/analytics/realtime-snapshot?after=seq (on gap)
  API-->>FE: resync snapshot
```

## 3) Failure Propagation Diagram

```mermaid
flowchart TD
  A[Storage slowdown] --> B[API aggregate latency spike]
  B --> C[Frontend panel timeout threshold crossed]
  C --> D[Panel shows stale data + delayed marker]
  B --> E[Metrics: p95/p99 elevated]

  F[Schema drift] --> G[Contract validation failure]
  G --> H[Frontend safe-state fallback]
  G --> I[Backend incompatibility alerts]

  J[WS drop] --> K[Reconnect loop]
  K --> L[Resync endpoint fetch]
  L --> M[State recovered or degraded mode retained]
```
