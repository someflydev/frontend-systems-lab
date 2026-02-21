# Section 5 - Async and Realism

## Async Problem Set and Solution Patterns

1. Slow network (2s-10s), jitter, timeouts
   - Pattern: staged feedback (skeleton -> progress -> timeout recovery).
   - Stack adaptation: abort/cancel support and bounded retries.

2. Partial failure (some widgets fail)
   - Pattern: isolate widget failures and preserve rest of page usefulness.
   - Stack adaptation: per-widget query boundaries or fragment endpoints.

3. Retries with idempotency keys
   - Pattern: client key for all write retries; server dedupe window.
   - Stack adaptation: mutation helpers include key and retry metadata.

4. Optimistic vs pessimistic update tradeoffs
   - Pattern: optimistic only for reversible low-risk operations.
   - Stack adaptation: rollback state path and user-visible correction context.

5. Realtime updates with missed messages and resync
   - Pattern: sequence numbers, gap detection, replay endpoint.
   - Stack adaptation: reconnect state machine and de-duplication.

6. Server-driven pagination/sorting race conditions
   - Pattern: request token/version; ignore stale responses.
   - Stack adaptation: URL and query-key alignment.

7. File upload with progress and cancellation
   - Pattern: chunk upload when possible, cancel control, retry class handling.
   - Stack adaptation: progress events and resumable session IDs.

8. Background refresh and stale-while-revalidate
   - Pattern: show freshness timestamp; refresh in background.
   - Stack adaptation: cache policy module with user-visible stale state.

## Canonical Client Error Taxonomy

1. ValidationError: field + summary feedback.
2. AuthError: re-auth flow preserving intent.
3. PermissionError: explicit role requirement message.
4. NetworkError: retry and offline indicator.
5. TimeoutError: delayed-state UX and safe retry.
6. ConflictError: refresh/merge decision UI.
7. ServerError: support reference ID and recovery path.
8. UnknownError: generic safe message and telemetry capture.

## Latency Budget and UX Patterns

1. 0-100ms: no spinner.
2. 100-500ms: subtle busy indicator.
3. 500ms-2s: skeleton or progress hint.
4. 2s-10s: explicit progress + cancel/retry.
5. 10s+: background job pattern and completion notification.
