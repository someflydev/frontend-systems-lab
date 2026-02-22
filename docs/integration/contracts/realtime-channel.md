# Realtime Channel Contract

Status: `assumption` for backend websocket service; `required` for frontend consumption model.

## Channel

- Endpoint: `WS /v1/realtime/incident-feed`
- Topic scope: tenant-scoped operational incident deltas

## Message Types

### Snapshot

```json
{
  "type": "snapshot",
  "schemaVersion": "1.0.0",
  "seq": 401,
  "tenantId": "tenant-42",
  "incidents": []
}
```

### Delta

```json
{
  "type": "incident_delta",
  "schemaVersion": "1.0.0",
  "seq": 402,
  "tenantId": "tenant-42",
  "changes": [
    {
      "incidentId": "inc_77",
      "status": "open",
      "severity": "high",
      "component": "submit-api",
      "updatedAt": "2026-02-21T18:04:22Z"
    }
  ]
}
```

### Heartbeat

```json
{
  "type": "heartbeat",
  "ts": "2026-02-21T18:04:30Z"
}
```

## Client Rules

1. Track monotonic `seq`; if `incomingSeq > lastSeq + 1`, trigger resync.
2. Resync endpoint assumption: `GET /v1/analytics/realtime-snapshot?after=<seq>`.
3. On disconnect, reconnect with exponential backoff + jitter.
4. Display last-update timestamp and degraded realtime indicator while disconnected.

## Failure Semantics

1. Invalid message schema -> ignore message, increment client contract-failure counter.
2. Reconnect exhaustion -> switch to polling fallback mode (if available).
3. Tenant mismatch in payload -> drop message and log security warning.
