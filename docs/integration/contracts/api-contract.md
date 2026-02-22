# API Contract (Cross-Lab Vertical Slice)

Status: `assumption` for external API implementation; `verified` for frontend contract intent.

## Verified Facts

1. `frontend-systems-lab` currently supports versioned scenario and telemetry concepts.
2. Existing frontend architecture can consume paged JSON APIs and websocket streams.

## Assumed External Contract

Base path: `/v1`

## Endpoint: GET /v1/analytics/funnel-metrics

Purpose: tenant-scoped aggregate metrics for dashboard panels.

### Query params

- `tenantId` (required, string)
- `from` (required, ISO timestamp)
- `to` (required, ISO timestamp)
- `groupBy` (optional, `hour|day`)
- `filter[channel]` (optional)
- `filter[errorClass]` (optional)

### Response 200

```json
{
  "schemaVersion": "1.0.0",
  "tenantId": "tenant-42",
  "window": { "from": "2026-02-20T00:00:00Z", "to": "2026-02-21T00:00:00Z" },
  "metrics": {
    "starts": 12840,
    "submissions": 3492,
    "conversionRate": 0.272,
    "retryRate": 0.083,
    "p95SubmitLatencyMs": 2410
  },
  "meta": {
    "generatedAt": "2026-02-21T18:00:00Z",
    "stale": false,
    "dataProfile": "analytics-hot-window"
  }
}
```

## Endpoint: GET /v1/analytics/failures

Purpose: paginated failure-event drilldown.

### Query params

- `tenantId` (required)
- `cursor` (optional)
- `pageSize` (optional, default 50, max 200)
- `sort` (optional, `eventTime:desc|eventTime:asc|errorClass:asc`)
- `filter[errorClass]` (optional)
- `filter[component]` (optional)

### Response 200

```json
{
  "schemaVersion": "1.0.0",
  "items": [
    {
      "eventId": "evt_01",
      "eventTime": "2026-02-21T17:58:03Z",
      "component": "submit-api",
      "errorClass": "upstream_timeout",
      "tenantId": "tenant-42",
      "correlationId": "corr_abc123"
    }
  ],
  "page": {
    "cursor": "next_cursor_token",
    "hasMore": true,
    "pageSize": 50
  }
}
```

## Versioning Strategy

1. Path-major versioning (`/v1`).
2. Payload schema version field for additive compatibility.
3. Breaking response changes require `/v2`.
4. Deprecation window minimum: 2 release cycles.
