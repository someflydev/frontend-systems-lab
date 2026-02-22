# Error Taxonomy (Cross-Lab Vertical Slice)

Status: `assumption` for backend implementation; `required` for frontend behavior mapping.

## Canonical Error Envelope

```json
{
  "error": {
    "code": "UPSTREAM_TIMEOUT",
    "category": "transient",
    "message": "Timed out waiting for aggregate query",
    "correlationId": "corr_abc123",
    "retryable": true,
    "httpStatus": 503,
    "details": {
      "component": "analytics-query",
      "tenantId": "tenant-42"
    }
  }
}
```

## Categories and Frontend Mapping

| Category | Example codes | Frontend behavior | Retry policy |
| --- | --- | --- | --- |
| `validation` | `INVALID_FILTER`, `INVALID_CURSOR` | inline filter error, preserve current results | none |
| `transient` | `UPSTREAM_TIMEOUT`, `STORE_BUSY` | panel-level degraded state + retry affordance | bounded retry |
| `availability` | `SERVICE_UNAVAILABLE` | global banner + partial data fallback | backoff retry |
| `authz` | `FORBIDDEN_TENANT` | block view + role guidance | none |
| `contract` | `SCHEMA_MISMATCH` | safe-state fallback + incompatibility notice | none (requires upgrade) |
| `unknown` | `UNHANDLED` | generic error with correlation ID | optional |

## Logging Requirements

1. Every error response must include `correlationId`.
2. Contract errors increment schema-drift metrics.
3. Transient errors include component classification for SLO dashboards.
